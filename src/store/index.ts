import { createStore, Store, Commit } from "vuex";

import { type Food, eatFood, packFood, eatPackedFood, drinkDrink } from "./eats";
import { achievements } from "./achievements";
import { battleResults } from "./battle";
import { allArtists } from "./artists";

import { Attributes } from "../store/attributes";
import { accompanyGirlfriend } from "./actions/accompanyGirlfriend";
import { goToLocation } from "./actions/goToLocation";
import { specialEvent, specialEventOptionChosen } from "./actions/specialEvent";
import { performAction } from "./actions/performActions";
import { purchaseItem } from "./actions/purchaseItem";
import { upgradeSkill, SkillLevelMapping } from "./actions/upgradeSkill";
import { typeWriter, typeWriterPopup } from "./actions/typeWriter";

import { PlayerResponse } from "./player";

import { migrateSave } from "./migrations";
import { GOLD_PRICE, GOLD_INTEREST_RATE, AGENCY_INCOME_RATE, START_YEAR, ROUNDS_PER_YEAR } from "./constants";
import { createRootState } from "./state";
import { EVENTS } from "./keys";

import { gameLoop, type GameLoopState } from "./modules/gameLoop";
import { character, type CharacterState } from "./modules/character";
import { relationship, type RelationshipState } from "./modules/relationship";
import { progress, type ProgressState } from "./modules/progress";
import { business, type BusinessState } from "./modules/business";
import { ui, type UiState } from "./modules/ui";

// isTyping / showBreakupDialog 在 action 内经 gameRefs 门面写（合法的 commit）。
// showGameEndDialog / showStartGameDialog 由 setGameEnded / resetGame 这两个 mutation
// 直接写 state.ui（mutation 内不能再 commit，故不走门面）。
import { isTyping, showBreakupDialog } from "../components/composables/gameRefs";

// 兼容旧引用：歌词数组已迁到 gameLoop module，这里 re-export 以保留 `import { skyTreeLyrics } from "../store"`。
export { skyTreeLyrics } from "./modules/gameLoop";

/**
 * Phase 3b：命名空间 module 化后的根状态。根级仅保留元数据（version/player）与不入存档的
 * textHistory；其余游戏数据下沉到 6 个 `namespaced: true` module。去掉了原 State 的
 * `[key: string]: any` 索引签名，使 store.state 路径重命名能被 TypeScript 静态检查。
 *
 * 跨域 mutation（同时读写多个 module，如 incrementRound / updateAttribute / setGameEnded /
 * reset* / loadGameState 等）保留为 root mutation：root mutation 收到完整 RootState，可直接
 * 读写各 module 的嵌套 state；而 namespaced module 的 mutation 只能拿到自身局部 state。
 */
export interface RootState {
  version: number;
  player: PlayerResponse | null;
  textHistory: string[];

  gameLoop: GameLoopState;
  character: CharacterState;
  relationship: RelationshipState;
  progress: ProgressState;
  business: BusinessState;
  ui: UiState;
}

type UpdateAttributePayload = {
  attribute: keyof Attributes | "red" | "black" | "gaming" | "freestyle" | "fightLevel";
  value: number;
};

