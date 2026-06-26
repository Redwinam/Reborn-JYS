import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/store/actions/typeWriter", () => ({
  typeWriter: async () => {},
  typeWriterPopup: async () => {},
}));

import { store } from "../../src/store";

beforeEach(() => {
  store.commit("resetGame");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("eatFood", () => {
  it("已解锁且有钱：扣除餐费、恢复体力", async () => {
    store.commit("unlockFood", { name: "火锅", cost: 60, energy: 100, taste: "spicy" });
    store.commit("updateAttribute", { attribute: "money", value: 100 });
    await store.dispatch("eatFood", "火锅");
    expect(store.state.attributes.money).toBe(40);
    expect(store.state.attributes.energy).toBeGreaterThan(100);
  });

  it("钱不够：不扣钱、不回体力", async () => {
    store.commit("unlockFood", { name: "火锅", cost: 60, energy: 100, taste: "spicy" });
    const energyBefore = store.state.attributes.energy;
    await store.dispatch("eatFood", "火锅");
    expect(store.state.attributes.money).toBe(0);
    expect(store.state.attributes.energy).toBe(energyBefore);
  });
});

describe("drinkDrink", () => {
  it("喝啤酒：扣钱、心情-10、进入醉酒", async () => {
    store.commit("updateAttribute", { attribute: "money", value: 100 });
    await store.dispatch("drinkDrink", { drink: "啤酒！", amount: 1 });
    expect(store.state.attributes.money).toBe(85);
    expect(store.state.attributes.mood).toBe(-10);
    expect(store.state.drunk).toBe(1);
  });
});
