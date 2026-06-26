import { SAVE_VERSION } from "./migrations";
import type { RootState } from "./index";

/**
 * 根级（非 module）状态工厂：仅 version / player / textHistory。各 module 的初始 state 由其
 * 自身的 state() 工厂在 createStore 的 modules 中提供（character/gameLoop/... ）。
 *
 * Phase 3b：原来的扁平 createInitialState 已按 6 个 module 拆分到 src/store/modules/*；
 * 这里只保留根级字段，createStore 时与各 module state 合并成完整 RootState。
 */
export function createRootState(): Pick<RootState, "version" | "player" | "textHistory"> {
  return {
    version: SAVE_VERSION,
    player: null,
    textHistory: [],
  };
}
