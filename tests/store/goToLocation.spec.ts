import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/store/actions/typeWriter", () => ({
  typeWriter: async () => {},
  typeWriterPopup: async () => {},
}));

import { store } from "../../src/store";
import { showFoodPopup, showDrinkPopup, showShopPopup, showUndergroundPopup } from "../../src/components/composables/gameRefs";

// goToLocation 447 行、零测试，是 namespaced 迁移的另一重灾区。覆盖主要地点分支。
let randomSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubGlobal("setTimeout", ((fn: () => void) => {
    fn();
    return 0;
  }) as unknown as typeof setTimeout);
  randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);
  store.commit("resetGame");
  showFoodPopup.value = false;
  showDrinkPopup.value = false;
  showShopPopup.value = false;
  showUndergroundPopup.value = false;
});

afterEach(() => {
  vi.unstubAllGlobals();
  randomSpy.mockRestore();
});

describe("goToLocation 主要地点", () => {
  it("去吃点东西：解锁一种新食物并打开食物弹窗", async () => {
    await store.dispatch("goToLocation", "去吃点东西");
    expect(store.state.progress.unlockedFoods.length).toBe(1);
    expect(showFoodPopup.value).toBe(true);
  });

  it("去喝点东西：打开喝的弹窗", async () => {
    await store.dispatch("goToLocation", "去喝点东西");
    expect(showDrinkPopup.value).toBe(true);
  });

  it("买东西：打开商店弹窗", async () => {
    await store.dispatch("goToLocation", "买东西");
    expect(showShopPopup.value).toBe(true);
  });

  it("去剪头发（没钱）：给出提示、不扣钱不推进回合", async () => {
    await store.dispatch("goToLocation", "去剪头发");
    expect(store.state.character.attributes.money).toBe(0);
    expect(store.state.character.attributes.charm).toBe(0);
    expect(store.state.gameLoop.round).toBe(1);
  });

  it("去剪头发（有钱、无墨镜）：花费100、魅力-10、推进回合", async () => {
    store.commit("updateAttribute", { attribute: "money", value: 200 });
    await store.dispatch("goToLocation", "去剪头发");
    expect(store.state.character.attributes.money).toBe(100);
    expect(store.state.character.attributes.charm).toBe(-10);
    expect(store.state.gameLoop.round).toBe(2);
  });

  it("Underground（首次）：体力-25、红黑人气+1、地下次数+1、推进回合", async () => {
    await store.dispatch("goToLocation", "Underground");
    expect(store.state.character.attributes.energy).toBe(75);
    expect(store.state.character.attributes.popularity.red).toBe(1);
    expect(store.state.character.attributes.popularity.black).toBe(1);
    expect(store.state.progress.undergroundCount).toBe(1);
    expect(store.state.gameLoop.round).toBe(2);
  });
});
