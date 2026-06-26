import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";

vi.mock("../../src/store/actions/typeWriter", () => ({
  typeWriter: async () => {},
  typeWriterPopup: async () => {},
}));

import { store } from "../../src/store";
import DialogBattle from "../../src/components/DialogBattle.vue";
import { showBattleDialog } from "../../src/components/composables/gameRefs";
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
  store.commit("resetGame"); // year = 2012
  // battleResults 是共享数组，重置避免跨测试 bleed。
  store.state.progress.battleResults.forEach((b: { result: unknown; end?: boolean }) => {
    b.result = null;
    delete b.end;
  });
  // 组件的 onMounted/typeWriterPopup 用 document.getElementById('textboxPopup') 判定是否推进，
  // 放一个占位元素让其成立（attachTo 在 Vue 3.2 + test-utils 2.4 下会触发 app.onUnmount 报错）。
  document.body.innerHTML = '<p id="textboxPopup"></p>';
  showBattleDialog.value = true;
});

afterEach(() => {
  wrapper?.unmount();
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
  randomSpy.mockRestore();
  errorSpy.mockRestore();
});

function clickButton(text: string) {
  const btn = wrapper.findAll("button").find((b) => b.text() === text);
  if (!btn) throw new Error(`button not found: ${text}`);
  return btn.trigger("click");
}

const battle2012 = () => store.state.progress.battleResults.find((b: { year: number }) => b.year === 2012);

describe("DialogBattle.vue（2012 届，海选条件 才华≥25）", () => {
  it("才华达标 → 报名参加 晋级「海选」：progress/updateBattleResult", async () => {
    store.commit("updateAttribute", { attribute: "talent", value: 30 });
    wrapper = mount(DialogBattle); // #textboxPopup 占位元素已在 beforeEach 注入 document
    await flushPromises();

    await clickButton("报名参加！");
    await flushPromises();

    expect(battle2012().result).toBe("海选");
    expectNoUnknownVuexType(errorSpy);
  });

  it("才华不足 → 落选 → 离开比赛：progress/updateBattleEnd + 落选奖励 + 推进回合", async () => {
    store.commit("updateAttribute", { attribute: "talent", value: 10 });
    wrapper = mount(DialogBattle);
    await flushPromises();

    await clickButton("报名参加！");
    await flushPromises();
    expect(battle2012().result).toBe("落选");

    await clickButton("离开比赛");
    await flushPromises();

    expect(battle2012().end).toBe(true);
    expect(store.state.character.attributes.popularity.red).toBe(20); // reward[2012]=200 × 0.1
    expect(store.state.gameLoop.round).toBe(2); // incrementRound
    expectNoUnknownVuexType(errorSpy);
  });
});