// 跨域 root mutation：直接读写 RootState 下各 module 的嵌套 state。
const mutations = {
  incrementRound(state: RootState) {
    state.gameLoop.round++;
    state.gameLoop.year = Math.floor((state.gameLoop.round - 1) / ROUNDS_PER_YEAR) + START_YEAR;
    if (state.gameLoop.year > 2024) {
      state.gameLoop.year = START_YEAR;
    }
    state.character.attributes.money += Math.ceil(state.character.attributes.gold * GOLD_INTEREST_RATE * GOLD_PRICE);
    if (state.relationship.girlfriend) {
      state.relationship.relationRound++;
    }
  },

  async updateAttribute(state: RootState, payload: UpdateAttributePayload) {
    const { attribute, value } = payload;
    const attributes = state.character.attributes;

    if (attribute === "money") {
      if (isNaN(attributes.money)) {
        attributes.money = 0;
        attributes.gold = 2;
      } else if (state.business.signedAgency && value > 0) {
        (attributes[attribute] as number) += value * AGENCY_INCOME_RATE;
      } else {
        (attributes[attribute] as number) += value;
      }
      attributes.money = Math.round(attributes.money);
    } else if (attribute === "gold") {
      if (isNaN(attributes.gold)) {
        attributes.money = 0;
        attributes.gold = 2;
      } else {
        attributes.gold += value;
      }
    } else if (attribute === "popularity") {
      if (value > 0) {
        attributes.popularity.red += value;
      } else {
        attributes.popularity.black += value;
      }
    } else if (attribute === "red") {
      attributes.popularity.red += value;
      if (attributes.popularity.red < 0) {
        attributes.popularity.red = 0;
      }
    } else if (attribute === "black") {
      attributes.popularity.black += value;
      if (attributes.popularity.black < 0) {
        attributes.popularity.black = 0;
      }
    } else if (attribute === "gaming" || attribute === "freestyle") {
      const skill = attribute;

      const currentLevel = SkillLevelMapping.find((level) => level.level === attributes.skill[`${skill}Level`]);
      const currentLevelMax = currentLevel ? currentLevel.max : 0;
      attributes.skill[skill] = Math.min(attributes.skill[skill] + value, currentLevelMax);
    } else if (attribute === "fightLevel") {
      const currentLevel = attributes.fight.level;
      const currentLevelMax = 81;
      attributes.fight.level = Math.min(currentLevel + value, currentLevelMax);
    } else {
      (attributes[attribute] as number) += value;

      if (attribute === "energy") {
        if (attributes.energy > attributes.maxEnergy) {
          attributes.energy = attributes.maxEnergy;
        }

        if (attributes.energy < 0 && !state.character.weak) {
          state.character.weak = true;
        } else if (attributes.energy >= 0 && state.character.weak) {
          state.character.weak = false;
        }
      }
    }
  },

  setGirlfriend(state: RootState, payload: { type: string; effect: keyof Attributes; breakupReasons: string[] } | null) {
    state.relationship.girlfriend = payload;
    if (payload === null) {
      state.relationship.breakupTimes++;
      state.relationship.lastBreakupRound = state.gameLoop.round;
    }
  },

  setSignedAgency(state: RootState, payload: boolean) {
    state.business.signedAgency = payload;
    if (payload) {
      state.business.signedAgencyRound = state.gameLoop.round;
    }
  },

  unlockFood(state: RootState, food: Food) {
    state.progress.unlockedFoods.push(food);
    state.character.attributes.maxEnergy += Math.ceil(food.energy / 10);
  },

  recruitArtist(state: RootState, artistName: string) {
    let artist = state.business.artists.find((artist) => artist.name === artistName);
    if (artist && state.business.thisSeasonArtist.move === null) {
      artist.level += 1;
      state.business.thisSeasonArtist.move = { name: artistName, action: "招募" };
      state.character.attributes.money -= 800000; // 支出公司运营费用
    }
  },
  trainArtist(state: RootState, artistName: string) {
    let artist = state.business.artists.find((artist) => artist.name === artistName);
    if (artist && artist.level > 0 && state.business.thisSeasonArtist.move === null) {
      artist.level += 1;
      state.business.thisSeasonArtist.move = { name: artistName, action: "锻炼" };
      state.character.attributes.money -= 800000; // 支出公司运营费用
    }
  },
  dispatchArtist(state: RootState, artistName: string) {
    let artist = state.business.artists.find((artist) => artist.name === artistName);
    if (artist && artist.level > 0 && !state.business.thisSeasonArtist.dispatch.includes(artistName)) {
      state.business.thisSeasonArtist.dispatch.push(artistName);
      // 根据艺人等级，给予收益
      switch (artist.level) {
        case 1:
          break; // level 1 的艺人只获得冰箱，不增加收入
        case 2:
          state.character.attributes.money += 8000; // level 2 的艺人增加收入8000
          break;
        case 3:
          state.character.attributes.money += 80000; // level 3 的艺人增加收入8万
          break;
        case 4:
          state.character.attributes.money += 180000; // level 4 的艺人增加收入18万
          break;
        case 5:
          state.character.attributes.money += 280000; // level 5 的艺人增加收入28万
          break;
      }
    }
  },

  unlockAchievement(state: RootState, achievementName: string) {
    const achievement = achievements.find((ach) => ach.name === achievementName);
    const achievementState = state.progress.achievementStates.find((ach) => ach.name === achievementName);
    if (achievement && !achievementState) {
      state.progress.achievementStates.push({
        name: achievement.name,
        unlocked: true,
        unlockTerm: state.gameLoop.term,
      });
    }
  },

  unlockAchievementCondition(state: RootState, achievementName: string) {
    if (state.progress.unlockedAchievementConditions.length >= state.gameLoop.term - 1) {
      return;
    }
    state.progress.unlockedAchievementConditions.push(achievementName);
  },

  investProject(state: RootState, project: { name: string; income: number; cost: number }) {
    state.business.investedProjects.push(project.name);
    state.business.investYearIncome += project.income;
    state.character.attributes.money -= project.cost;
  },

  addTextToHistory(state: RootState, message: string | string[]) {
    if (typeof message === "string") {
      state.textHistory.push(message);
    } else {
      message.forEach((m) => state.textHistory.push(m));
    }
  },

  setGameEnded(state: RootState, payload: { gameEnded: boolean; specialEndingAchievementName: string | string[] }) {
    if (typeof payload.specialEndingAchievementName === "string") {
      if (!payload.gameEnded) state.gameLoop.currentEndings.push(payload.specialEndingAchievementName);
      store.commit("unlockAchievement", payload.specialEndingAchievementName);
      const specialEndingAchievement = achievements.find((ach) => ach.name === payload.specialEndingAchievementName);
      state.gameLoop.specialEndingAchievement = specialEndingAchievement || null;
    } else {
      state.gameLoop.specialEndingAchievement = null;
    }

    state.gameLoop.gameEnded = payload.gameEnded;
    state.ui.showGameEndDialog = true;
  },

  resetGameState(state: RootState, resetData: boolean) {
    state.gameLoop.term++;
    state.gameLoop.round = 1;
    state.gameLoop.year = START_YEAR;
    state.gameLoop.gameEnded = false;
    state.gameLoop.currentEndings = [];
    state.gameLoop.specialEndingAchievement = null;
    state.progress.happenedEvents = [];
    state.textHistory = [];

    state.character.weak = false;
    state.character.drunk = 0;
    state.character.sleepHours = 0;

    state.relationship.girlfriend = null;
    state.relationship.flirtCount = 0;

    state.relationship.accompanyCount = 0;
    state.relationship.relationRound = 0;
    state.relationship.lastBreakupRound = 0;

    // state.progress.undergroundCount = 0
    state.progress.battleResults = battleResults;
    state.business.openFengyan = false;
    state.business.thisSeasonArtist = { move: null, dispatch: [] };

    state.business.signedAgency = false;
    state.business.signedAgencyRound = null;
    state.gameLoop.currentLyricIndex = -1;

    if (resetData) {
      state.character.attributes = {
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
      };

      state.progress.inventory = {};
      state.progress.lastSpecialItem = null;
      state.progress.songStages = {};
      state.progress.unlockedFeiSongs = [];
      state.progress.unlockedVitamins = [];
      state.progress.unlockedFoods = [];
      state.progress.shards = [];
      (state.business.artists = allArtists), (state.business.realEstate = []);
      state.business.investedProjects = [];
      state.business.investYearIncome = 0;
      state.business.currentStock = false;
    } else {
      const attributes = state.character.attributes;
      attributes.talent = Math.floor(attributes.talent * 0.2);
      attributes.charm = Math.floor(attributes.charm * 0.2);
      attributes.divine = Math.floor(attributes.divine * 0.2);
      attributes.popularity.red = Math.floor(attributes.popularity.red * 0.2);
      attributes.popularity.black = Math.floor(attributes.popularity.black * 0.2);
      attributes.money = Math.floor(attributes.money * 0.2);
      attributes.maxEnergy = Math.floor((attributes.maxEnergy - 100) * 0.2 + 100);
      attributes.energy = attributes.maxEnergy;
      attributes.mood = 0;
    }
  },
  loadGameState(state: RootState, gameData: any) {
    const migrated = migrateSave(gameData);
    // textHistory 不随存档覆盖；ui 不持久化。其余按 module 合并进既有响应式对象。
    const { textHistory, gameLoop, character, relationship, progress, business, ui, ...root } = migrated;
    Object.assign(state, root); // version / player
    if (gameLoop) Object.assign(state.gameLoop, gameLoop);
    if (character) Object.assign(state.character, character);
    if (relationship) Object.assign(state.relationship, relationship);
    if (progress) Object.assign(state.progress, progress);
    if (business) Object.assign(state.business, business);
  },
  setPlayer(state: RootState, player: PlayerResponse | null) {
    state.player = player;
  },
  resetGame(state: RootState) {
    state.gameLoop.term = 1;
    state.gameLoop.round = 1;
    state.gameLoop.year = START_YEAR;
    state.character.attributes = {
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
    };
    state.character.weak = false;
    state.character.drunk = 0;
    state.character.sleepHours = 0;
    state.relationship.flirtCount = 0;
    state.relationship.girlfriend = null;
    state.relationship.accompanyCount = 0;
    state.relationship.relationRound = 0;
    state.relationship.lastBreakupRound = 0;
    state.relationship.seamlessRelation = false;
    state.progress.unlockedFoods = [];
    state.progress.inventory = {};
    state.progress.lastSpecialItem = null;
    state.progress.achievementStates = [];
    state.progress.unlockedAchievementConditions = [];
    state.progress.happenedEvents = [];
    state.progress.battleResults = battleResults;
    state.progress.undergroundCount = 0;
    state.progress.tourCount = [0, 0];
    state.progress.shards = [];
    state.business.openFengyan = false;
    (state.business.artists = allArtists), (state.business.thisSeasonArtist = { move: null, dispatch: [] }), (state.business.signedAgency = false);
    state.business.signedAgencyRound = null;
    state.business.goToAgencyTimes = 0;
    state.progress.songs = [];
    state.progress.songStages = {};
    state.progress.unlockedFeiSongs = [];
    state.progress.unlockedVitamins = [];
    state.business.realEstate = [];
    state.business.investedProjects = [];
    state.business.currentStock = false;
    state.gameLoop.gameEnded = false;
    state.gameLoop.currentEndings = [];
    state.gameLoop.specialEndingAchievement = null;
    state.textHistory = [];
    state.player = null;

    state.gameLoop.currentLyricIndex = -1;

    state.ui.showStartGameDialog = true;
  },
};

