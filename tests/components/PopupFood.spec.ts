import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";

vi.mock("../../src/store/actions/typeWriter", () => ({
  typeWriter: async () => {},
  typeWriterPopup: async () => {},
}));

import { store } from "../../src/store";
import PopupFood from "../../src/components/PopupFood.vue";
import { expectNoUnknownVuexType, spyConsoleError } from "./helpers";

let errorSpy: ReturnType<typeof vi.spyOn>;
let wrapper: VueWrapper;

beforeEach(() => {
  vi.stubGlobal("setTimeout", ((fn: () => void) => {
    fn();
    return 0;
  }) as unknown as typeof setTimeout);
  errorSpy = spyConsoleError();
  store.commit("resetGame");
  // unlockFood 是 root 跨域 mutation：解锁食物并把 maxEnergy +ceil(energy/10)。
  store.commit("unlockFood", { name: "火锅", cost: 60, energy: 100, taste: "spicy" });
});

afterEach(() => {
  wrapper?.unmount();
  vi.unstubAllGlobals();
  errorSpy.mockRestore();
});

describe("PopupFood.vue", () => {
  it("堂食：eatFood → 扣钱、体力按 maxEnergy 封顶（unlockFood 把上限提到 110）", async () => {
    store.commit("updateAttribute", { attribute: "money", value: 100 });

    wrapper = mount(PopupFood);
    const eatBtn = wrapper.findAll("button").find((b) => b.text() === "堂食");
    await eatBtn!.trigger("click");
    await flushPromises();

    expect(store.state.character.attributes.money).toBe(40); // 100 - 60
    expect(store.state.character.attributes.energy).toBe(110); // 100 + 100 封顶到 maxEnergy 110
    expectNoUnknownVuexType(errorSpy);
  });

  it("打包：packFood → 扣钱 + progress/packFood 入库", async () => {
    store.commit("updateAttribute", { attribute: "money", value: 100 });

    wrapper = mount(PopupFood);
    const packBtn = wrapper.findAll("button").find((b) => b.text() === "打包");
    await packBtn!.trigger("click");
    await flushPromises();

    expect(store.state.progress.inventory["火锅"].quantity).toBe(1);
    expect(store.state.character.attributes.money).toBe(40);
    expectNoUnknownVuexType(errorSpy);
  });
});
