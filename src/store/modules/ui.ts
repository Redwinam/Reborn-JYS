import type { Module } from "vuex";
import type { RootState } from "../index";

// ui module（Phase 3c）：收编原 components/composables/gameRefs 的弹窗可见性 / 流程标志。
// 这些是短暂 UI 状态，不持久化（loadGameState 不写入、存档迁移不产出 ui 字段）。
// gameRefs.ts 现已变成「基于本模块 state 的可写 computed 门面」，组件无需改动即可读写。
export interface UiState {
  // 主界面流程
  isAtHome: boolean;
  isGoingOut: boolean;
  isTyping: boolean;
  // 对话框
  showBreakupDialog: boolean;
  showEventDialog: boolean;
  showSongWritingDialog: boolean;
  showUpgradeSkillDialog: boolean;
  showUnsignAgencyDialog: boolean;
  showGameEndDialog: boolean;
  showBattleDialog: boolean;
  showStartGameDialog: boolean;
  // 弹窗
  showFoodPopup: boolean;
  showDrinkPopup: boolean;
  showShopPopup: boolean;
  showFengyanPopup: boolean;
  showAchievementNotePopup: boolean;
  showBankPopup: boolean;
  showBuyGoldPopup: boolean;
  showSellGoldPopup: boolean;
  showExchangePopup: boolean;
  showRealEstatePopup: boolean;
  showStockMarketPopup: boolean;
  showInvestmentPopup: boolean;
  showUndergroundPopup: boolean;
  showDaoPopup: boolean;
  showShardPopup: boolean;
  showSLPopup: boolean;
  // 数据
  shardName: string;
}

export function uiState(): UiState {
  return {
    isAtHome: false,
    isGoingOut: false,
    isTyping: false,
    showBreakupDialog: false,
    showEventDialog: false,
    showSongWritingDialog: false,
    showUpgradeSkillDialog: false,
    showUnsignAgencyDialog: false,
    showGameEndDialog: false,
    showBattleDialog: false,
    showStartGameDialog: false,
    showFoodPopup: false,
    showDrinkPopup: false,
    showShopPopup: false,
    showFengyanPopup: false,
    showAchievementNotePopup: false,
    showBankPopup: false,
    showBuyGoldPopup: false,
    showSellGoldPopup: false,
    showExchangePopup: false,
    showRealEstatePopup: false,
    showStockMarketPopup: false,
    showInvestmentPopup: false,
    showUndergroundPopup: false,
    showDaoPopup: false,
    showShardPopup: false,
    showSLPopup: false,
    shardName: "",
  };
}

export const ui: Module<UiState, RootState> = {
  namespaced: true,
  state: uiState,
  mutations: {
    // 通用 setter：gameRefs 门面的写入都走这里（key 受 UiState 约束）。
    set<K extends keyof UiState>(state: UiState, payload: { key: K; value: UiState[K] }) {
      state[payload.key] = payload.value;
    },
  },
};
