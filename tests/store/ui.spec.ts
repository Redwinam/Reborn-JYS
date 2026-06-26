import { beforeEach, describe, expect, it } from "vitest";
import { store } from "../../src/store";
import { isTyping, shardName, showDaoPopup, showFoodPopup, showGameEndDialog, showStartGameDialog } from "../../src/components/composables/gameRefs";

// Phase 3c：UI 状态收编进 ui module，gameRefs 变成基于 store.state.ui 的可写 computed 门面。
// 锁定「门面 ↔ ui module state」双向一致，以及 store 内部 mutation 直接写 state.ui 的路径。
beforeEach(() => {
  store.commit("resetGame");
});

describe("Phase 3c：ui module ↔ gameRefs 门面", () => {
  it("经 gameRefs 门面写入会落到 ui module state（commit ui/set）", () => {
    showFoodPopup.value = true;
    isTyping.value = true;
    shardName.value = "晚霞和云";

    expect(store.state.ui.showFoodPopup).toBe(true);
    expect(store.state.ui.isTyping).toBe(true);
    expect(store.state.ui.shardName).toBe("晚霞和云");
  });

  it("直接 commit ui/set 会被门面读到（双向一致）", () => {
    store.commit("ui/set", { key: "showDaoPopup", value: true });
    expect(showDaoPopup.value).toBe(true);
  });

  it("setGameEnded mutation 直接写 state.ui.showGameEndDialog（不经门面）", () => {
    store.commit("ui/set", { key: "showGameEndDialog", value: false });
    store.commit("setGameEnded", { gameEnded: false, specialEndingAchievementName: "汤臣亿品" });
    expect(store.state.ui.showGameEndDialog).toBe(true);
    expect(showGameEndDialog.value).toBe(true);
  });

  it("resetGame 置 showStartGameDialog 为 true", () => {
    store.commit("ui/set", { key: "showStartGameDialog", value: false });
    store.commit("resetGame");
    expect(showStartGameDialog.value).toBe(true);
  });
});
