import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";

import { store } from "../../src/store";
import PopupSubGold from "../../src/components/PopupSubGold.vue";
import { showBuyGoldPopup, showSellGoldPopup, showRealEstatePopup, showStockMarketPopup, showInvestmentPopup } from "../../src/components/composables/gameRefs";

// 验证「组件点击 → 命名空间前缀 mutation（character/buyGold）」端到端可用。
// Vuex 对未知 type 是静默 no-op，故同时用 console.error 间谍兜住前缀写错的情况。
let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  store.commit("resetGame");
  showBuyGoldPopup.value = false;
  showSellGoldPopup.value = false;
  showRealEstatePopup.value = false;
  showStockMarketPopup.value = false;
  showInvestmentPopup.value = false;
});

afterEach(() => {
  errorSpy.mockRestore();
  showBuyGoldPopup.value = false;
});

describe("PopupSubGold.vue", () => {
  it("点击「购买」走 character/buyGold：金条+1、金钱-552", async () => {
    store.commit("updateAttribute", { attribute: "money", value: 2000 });
    showBuyGoldPopup.value = true; // 让 PopupSub 渲染其 slot（买金条按钮）

    const wrapper = mount(PopupSubGold);
    await flushPromises();

    const buyBtn = wrapper.find("button.button_buyGold");
    expect(buyBtn.exists()).toBe(true);

    await buyBtn.trigger("click");

    expect(store.state.character.attributes.gold).toBe(1);
    expect(store.state.character.attributes.money).toBe(2000 - 552);

    const offending = errorSpy.mock.calls
      .flat()
      .filter((m) => typeof m === "string" && (m.includes("unknown mutation type") || m.includes("unknown action type")));
    expect(offending).toEqual([]);
  });
});
