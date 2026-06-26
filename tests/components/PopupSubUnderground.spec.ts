import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";

vi.mock("../../src/store/actions/typeWriter", () => ({
  typeWriter: async () => {},
  typeWriterPopup: async () => {},
}));

import { store } from "../../src/store";
import PopupSubUnderground from "../../src/components/PopupSubUnderground.vue";
import { showUndergroundPopup } from "../../src/components/composables/gameRefs";
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
  showUndergroundPopup.value = true; // 让 PopupSub 渲染其 slot
});

afterEach(() => {
  wrapper?.unmount();
  vi.unstubAllGlobals();
  randomSpy.mockRestore();
  errorSpy.mockRestore();
  showUndergroundPopup.value = false;
});

function clickButton(text: string) {
  const btn = wrapper.findAll("button").find((b) => b.text() === text);
  if (!btn) throw new Error(`button not found: ${text}`);
  return btn.trigger("click");
}

describe("PopupSubUnderground.vue", () => {
  it("巡演「第九百步」：progress/incrementTourCount + progress/updateItem + 推进回合", async () => {
    wrapper = mount(PopupSubUnderground);

    await clickButton("巡演「第九百步」");
    await flushPromises();

    expect(store.state.progress.tourCount[0]).toBe(1);
    expect(store.state.progress.inventory["皮卡丘玩偶"].quantity).toBe(3); // floor(0.5*5)+1
    expect(store.state.character.attributes.money).toBe(10000);
    expect(store.state.gameLoop.round).toBe(2); // incrementRound
    expectNoUnknownVuexType(errorSpy);
  });

  it("活动「上节目」：updateAttribute（才华/魅力+30）+ 推进 3 回合", async () => {
    wrapper = mount(PopupSubUnderground);

    await clickButton("上节目（1个月）");
    await flushPromises();

    expect(store.state.character.attributes.talent).toBe(30);
    expect(store.state.character.attributes.charm).toBe(30);
    expect(store.state.character.attributes.money).toBe(20000);
    expect(store.state.gameLoop.round).toBe(4); // incrementRound ×3
    expectNoUnknownVuexType(errorSpy);
  });
});
