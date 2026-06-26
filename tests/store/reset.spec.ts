import { beforeEach, describe, expect, it } from "vitest";
import { store } from "../../src/store";

// 锁定三处状态初始化/重置路径的当前行为：resetGame（全新游戏）与 resetGameState
// 的两种模式（保留 20% / 清空数据）。这是 Phase 3 合并初始化逻辑前的回归基线。
describe("resetGame mutation（全新游戏）", () => {
  beforeEach(() => store.commit("resetGame"));

  it("回到第 1 周目、第 1 回合、2012 年，属性清零", () => {
    expect(store.state.gameLoop.term).toBe(1);
    expect(store.state.gameLoop.round).toBe(1);
    expect(store.state.gameLoop.year).toBe(2012);
    expect(store.state.character.attributes.money).toBe(0);
    expect(store.state.character.attributes.energy).toBe(100);
    expect(store.state.relationship.girlfriend).toBeNull();
    expect(store.state.progress.inventory).toEqual({});
    expect(store.state.progress.songs).toEqual([]);
  });
});

describe("resetGameState mutation（新周目）", () => {
  beforeEach(() => store.commit("resetGame"));

  it("resetData=true 时清空属性与收藏并 term+1", () => {
    store.commit("updateAttribute", { attribute: "talent", value: 100 });
    store.commit("progress/updateItem", { itemName: "皮卡丘玩偶", quantity: 3 });
    const term = store.state.gameLoop.term;

    store.commit("resetGameState", true);
    expect(store.state.gameLoop.term).toBe(term + 1);
    expect(store.state.gameLoop.round).toBe(1);
    expect(store.state.character.attributes.talent).toBe(0);
    expect(store.state.progress.inventory).toEqual({});
  });

  it("resetData=false 时把 20% 属性带入新周目，心情归零、体力满", () => {
    store.commit("updateAttribute", { attribute: "talent", value: 100 });

    store.commit("resetGameState", false);
    expect(store.state.character.attributes.talent).toBe(20); // floor(100 * 0.2)
    expect(store.state.character.attributes.mood).toBe(0);
    expect(store.state.character.attributes.energy).toBe(store.state.character.attributes.maxEnergy);
  });
});
