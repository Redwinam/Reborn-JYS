import { battleResults } from "./battle";
import { allArtists } from "./artists";
import { START_YEAR } from "./constants";
import { SAVE_VERSION } from "./migrations";
import type { State } from "./index";

/**
 * 单一初始状态工厂：初始 state、resetGame、resetGameState 共用，
 * 消除原先散落三处、容易漂移的默认值。后续各 module 的 state() 工厂将复用这里的默认值。
 *
 * 注意：battleResults / artists 沿用模块级共享数组引用（与重构前行为一致）；其跨周目
 * “数据 bleed”属既有问题，留待后续单独修复，本步不改变行为。
 */
export function createInitialState(): State {
  return {
    term: 1,
    year: START_YEAR,
    round: 1,
    totalRounds: 432,
    attributes: {
      divine: 0,
      talent: 0,
      charm: 0,
      popularity: {
        red: 0,
        black: 0,
      },
      money: 0,
      gold: 0,
      skill: {
        freestyle: 0,
        gaming: 0,
        gamingLevel: "D",
        freestyleLevel: "D",
      },
      energy: 100,
      maxEnergy: 100,
      mood: 0,
      fight: {
        level: 26,
        attack: 19,
        defense: 9,
        hp: 6,
        mp: 61,
      },
      superstition: 0,
    },
    weak: false,
    drunk: 0,
    sleepHours: 0,
    flirtCount: 0,
    girlfriend: null,
    accompanyCount: 0,
    relationRound: 0,
    breakupTimes: 0,
    lastBreakupRound: null,
    seamlessRelation: false,

    unlockedFoods: [],
    inventory: {},
    lastSpecialItem: null,

    achievementStates: [],
    unlockedAchievementConditions: [],
    happenedEvents: [],

    battleResults: battleResults,
    undergroundCount: 0,
    tourCount: [0, 0],

    signedAgency: false,
    signedAgencyRound: null,
    goToAgencyTimes: 0,

    songs: [],
    songStages: {},
    unlockedFeiSongs: [],
    unlockedVitamins: [],

    shards: [],
    openFengyan: false,
    artists: allArtists,
    thisSeasonArtist: { move: null, dispatch: [] },

    realEstate: [],
    investedProjects: [],
    investYearIncome: 0,
    currentStock: false,

    gameEnded: false,
    currentEndings: [],
    specialEndingAchievement: null,

    textHistory: [],
    player: null,

    currentLyricIndex: -1,

    version: SAVE_VERSION,
  };
}
