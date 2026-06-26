import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";

vi.mock("../../src/store/actions/typeWriter", () => ({
  typeWriter: async () => {},
  typeWriterPopup: async () => {},
}));

import { store } from "../../src/store";
import DialogBreakup from "../../src/components/DialogBreakup.vue";
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
  store.commit("setGirlfriend", { type: "学姐", effect: "charm", breakupReasons: ["异地"] });
  store.state.relationship.accompanyCount = 5;
  store.state.relationship.relationRound = 10;
});

afterEach(() => {
  wrapper?.unmount();
  vi.unstubAllGlobals();
  randomSpy.mockRestore();
  errorSpy.mockRestore();
});

function clickButton(text: string) {
  const btn = wrapper.findAll("button").find((b) => b.text() === text);
  if (!btn) throw new Error(`button not found: ${text}`);
  return btn.trigger("click");
}

describe("DialogBreakup.vue", () => {
  it("拜拜就拜拜：清空女友并重置 relationship 计数（relationship/resetAccompanyCount·resetRelationRound）", async () => {
    wrapper = mount(DialogBreakup);

    await clickButton("拜拜就拜拜");
    await flushPromises();

    expect(store.state.relationship.girlfriend).toBeNull();
    expect(store.state.relationship.accompanyCount).toBe(0);
    expect(store.state.relationship.relationRound).toBe(0);
    expectNoUnknownVuexType(errorSpy);
  });

  it("挽回成功（random<0.52）：保留女友、魅力+20、重置计数", async () => {
    wrapper = mount(DialogBreakup);

    await clickButton("挽回");
    await flushPromises();

    expect(store.state.relationship.girlfriend).not.toBeNull();
    expect(store.state.character.attributes.charm).toBe(20);
    expect(store.state.relationship.accompanyCount).toBe(0);
    expectNoUnknownVuexType(errorSpy);
  });
});