type RootActionContext = { commit: Commit; state: RootState; dispatch: Function; getters: any };

const actions = {
  accompanyGirlfriend,
  goToLocation,
  performAction,
  purchaseItem,
  eatFood,
  packFood,
  eatPackedFood,
  drinkDrink,
  specialEvent,
  specialEventOptionChosen,
  typeWriter,
  async waitAndType(_context: RootActionContext, waitTime = 1000) {
    isTyping.value = true;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    isTyping.value = false;
  },
  typeWriterPopup,
  upgradeSkill,

  async incrementRound(context: RootActionContext) {
    context.commit("incrementRound");
    const state = context.state;

    if (isNaN(state.character.attributes.money)) {
      context.commit("updateAttribute", { attribute: "money", value: 0 });
      await context.dispatch("typeWriter", "姜云升实在是太有爱心了，你的钱太多了，你无私地把你的钱全部捐给了有需要的人，甚至不需要任何回报，也不需要任何人知晓！姜云升行善积德+10");
    } else if (state.character.attributes.money > 10000000000) {
      context.commit("updateAttribute", { attribute: "money", value: -state.character.attributes.money });
      if (isNaN(state.character.attributes.gold)) {
        context.commit("updateAttribute", { attribute: "gold", value: 0 });
      } else if (state.character.attributes.gold > 2) {
        context.commit("updateAttribute", { attribute: "gold", value: 2 - state.character.attributes.gold });
      }
      await context.dispatch("typeWriter", "姜云升实在是太有爱心了，你的钱太多了，你无私地把你的钱全部捐给了有需要的人，甚至不需要任何回报，也不需要任何人知晓！姜云升行善积德+10");
    }

    if (state.character.attributes.popularity.red > 100000000) {
      const red = state.character.attributes.popularity.red;
      const black = state.character.attributes.popularity.black;

      // math random 将 red 修正到 60000 到 90000 ，red和black比例保持不变
      const redRandom = Math.floor(Math.random() * 30000) + 60000;
      const blackRandom = Math.max(Math.min(Math.floor((black * redRandom) / red), black), Math.floor(Math.random() * 20000) + 60000);

      context.commit("updateAttribute", { attribute: "red", value: redRandom - red });
      context.commit("updateAttribute", { attribute: "black", value: blackRandom - black });

      await context.dispatch("typeWriter", "【系统】姜云升操作「清理微博粉丝」~修复了人气数据！");
    }

    if (state.character.drunk > 0) {
      store.commit("character/updateDrunk", -1);
      if (state.character.drunk === 0) {
        await store.dispatch("waitAndType", 600);
        await context.dispatch("typeWriter", "姜云升的酒醒了。");
      }
    }

    if (state.relationship.relationRound > 15) {
      if (Math.random() < 0.52) {
        await store.dispatch("waitAndType", 600);
        showBreakupDialog.value = true;
      }
    }

    if (state.business.signedAgency && !Math.floor(state.gameLoop.round % 9)) {
      await store.dispatch("waitAndType", 600);
      store.commit("updateAttribute", { attribute: "money", value: 500 * 3 * 5 });
      await context.dispatch("typeWriter", "姜云升签约了公司，到账工资1500元。");
    }

    if (!Math.floor(state.gameLoop.round % 9)) {
      if (state.business.thisSeasonArtist.dispatch.length > 0) {
        let income = 0;
        let activities = [];

        for (const artistName of state.business.thisSeasonArtist.dispatch) {
          const artist = state.business.artists.find((artist) => artist.name === artistName);
          if (artist && artist.level > 0) {
            let activity = "";
            switch (artist.level) {
              case 1:
                activity = "【" + artist.name + "】<small>（" + artist.level + "级）</small>参加了《男生女生向前冲》，收获冰箱1台";
                break;
              case 2:
                income += 8000; // level 2 的艺人增加收入8000
                activity = "【" + artist.name + "】<small>（" + artist.level + "级）</small>在Livehouse嘉宾助演";
                break;
              case 3:
                income += 80000; // level 3 的艺人增加收入8万
                activity = "【" + artist.name + "】<small>（" + artist.level + "级）</small>参加了音乐节演出";
                break;
              case 4:
                income += 180000; // level 4 的艺人增加收入18万
                activity = "【" + artist.name + "】<small>（" + artist.level + "级）</small>参加了音乐节演出";
                break;
              case 5:
                income += 280000; // level 5 的艺人增加收入28万
                activity = "【" + artist.name + "】<small>（" + artist.level + "级）</small>参加了音乐节演出";
                break;
            }
            activities.push(activity);
          }
        }
        context.commit("updateAttribute", { attribute: "money", value: income }); //更新总收入
        await context.dispatch("typeWriter", `【风炎经营季报】本季度风炎文化艺人${activities.join("；")}——风炎文化有限公司艺人演出本季度累计收益二八分得${income}元！`);
      }
      context.commit("business/resetThisSeasonArtist");
    }

    if (!Math.floor((state.gameLoop.round - 16) % 36)) {
      await store.dispatch("waitAndType", 600);
      await context.dispatch("specialEvent", EVENTS.BIRTHDAY);
    }

    // 第三年2月的时候，触发继承家业任务
    // if (state.gameLoop.round === 3 * 36 + 4) {
    //   context.dispatch('specialEvent', '继承家业');
    // }

    if (!Math.floor((state.gameLoop.round - 25) % 36)) {
      await store.dispatch("waitAndType", 600);
      await context.dispatch("typeWriter", "今年的Battle比赛已经开放，可以在外出时报名参加比赛了。");
    }

    if (!Math.floor(state.gameLoop.round % 36)) {
      await store.dispatch("waitAndType", 600);
      const investedProjects = state.business.investedProjects;
      const investYearIncome = state.business.investYearIncome;
      const investedProjectNames = investedProjects.map((project: string) => project).join("】、【");
      context.commit("updateAttribute", { attribute: "money", value: investYearIncome });

      if (investedProjects.length > 1) {
        await context.dispatch("typeWriter", "【投资年报】「付出没有结果，这事我不相信！」年底啦，恭喜投资奇才姜云升获得了【" + investedProjectNames + "】几大投资项目的年收益【" + investYearIncome + "】元！");
      } else if (investedProjects.length === 1) {
        await context.dispatch("typeWriter", "【投资年报】「付出没有结果，这事我不相信！」年底啦，恭喜投资奇才姜云升获得了【" + investedProjectNames + "】项目的年收益【" + investYearIncome + "】元！");
      }
    }

    if (state.gameLoop.round === 10 * 36) {
      await store.dispatch("waitAndType", 600);
      await context.dispatch("specialEvent", EVENTS.TEN_YEARS);
    }

    if (state.character.attributes.popularity.red + state.character.attributes.popularity.black > 1200 && state.character.attributes.popularity.black > 1000) {
      const isAchUnlocked = context.getters.unlockedAchievement("我所拥有的人气，又是不是真的？");
      if (!isAchUnlocked) {
        await store.dispatch("waitAndType", 600);
        context.commit("unlockAchievement", "我所拥有的人气，又是不是真的？");
        await context.dispatch("typeWriter", "人气>1200，黑人气>1000。解锁成就【我所拥有的人气，又是不是真的？】");
      }
    }

    if (!state.gameLoop.currentEndings.includes("汤臣亿品") && state.character.attributes.money >= 100000000) {
      context.commit("setGameEnded", { gameEnded: false, specialEndingAchievementName: "汤臣亿品" });
      return;
    }

    if (
      !state.gameLoop.currentEndings.includes("刀削面子") &&
      state.relationship.girlfriend &&
      state.relationship.breakupTimes >= 11 &&
      state.progress.songStages["浪漫主义"] &&
      state.progress.songStages["浪漫主义"].completedStage &&
      state.progress.songStages["浪漫主义2.0"] &&
      state.progress.songStages["浪漫主义2.0"].completedStage
    ) {
      context.commit("setGameEnded", { gameEnded: false, specialEndingAchievementName: "刀削面子" });
      return;
    }

    if (
      !state.gameLoop.currentEndings.includes("皮卡皮卡") &&
      state.progress.inventory["皮卡丘玩偶"] &&
      state.progress.inventory["皮卡丘玩偶"].quantity >= 521 &&
      state.progress.songStages["皮卡丘"] &&
      state.progress.songStages["皮卡丘"].completedStage &&
      !(state.progress.songStages["3"] && state.progress.songStages["3"].completedStage)
    ) {
      context.commit("setGameEnded", { gameEnded: false, specialEndingAchievementName: "皮卡皮卡" });
      return;
    }

    if (state.gameLoop.round > state.gameLoop.totalRounds) {
      if (state.gameLoop.currentEndings.length > 0) {
        context.commit("setGameEnded", { gameEnded: true, specialEndingAchievementName: state.gameLoop.currentEndings });
        return;
      } else {
        if (state.character.attributes.money <= 99999) {
          context.commit("setGameEnded", { gameEnded: true, specialEndingAchievementName: "一肩明月，两袖清风" });
          return;
        } else {
          context.commit("setGameEnded", { gameEnded: true, specialEndingAchievementName: "无法定义的结局" });
          return;
        }
      }
    }

    if (state.character.attributes.energy <= -100) {
      context.commit("setGameEnded", { gameEnded: true, specialEndingAchievementName: "姜云升虚弱" });
      return;
    }

    if (state.character.attributes.mood <= -100) {
      context.commit("setGameEnded", { gameEnded: true, specialEndingAchievementName: "我不做人啦" });
      return;
    }
  },
};

// 跨域全局 getter 保留在 root：可读取完整 RootState 下的各 module state。
const getters = {
  currentYear(state: RootState) {
    return state.gameLoop.year;
  },
  currentRound(state: RootState) {
    return state.gameLoop.round;
  },
  totalRounds(state: RootState) {
    return state.gameLoop.totalRounds;
  },
  attributes(state: RootState) {
    return state.character.attributes;
  },
  unlockedAchievement: (state: RootState) => (achievementName: string) => {
    const achievement = state.progress.achievementStates.find((ach) => ach.name === achievementName);
    return achievement ? achievement.unlocked : false;
  },
  UnlockedAchievementCount(state: RootState) {
    return state.progress.achievementStates.filter((ach) => ach.unlocked === true).length;
  },
};

export const store: Store<RootState> = createStore<RootState>({
  state: createRootState() as unknown as RootState,
  modules: { gameLoop, character, relationship, progress, business, ui },
  mutations,
  actions,
  getters,
});

// 类型化的 useStore：返回单例并把 store.state 标注为 RootState，使组件中的 state 路径可被静态检查。
export const useStore = (): Store<RootState> => store;

export default store;
