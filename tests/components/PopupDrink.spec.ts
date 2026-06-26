import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";

vi.mock("../../src/store/actions/typeWriter", () => ({
  typeWriter: async () => {},
  typeWriterPopup: async () => {},
}));

import { store } from "../../src/store";
import PopupDrink from "../../src/components/PopupDrink.vue";
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
});

afterEach(() => {
  wrapper?.unmount();
  vi.unstubAllGlobals();
  errorSpy.mockRestore();
});

describe("PopupDrink.vue", () => {
  it("喝啤酒：drinkDrink → 扣钱、心情-10、character/updateDrunk", async () => {
    store.commit("updateAttribute", { attribute: "money", value: 100 });

    wrapper = mount(PopupDrink);
    const beer = wrapper.findAll(".drink-item").find((d) => d.text().includes("啤酒"));
    if (!beer) throw new Error("啤酒 item not found");
    const oneCup = beer.findAll("button").find((b) => b.text() === "买一杯");
    await oneCup!.trigger("click");
    await flushPromises();

    expect(store.state.character.drunk).toBe(1); // 啤酒 type=wine → character/updateDrunk
    expect(store.state.character.attributes.money).toBe(100 - 15);
    expect(store.state.character.attributes.mood).toBe(-10);
    expectNoUnknownVuexType(errorSpy);
  });
});
