import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";

vi.mock("../../src/store/actions/typeWriter", () => ({
  typeWriter: async () => {},
  typeWriterPopup: async () => {},
}));

import { store } from "../../src/store";
import PopupFengyan from "../../src/components/PopupFengyan.vue";
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
  // artists 是共享数组，重置等级与本季动作避免跨测试 bleed。
  store.state.business.artists.forEach((a: { level: number }) => (a.level = 0));
  store.commit("business/resetThisSeasonArtist");
});

afterEach(() => {
  wrapper?.unmount();
  vi.unstubAllGlobals();
  errorSpy.mockRestore();
});

function clickButton(text: string, nth = 0) {
  const btns = wrapper.findAll("button").filter((b) => b.text() === text);
  if (!btns[nth]) throw new Error(`button not found: ${text} #${nth}`);
  return btns[nth].trigger("click");
}

const artist = (name: string) => store.state.business.artists.find((a: { name: string }) => a.name === name)!;

describe("PopupFengyan.vue", () => {
  it("招募艺人：root recruitArtist —— 等级+1、记本季 move、扣 80 万", async () => {
    store.commit("updateAttribute", { attribute: "money", value: 1000000 });
    wrapper = mount(PopupFengyan);

    await clickButton("招募"); // 第一位艺人（丙丙）
    await flushPromises();

    expect(artist("丙丙").level).toBe(1);
    expect(store.state.business.thisSeasonArtist.move).toEqual({ name: "丙丙", action: "招募" });
    expect(store.state.character.attributes.money).toBe(1000000 - 800000);
    expectNoUnknownVuexType(errorSpy);
  });

  it("派遣 1 级艺人：progress/updateItem（冰箱）+ root dispatchArtist", async () => {
    artist("丙丙").level = 1; // 直接置为已招募
    store.commit("business/resetThisSeasonArtist");
    wrapper = mount(PopupFengyan);

    await clickButton("派遣"); // 丙丙是唯一 level>0 的艺人
    await flushPromises();

    expect(store.state.business.thisSeasonArtist.dispatch).toContain("丙丙");
    expect(store.state.progress.inventory["冰箱"].quantity).toBe(1);
    expectNoUnknownVuexType(errorSpy);
  });
});
