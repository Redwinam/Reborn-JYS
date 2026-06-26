import type { Module } from "vuex";
import type { RootState } from "../index";

// ui module：占位。Phase 3c 才把 components/composables/gameRefs 的弹窗可见性收编进来。
// 不持久化（loadGameState 不写入、存档迁移不产出 ui 字段）。
export interface UiState {}

export function uiState(): UiState {
  return {};
}

export const ui: Module<UiState, RootState> = {
  namespaced: true,
  state: uiState,
  mutations: {},
};
