import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";

vi.mock("../../src/store/actions/typeWriter", () => ({
  typeWriter: async () => {},
  typeWriterPopup: async () => {},
}));

import { store } from "../../src/store";
import PopupDao from "../../src/components/PopupDao.vue";
import { showDaoPopup } from "../../src/components/composables/gameRefs";
import { expectNoUnknownVuexType, spyConsoleError } from "./helpers";

let errorSpy: ReturnType<typeof vi.spyOn>;
let randomSpy: ReturnType<typeof vi.spyOn>;
let wrapper: VueWrapper;

beforeEach(() => {
  vi.stubGlobal("setTimeout", ((fn: () => void) => {
    fn();
    return 0;
  }) as unknown as typeof setTimeout);
  randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);
  errorSpy = spyConsoleError();
  store.commit("resetGame");
  showDaoPopup.value = true; // 让 PopupSub 渲染其 slot
});

afterEach(() => {
  wrapper?.unmount();
  vi.unstubAllGlobals();
  randomSpy.mockRestore();
  errorSpy.mockRestore();
  showDaoPopup.value = false;
});

function clickButton(text: string) {
  const btn = wrapper.findAll("button").find((b) => b.text() === text);
  if (!btn) throw new Error(`button not found: ${text}`);
  return btn.trigger("click");
}

describe("PopupDao.vue", () => {
  it("诵读经书：才华+10、神秘属性+10、推进回合", async () => {
    wrapper = mount(PopupDao);

    await clickButton("诵读经书");
    await flushPromises();

    expect(store.state.character.attributes.talent).toBe(10);
    expect(store.state.character.attributes.divine).toBe(10);
    // 现状：诵读/学习/潜心修行的 case 内已 incrementRound，函数末尾又 incrementRound 一次 →
    // 这三项各推进【2 回合】（疑似既有的双推进 bug，此处锁定现状，未修改行为）。
    expect(store.state.gameLoop.round).toBe(3);
    expectNoUnknownVuexType(errorSpy);
  });

  it("上山打怪（首次，等级26）：fightLevel+1→27、体力-60、神秘+1、推进回合", async () => {
    wrapper = mount(PopupDao);

    await clickButton("上山打怪");
    await flushPromises();

    expect(store.state.character.attributes.fight.level).toBe(27); // updateAttribute fightLevel 特判
    expect(store.state.character.attributes.energy).toBe(40); // 100 - 60
    expect(store.state.character.attributes.divine).toBe(1);
    expect(store.state.gameLoop.round).toBe(2);
    expectNoUnknownVuexType(errorSpy);
  });
});
