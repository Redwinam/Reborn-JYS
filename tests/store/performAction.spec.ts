import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// typeWriter 用到 TypeIt(DOM)；统一 mock 成瞬时 no-op，让动作链路可在 node 下跑通。
vi.mock("../../src/store/actions/typeWriter", () => ({
  typeWriter: async () => {},
  typeWriterPopup: async () => {},
}));

import { store } from "../../src/store";
import { isAtHome, isGoingOut, showSongWritingDialog } from "../../src/components/composables/gameRefs";

// 这些是 namespaced 迁移要重命名 800+ commit/dispatch 的重灾区，但此前零测试覆盖。
// 用固定 Math.random + 立即执行的 setTimeout（跳过 waitAndType 延迟）锁定主路径行为。
let randomSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubGlobal("setTimeout", ((fn: () => void) => {
    fn();
    return 0;
  }) as unknown as typeof setTimeout);
  randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);
  store.commit("resetGame");
  isAtHome.value = false;
  isGoingOut.value = false;
  showSongWritingDialog.value = false;
});

afterEach(() => {
  vi.unstubAllGlobals();
  randomSpy.mockRestore();
});

describe("performAction 主路径", () => {
  it("回家：进入在家状态、不推进回合", async () => {
    await store.dispatch("performAction", "回家");
    expect(isAtHome.value).toBe(true);
    expect(store.state.gameLoop.round).toBe(1);
  });

  it("外出：进入外出状态、不推进回合", async () => {
    await store.dispatch("performAction", "外出");
    expect(isGoingOut.value).toBe(true);
    expect(store.state.gameLoop.round).toBe(1);
  });

  it("写歌：打开写歌弹窗", async () => {
    await store.dispatch("performAction", "写歌");
    expect(showSongWritingDialog.value).toBe(true);
  });

  it("赚钱：体力-10、金钱+100，并推进回合", async () => {
    await store.dispatch("performAction", "赚钱");
    expect(store.state.character.attributes.money).toBe(100);
    expect(store.state.character.attributes.energy).toBe(90);
    expect(store.state.gameLoop.round).toBe(2);
  });

  it("打游戏：游戏技能+1、心情+20，并推进回合", async () => {
    await store.dispatch("performAction", "打游戏");
    expect(store.state.character.attributes.skill.gaming).toBe(1);
    expect(store.state.character.attributes.mood).toBe(20);
    expect(store.state.gameLoop.round).toBe(2);
  });

  it("睡觉休息：累计睡眠+17、体力封顶到上限，并推进回合", async () => {
    await store.dispatch("performAction", "睡觉休息");
    expect(store.state.character.sleepHours).toBe(17);
    expect(store.state.character.attributes.energy).toBe(store.state.character.attributes.maxEnergy);
    expect(store.state.gameLoop.round).toBe(2);
  });

  it("出去鬼混（无女友、分手次数不足）：搭讪一次 flirtCount+1、魅力+10，并推进回合", async () => {
    await store.dispatch("performAction", "出去鬼混");
    expect(store.state.relationship.flirtCount).toBe(1);
    expect(store.state.character.attributes.charm).toBe(10);
    expect(store.state.gameLoop.round).toBe(2);
  });
});

describe("incrementRound action", () => {
  it("从第 1 回合推进到第 2 回合，年份不变（2012）", async () => {
    await store.dispatch("incrementRound");
    expect(store.state.gameLoop.round).toBe(2);
    expect(store.state.gameLoop.year).toBe(2012);
  });
});
