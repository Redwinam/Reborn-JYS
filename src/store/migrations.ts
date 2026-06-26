// 存档格式版本号。当持久化的 state 形状发生变化时 +1，并在 migrateSave 中
// 增加对应的迁移步骤。localStorage 与后端 Redis 存档都会经过这里。
//
// v1：扁平结构（所有字段在根级）。
// v2：命名空间 module 嵌套结构（gameLoop/character/relationship/progress/business 下沉）。
export const SAVE_VERSION = 2;

// 来自存档的原始数据：可能缺字段（旧版本存档）、可能扁平（v1）也可能嵌套（v2），也可能带未知字段。
export type RawSave = { version?: number; [key: string]: any };

/**
 * 推断未携带 version 字段的存档属于哪个版本。版本化之前写入的存档都是扁平 v1；
 * 若已经是嵌套 module 形状（出现 gameLoop/character/progress 等 key），则视为 v2。
 */
function detectVersion(data: RawSave): number {
  if (typeof data.version === "number") {
    return data.version;
  }
  return data.gameLoop || data.character || data.progress ? 2 : 1;
}

/**
 * 所有持久化存档在通过 `loadGameState` 应用之前的统一归一化入口。
 *
 * 按来源 version 依次执行迁移步骤，最终把数据升级到当前 SAVE_VERSION。
 * 目前的唯一形状变更：v1（扁平）-> v2（命名空间 module 嵌套）。
 */
export function migrateSave(raw: RawSave): RawSave {
  if (raw == null || typeof raw !== "object") {
    return raw;
  }

  let data: RawSave = { ...raw };
  const fromVersion = detectVersion(data);

  // 迁移步骤按顺序执行，每一步把数据从某个 version 升级到下一个 version。
  if (fromVersion < 2) {
    data = migrateV1toV2(data);
  }

  data.version = SAVE_VERSION;
  return data;
}

/**
 * Phase 3b：把扁平的 v1 存档映射为命名空间 module 的 v2 嵌套结构。
 *
 * 根级保留元数据（version / player；textHistory 不入存档），5 个领域 module 承载游戏数据
 * （ui module 不持久化）。
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
