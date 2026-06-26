import { beforeEach, describe, expect, it } from "vitest";
import { store } from "../../src/store";
import { SAVE_VERSION, migrateSave } from "../../src/store/migrations";

// 存档 保存/读取 往返与版本迁移护栏。复刻 Game.vue 中基于 store.subscribe 的存档逻辑
//（深拷贝 state 并剔除 textHistory）。
beforeEach(() => {
  store.commit("resetGame");
});

describe("save/load round-trip via loadGameState", () => {
  it("还原序列化快照（不含 textHistory）", () => {
    store.commit("updateAttribute", { attribute: "money", value: 12345 });
    store.commit("updateAttribute", { attribute: "talent", value: 88 });
    store.commit("updateItem", { itemName: "皮卡丘玩偶", quantity: 7 });
    store.commit("setGirlfriend", { type: "学姐", effect: "charm", breakupReasons: [] });
    store.commit("addTextToHistory", "transient-line");

    const snapshot = JSON.parse(JSON.stringify(store.state));
    delete snapshot.textHistory;

    store.commit("resetGame");
    expect(store.state.attributes.money).toBe(0);

    store.commit("loadGameState", snapshot);
    expect(store.state.attributes.money).toBe(12345);
    expect(store.state.attributes.talent).toBe(88);
    expect(store.state.inventory["皮卡丘玩偶"].quantity).toBe(7);
    expect(store.state.girlfriend?.type).toBe("学姐");
  });

  it("加载存档不会覆盖当前的 textHistory", () => {
    store.commit("addTextToHistory", "keep-me");
    const snapshot = JSON.parse(JSON.stringify(store.state));
    snapshot.textHistory = ["should-be-ignored"];

    store.commit("loadGameState", snapshot);
    expect(store.state.textHistory).toContain("keep-me");
    expect(store.state.textHistory).not.toContain("should-be-ignored");
  });

  it("加载时为旧存档打上当前 version", () => {
    const snapshot = JSON.parse(JSON.stringify(store.state));
    delete snapshot.version; // 模拟版本化之前的旧存档
    store.commit("loadGameState", snapshot);
    expect(store.state.version).toBe(SAVE_VERSION);
  });
});

describe("migrateSave", () => {
  it("无 version 的存档视为 v0 并打上当前版本，数据不变", () => {
    const migrated = migrateSave({ round: 5 });
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.round).toBe(5);
  });

  it("对当前版本存档幂等", () => {
    const once = migrateSave({ version: SAVE_VERSION, round: 9 });
    const twice = migrateSave(once);
    expect(twice).toEqual(once);
  });
});
