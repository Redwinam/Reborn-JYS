import { beforeEach, describe, expect, it } from "vitest";
import { store } from "../../src/store";
import golden from "../fixtures/golden-save.json";

// 黄金存档：一份代表性的中局存档快照，作为存档"序列化形状"的回归基线。
// 若后续重构重命名/移除了某个持久化字段，下面的断言会立刻报警，迫使做出有意识的决定
//（要么改 fixture，要么在 migrateSave 中补迁移）。
beforeEach(() => {
  store.commit("resetGame");
});

describe("golden mid-game save", () => {
  it("加载黄金存档并保留关键字段", () => {
    store.commit("loadGameState", golden);

    expect(store.state.gameLoop.term).toBe(golden.term);
    expect(store.state.gameLoop.round).toBe(golden.round);
    expect(store.state.gameLoop.year).toBe(golden.year);
    expect(store.state.character.attributes.money).toBe(golden.attributes.money);
    expect(store.state.character.attributes.skill.freestyleLevel).toBe(golden.attributes.skill.freestyleLevel);
    expect(store.state.progress.inventory["皮卡丘玩偶"].quantity).toBe(golden.inventory["皮卡丘玩偶"].quantity);
    expect(store.state.progress.songStages["浪漫主义"].completedStage).toBe("release");
    expect(store.state.business.signedAgency).toBe(true);
  });

  it("经过一次 保存->重置->读取 往返后关键字段不变", () => {
    store.commit("loadGameState", golden);

    const snapshot = JSON.parse(JSON.stringify(store.state));
    delete snapshot.textHistory;

    store.commit("resetGame");
    store.commit("loadGameState", snapshot);

    expect(store.state.character.attributes.money).toBe(golden.attributes.money);
    expect(store.state.progress.inventory["皮卡丘玩偶"].quantity).toBe(golden.inventory["皮卡丘玩偶"].quantity);
    expect(store.state.relationship.breakupTimes).toBe(golden.breakupTimes);
  });
});
