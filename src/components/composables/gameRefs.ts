import { computed, type WritableComputedRef } from "vue";
import { store } from "../../store";
import type { UiState } from "../../store/modules/ui";

// Phase 3c：UI 状态已收编进 Vuex 的 ui module（单一数据源、devtools 可见）。
// 这里把原先散落的 ref 改造成「基于 store.state.ui 的可写 computed 门面」，对外 API 不变
// （仍是 `.value` 读写 / 模板自动解包），因此全部调用点与组件无需改动。
//
// 注意：从「mutation 内部」写 UI 状态不可经此门面（会变成 mutation 内 commit）；store 内部的
// setGameEnded / resetGame 直接写 `state.ui.X`（见 index.ts）。action 与组件经门面写入则是
// 正常的 commit('ui/set')。
function uiRef<K extends keyof UiState>(key: K): WritableComputedRef<UiState[K]> {
  return computed({
    get: () => store.state.ui[key],
    set: (value) => store.commit("ui/set", { key, value }),
  });
}

export const isAtHome = uiRef("isAtHome");
export const isGoingOut = uiRef("isGoingOut");
export const isTyping = uiRef("isTyping");

export const showBreakupDialog = uiRef("showBreakupDialog");
export const showEventDialog = uiRef("showEventDialog");
export const showSongWritingDialog = uiRef("showSongWritingDialog");
export const showUpgradeSkillDialog = uiRef("showUpgradeSkillDialog");
export const showUnsignAgencyDialog = uiRef("showUnsignAgencyDialog");
export const showGameEndDialog = uiRef("showGameEndDialog");
export const showBattleDialog = uiRef("showBattleDialog");
export const showStartGameDialog = uiRef("showStartGameDialog");

export const showFoodPopup = uiRef("showFoodPopup");
export const showDrinkPopup = uiRef("showDrinkPopup");
export const showShopPopup = uiRef("showShopPopup");
export const showFengyanPopup = uiRef("showFengyanPopup");

export const showAchievementNotePopup = uiRef("showAchievementNotePopup");

export const showBankPopup = uiRef("showBankPopup");
export const showBuyGoldPopup = uiRef("showBuyGoldPopup");
export const showSellGoldPopup = uiRef("showSellGoldPopup");

export const showExchangePopup = uiRef("showExchangePopup");
export const showRealEstatePopup = uiRef("showRealEstatePopup");
export const showStockMarketPopup = uiRef("showStockMarketPopup");
export const showInvestmentPopup = uiRef("showInvestmentPopup");

export const showUndergroundPopup = uiRef("showUndergroundPopup");
export const showDaoPopup = uiRef("showDaoPopup");

export const showShardPopup = uiRef("showShardPopup");
export const shardName = uiRef("shardName");

export const showSLPopup = uiRef("showSLPopup");
