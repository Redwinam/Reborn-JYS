import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/store/actions/typeWriter", () => ({
  typeWriter: async () => {},
  typeWriterPopup: async () => {},
}));

import { store } from "../../src/store";
import { isAtHome } from "../../src/components/composables/gameRefs";

let randomSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubGlobal("setTimeout", ((fn: () => void) => {
    fn();
    return 0;
  }) as unknown as typeof setTimeout);
  randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);
  store.commit("resetGame");
  isAtHome.value = false;
});

afterEach(() => {
  vi.unstubAllGlobals();
  randomSpy.mockRestore();
});

describe("accompanyGirlfriend", () => {
  it("没有女朋友时不改变陪伴计数", async () => {
    await store.dispatch("accompanyGirlfriend");
    expect(store.state.relationship.accompanyCount).toBe(0);
  });

  it("首次陪伴：体力-50、进入虚弱、陪伴计数+1、好感属性提升", async () => {
    store.commit("setGirlfriend", { type: "学姐", effect: "charm", breakupReasons: [] });
    await store.dispatch("accompanyGirlfriend");
    expect(store.state.relationship.accompanyCount).toBe(1);
    expect(store.state.character.attributes.energy).toBe(50);
    expect(store.state.character.weak).toBe(true);
    // girlfriendEffect=charm，charm += floor(0.5 * 11) = 5
    expect(store.state.character.attributes.charm).toBe(5);
  });
});
