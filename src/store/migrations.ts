import type { State } from "./index";

// 存档格式版本号。当持久化的 state 形状发生变化时 +1，并在 migrateSave 中
// 增加对应的迁移步骤。localStorage 与后端 Redis 存档都会经过这里。
export const SAVE_VERSION = 1;

// 来自存档的原始数据：可能缺字段（旧版本存档），也可能带未知字段。
export type RawSave = Partial<State> & { version?: number; [key: string]: any };

/**
 * 所有持久化存档在通过 `loadGameState` 应用之前的统一归一化入口。
 *
 * Phase 0：建立 version 字段与幂等的迁移管线骨架。版本化之前写入的存档被视为
 * v0，仅打上当前版本号、不改动其数据（此阶段尚无形状变更）。后续阶段若改变 state
 * 形状，在此按来源 version 追加迁移步骤（例如补全新字段、重命名旧字段）。
 */
export function migrateSave(raw: RawSave): RawSave {
  if (raw == null || typeof raw !== "object") {
    return raw;
  }

  const data: RawSave = { ...raw };
  // const fromVersion = typeof data.version === "number" ? data.version : 0;

  // 迁移步骤按顺序执行，每一步把数据从某个 version 升级到下一个 version。
  // 目前没有形状变更：v0 -> SAVE_VERSION 除打版本号外为 no-op。

  data.version = SAVE_VERSION;
  return data;
}

/**
 * Phase 3b：把扁平的 v1 存档映射为命名空间 module 的 v2 嵌套结构。
 *
 * 根级保留元数据（version / player；textHistory 不入存档），5 个领域 module 承载游戏数据
 * （ui module 不持久化）。当前为纯函数 + 测试先行，待 store 改为命名空间 module 后接入
 * migrateSave 的迁移管线（v1 -> v2）。
 */
export function migrateV1toV2(flat: RawSave): RawSave {
  const a: RawSave = flat ?? {};
  return {
    version: 2,
    player: a.player ?? null,
    gameLoop: {
      term: a.term,
      year: a.year,
      round: a.round,
      totalRounds: a.totalRounds,
      gameEnded: a.gameEnded,
      currentEndings: a.currentEndings,
      specialEndingAchievement: a.specialEndingAchievement,
      currentLyricIndex: a.currentLyricIndex,
    },
    character: {
      attributes: a.attributes,
      weak: a.weak,
      drunk: a.drunk,
      sleepHours: a.sleepHours,
    },
    relationship: {
      girlfriend: a.girlfriend,
      flirtCount: a.flirtCount,
      accompanyCount: a.accompanyCount,
      relationRound: a.relationRound,
      breakupTimes: a.breakupTimes,
      lastBreakupRound: a.lastBreakupRound,
      seamlessRelation: a.seamlessRelation,
    },
    progress: {
      unlockedFoods: a.unlockedFoods,
      inventory: a.inventory,
      lastSpecialItem: a.lastSpecialItem,
      achievementStates: a.achievementStates,
      unlockedAchievementConditions: a.unlockedAchievementConditions,
      happenedEvents: a.happenedEvents,
      battleResults: a.battleResults,
      undergroundCount: a.undergroundCount,
      tourCount: a.tourCount,
      songs: a.songs,
      songStages: a.songStages,
      unlockedFeiSongs: a.unlockedFeiSongs,
      unlockedVitamins: a.unlockedVitamins,
      shards: a.shards,
    },
    business: {
      signedAgency: a.signedAgency,
      signedAgencyRound: a.signedAgencyRound,
      goToAgencyTimes: a.goToAgencyTimes,
      openFengyan: a.openFengyan,
      artists: a.artists,
      thisSeasonArtist: a.thisSeasonArtist,
      realEstate: a.realEstate,
      investedProjects: a.investedProjects,
      investYearIncome: a.investYearIncome,
      currentStock: a.currentStock,
    },
  };
}
