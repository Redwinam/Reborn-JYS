import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// typeWriter 用到 TypeIt(DOM)；mock 成瞬时 no-op。
vi.mock("../../src/store/actions/typeWriter", () => ({
  typeWriter: async () => {},
  typeWriterPopup: async () => {},
}));

import { store } from "../../src/store";
import { specialEventDetail } from "../../src/store/actions/specialEvent";
import { showEventDialog } from "../../src/components/composables/gameRefs";

// specialEvent 是改造前零测试覆盖、命名空间前缀最密的 action（addHappenedEvent / updateDrunk /
// openFengyan 等）。未知 mutation/action 是【静默 no-op】，故在断言行为之外，额外用 console.error
// 间谍兜住调用链里任何漏改/错改的 module/ 前缀。
let errorSpy: ReturnType<typeof vi.spyOn>;
let randomSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubGlobal("setTimeout", ((fn: () => void) => {
    fn();
    return 0;
  }) as unknown as typeof setTimeout);
  randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  store.commit("resetGame");
  showEventDialog.value = false;
  specialEventDetail.value = null;
});

afterEach(() => {
  vi.unstubAllGlobals();
  randomSpy.mockRestore();
  errorSpy.mockRestore();
});

// 若调用链里有任何 commit/dispatch 的 type 不存在（如错误的 module/ 前缀），Vuex 会
// console.error("[vuex] unknown mutation/action type: ...") 而非抛错——这里把它变成断言失败。
function expectNoUnknownVuexType() {
  const offending = errorSpy.mock.calls
    .flat()
    .filter((m) => typeof m === "string" && (m.includes("unknown mutation type") || m.includes("unknown action type")));
  expect(offending).toEqual([]);
}

describe("specialEvent action", () => {
  it("派发事件记入 happenedEvents（progress/addHappenedEvent 前缀解析）并弹出事件框", async () => {
    await store.dispatch("specialEvent", "生日快乐");

    expect(store.state.progress.happenedEvents).toContain("生日快乐");
    expect(showEventDialog.value).toBe(true);
    expect(specialEventDetail.value?.title).toBe("生日快乐");
    expectNoUnknownVuexType();
  });

  it("多次派发不同事件都正确入账，无未知 mutation/action 前缀", async () => {
    await store.dispatch("specialEvent", "去看热闹");
    await store.dispatch("specialEvent", "二八分");

    expect(store.state.progress.happenedEvents).toEqual(expect.arrayContaining(["去看热闹", "二八分"]));
    expectNoUnknownVuexType();
  });

  it("生日快乐选项发放奖励（root updateAttribute 链路，金钱+1000/才华+10/魅力+10）", async () => {
    await store.dispatch("specialEventOptionChosen", { event: "生日快乐", option: "【祝他生日快乐！！】" });

    expect(store.state.character.attributes.money).toBe(1000);
    expect(store.state.character.attributes.talent).toBe(10);
    expect(store.state.character.attributes.charm).toBe(10);
    expectNoUnknownVuexType();
  });
});
