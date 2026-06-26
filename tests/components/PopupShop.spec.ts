import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";

vi.mock("../../src/store/actions/typeWriter", () => ({
  typeWriter: async () => {},
  typeWriterPopup: async () => {},
}));

import { store } from "../../src/store";
import PopupShop from "../../src/components/PopupShop.vue";
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

describe("PopupShop.vue", () => {
  it("购买特殊装备：purchaseItem → 扣钱 + progress/updateItem（特殊装备只 1 件并记 lastSpecialItem）", async () => {
    store.commit("updateAttribute", { attribute: "money", value: 2000 });

    wrapper = mount(PopupShop);
    const item = wrapper.findAll(".shop-item").find((i) => i.text().includes("麦克风大锤"));
    if (!item) throw new Error("麦克风大锤 item not found");
    await item.find("button").trigger("click");
    await flushPromises();

    expect(store.state.character.attributes.money).toBe(2000 - 1000);
    expect(store.state.progress.inventory["麦克风大锤"].quantity).toBe(1);
    expect(store.state.progress.lastSpecialItem).toBe("麦克风大锤");
    expectNoUnknownVuexType(errorSpy);
  });
});
