import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";

vi.mock("../../src/store/actions/typeWriter", () => ({
  typeWriter: async () => {},
  typeWriterPopup: async () => {},
}));

import { store } from "../../src/store";
import PopupSongWriting from "../../src/components/PopupSongWriting.vue";
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
  store.commit("resetGame");
});

afterEach(() => {
  wrapper?.unmount();
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
  randomSpy.mockRestore();
  errorSpy.mockRestore();
});

describe("PopupSongWriting.vue", () => {
  it("写废歌：progress/unlockFeiSong + updateAttribute（才华/魅力+20、体力-100）+ 推进回合", async () => {
    wrapper = mount(PopupSongWriting);

    const btn = wrapper.findAll("button").find((b) => b.text().includes("写废歌"));
    if (!btn) throw new Error("写废歌 button not found");
    await btn.trigger("click");
    await flushPromises();

    expect(store.state.progress.unlockedFeiSongs.length).toBe(1);
    expect(store.state.character.attributes.talent).toBe(20);
    expect(store.state.character.attributes.charm).toBe(20);
    expect(store.state.character.attributes.energy).toBe(0); // 100 - 100
    expect(store.state.gameLoop.round).toBe(2);
    expectNoUnknownVuexType(errorSpy);
  });

  it("onMounted 自动解锁达成条件的歌曲：progress/unlockSong", async () => {
    store.commit("updateAttribute", { attribute: "talent", value: 100 }); // 「网易云」条件 talent≥80
    document.body.innerHTML = '<p id="textboxPopup"></p>'; // onMounted 需要它才会跑 unlockSongs()

    wrapper = mount(PopupSongWriting);
    await flushPromises();

    expect(store.state.progress.songStages["网易云"]?.unlocked).toBe(true);
    expectNoUnknownVuexType(errorSpy);
  });

  // 回归 bug3：原先 attributes["心情"]（应为 mood 英文 key）恒为 undefined，使「SAD」的
  // 心情门槛形同虚设。SAD 需 mood≤-20 且 seamlessRelation 且无女友。
  function sadRowText() {
    const row = wrapper.findAll(".song").find((s) => s.find("h3").exists() && s.find("h3").text().startsWith("SAD"));
    if (!row) throw new Error("SAD song row not found");
    return row.text();
  }

  it("心情=0 且无缝恋爱：SAD 不可写（修复后 mood 门槛生效，显示「未达成」）", () => {
    store.commit("relationship/setSeamlessRelation", true); // 排除 !seamlessRelation 这一项
    // mood 保持 0（resetGame 后）；无女友
    wrapper = mount(PopupSongWriting);
    expect(sadRowText()).toContain("未达成");
  });

  it("心情≤-20 且无缝恋爱、无女友：SAD 可写（显示「已达成」）", () => {
    store.commit("updateAttribute", { attribute: "mood", value: -30 });
    store.commit("relationship/setSeamlessRelation", true);
    wrapper = mount(PopupSongWriting);
    expect(sadRowText()).toContain("已达成");
  });
});
