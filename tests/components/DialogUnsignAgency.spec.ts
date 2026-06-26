import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";

vi.mock("../../src/store/actions/typeWriter", () => ({
  typeWriter: async () => {},
  typeWriterPopup: async () => {},
}));

import { store } from "../../src/store";
import DialogUnsignAgency from "../../src/components/DialogUnsignAgency.vue";
import { expectNoUnknownVuexType, spyConsoleError } from "./helpers";

let errorSpy: ReturnType<typeof vi.spyOn>;
let wrapper: VueWrapper;

beforeEach(() => {
  vi.stubGlobal("setTimeout", ((fn: () => void) => {
    fn();
    return 0;
  }) as unknown as typeof setTimeout);
  errorSpy = spyConsoleError();
  store.commit("resetGame");
  store.commit("setSignedAgency", true);
});

afterEach(() => {
  wrapper?.unmount();
  vi.unstubAllGlobals();
  errorSpy.mockRestore();
});

function clickButton(text: string) {
  const btn = wrapper.findAll("button").find((b) => b.text() === text);
  if (!btn) throw new Error(`button not found: ${text}`);
  return btn.trigger("click");
}

describe("DialogUnsignAgency.vue", () => {
  // 回归：原先 `store.state.money`（顶层不存在该字段）使「支付剩余金钱」分支自古为死代码。
  // 修复为 store.state.character.attributes.money 后，接受解约会把 636 万之外的结余也付清。
  it("接受解约：扣 636 万后把剩余金钱全部付清（修复后 money 归零）并结束游戏", async () => {
    // 已签约时 updateAttribute 正向金钱会二八分（×0.2），这里直接置值以避免干扰本测试。
    store.state.character.attributes.money = 10000000;

    wrapper = mount(DialogUnsignAgency);
    await clickButton("申请解约");
    await flushPromises();
    await clickButton("接受");
    await flushPromises();

    expect(store.state.character.attributes.money).toBe(0); // 10,000,000 - 6,000,000 - 360,000 - 3,640,000
    expect(store.state.gameLoop.gameEnded).toBe(true);
    expectNoUnknownVuexType(errorSpy);
  });
});
