import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

import { store } from "../../src/store";
import PopupCharacter from "../../src/components/PopupCharacter.vue";

// 组件测试基建的第一个范例：验证「真实 store + 嵌套 state 路径」在组件里既能正确渲染、
// 也能由交互触发 commit。组件用 useStore() 拿到的是真实单例，故这是集成式测试。
let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  store.commit("resetGame");
});

afterEach(() => {
  errorSpy.mockRestore();
});

function expectNoUnknownVuexType() {
  const offending = errorSpy.mock.calls
    .flat()
    .filter((m) => typeof m === "string" && (m.includes("unknown mutation type") || m.includes("unknown action type")));
  expect(offending).toEqual([]);
}

describe("PopupCharacter.vue", () => {
  it("把嵌套 state（character.attributes / gameLoop.round）渲染到 DOM", () => {
    store.commit("updateAttribute", { attribute: "talent", value: 88 });
    store.commit("updateAttribute", { attribute: "money", value: 12345 });

    const wrapper = mount(PopupCharacter);
    const text = wrapper.text();

    expect(text).toContain("88"); // 才华
    expect(text).toContain("12345"); // 金钱
    expect(text).toContain("15岁"); // floor((1-16)/36)+16 = 15
  });

  it("点击「双子座」触发 gemini 作弊：更新属性并推进 10 回合（组件→store 链路）", async () => {
    const wrapper = mount(PopupCharacter);
    const gemini = wrapper.findAll("span").find((s) => s.text() === "双子座");
    expect(gemini).toBeTruthy();

    await gemini!.trigger("click");

    expect(store.state.character.attributes.talent).toBe(100);
    expect(store.state.character.attributes.charm).toBe(100);
    expect(store.state.character.attributes.divine).toBe(300);
    expect(store.state.gameLoop.round).toBe(11); // 初始 1 + incrementRound ×10
    expectNoUnknownVuexType();
  });
});
