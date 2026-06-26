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
});
