import { createStore, Store, Commit } from "vuex";
import axios from "axios";

import { Food, eatFood, packFood, eatPackedFood, drinkDrink } from "./eats";
import { achievements, AchievementState } from "./achievements";
import { SongFei } from "./songs";
import { Vitamin } from "./vitamins";
import { battleResults, BattleResult } from "./battle";
import { allArtists, Artist } from "./artists";

import { Attributes } from "../store/attributes";
import { Girlfriend } from "./girlfriend";
import { accompanyGirlfriend } from "./actions/accompanyGirlfriend";
import { goToLocation } from "./actions/goToLocation";
import { specialEvent, specialEventOptionChosen } from "./actions/specialEvent";
import { performAction } from "./actions/performActions";
import { purchaseItem, Inventory } from "./actions/purchaseItem";
import { upgradeSkill, SkillLevelMapping } from "./actions/upgradeSkill";
import { typeWriter, typeWriterPopup } from "./actions/typeWriter";

import { Player } from "./player";

import { isTyping, showBreakupDialog, showGameEndDialog, showStartGameDialog } from "../components/composables/gameRefs";

export const skyTreeLyrics = [
  "替我飞到东京去看天空树✈️🌆",
  "搭坐涩谷电梯吻夕阳与地平线🌇🚉",
  "赶在日落那片黑暗到来前🌅⏳",
  "告诉他们我经历的这一切🗣️💬",
  "替我去看法国阿尔卑斯山🏔️🇫🇷",
  "时间定在圣诞节的12月🎄❄️",
  "毕竟我算是个土生土长的南方人🌴🌞",
  "别笑我这一辈子都没有见过几次雪☃️😅",
  "替我吃遍城市里的美食街🍣🍜",
  "我要点没蔬菜全是肉的那一种🥩🍗",
  "最好再去看秋田叔的演唱会🎤🎶",
  "听听回忆里最感动我的那一首💖🎵",
  "替我走在夜幕下的沙滩边🏖️🌙",
  "看星空与海模糊了的分界线🌌🌊",
  "张开双手风会替我抱紧你🌬️🤗",
  "我就活在你生命的倒影里💫👥",
  "长生 沐浴 冠带 临官✨🚿👑",
  "嗤笑 怒骂 喜怒 悲欢😏😡😃😢",
  "无来 无往 无妄 无常⚖️🔄",
  "生长 生命 生存 生活🌱💖",
  "替我追一百部剧📺🎬",
  "替我看一百部番📚🎥",
  "替我冲一千次浪🌊🏄‍♀️",
  "也可以爬一百座山⛰️🧗‍♂️",
  "拔去父母童年有意无意扎向你的刺👨‍👩‍👧‍👦🪶",
  "替我做遍他们口中所谓没意义的事🙄🌀",
  "替我选你爱的人在一起 哪怕会伤痛💔❤️",
  "在能选择的年纪里 没选择将就⏳🤷‍♂️",
  "都一无所有 为什么还在旁边当个观众?🤔👀",
  "钱包空无一个铜板 那就刚好用来装梦💸💭",
  "替我在反感时说反感 不附和多数👎🤐",
  "大多数服从 也都为了有天能说不💼🚫",
  "用火把夜点亮 给出第五个选项🔥🌙",
  "去做你认为对的 再把证据丢他脸上🛠️⚡",
  "替我立在新世界的风里🌍💨",
  "远离所有盲从的拥挤🚶‍♀️🏙️",
  "替我质疑长者们的公理👵🔍",
  "在说教者的怒斥中😡📣",
  "用力地直起身体💪🧍‍♀️"
];

export interface State {
  term: number;
  year: number;
  round: number;
  totalRounds: number;
  attributes: Attributes;
  weak: boolean;
  drunk: number;
  sleepHours: number;

  girlfriend: Girlfriend | null;
  flirtCount: number;
  accompanyCount: number;
  relationRound: number;
  breakupTimes: number;
  lastBreakupRound: number | null;
  seamlessRelation: boolean;

  unlockedFoods: Food[];
  inventory: Inventory;
  lastSpecialItem: string | null;

  achievementStates: AchievementState[];
  unlockedAchievementConditions: string[];
  happenedEvents: string[];

  battleResults: BattleResult[];

  undergroundCount: number;
  tourCount: number[];

  signedAgency: boolean;
  signedAgencyRound: number | null;
  goToAgencyTimes: number;

  songs: string[];
  songStages: Record<string, { completedStage: string | null; unlocked: boolean }>;
  unlockedFeiSongs: SongFei[];
  unlockedVitamins: Vitamin[];

  shards: string[];
  openFengyan: boolean;
  artists: Artist[];
  thisSeasonArtist: { move: { name: string; action: string } | null; dispatch: string[] };

  realEstate: string[];
  investedProjects: string[];
  investYearIncome: number;
  currentStock: boolean;

  gameEnded: boolean;
  currentEndings: string[];
  specialEndingAchievement: { name: string; desc: string } | null;

  textHistory: string[];
  player: Player | null;

  currentLyricIndex: number;

  [key: string]: any;
}

const state: State = {
  term: 1,
  year: 2012,
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
};

type UpdateAttributePayload = {
  attribute: keyof Attributes | "red" | "black" | "gaming" | "freestyle" | "fightLevel";
  value: number;
};

const goldPrice = 552;

const mutations = {
  incrementRound(state: State) {
    state.round++;
    state.year = Math.floor((state.round - 1) / 36) + 2012;
    if (state.year > 2024) {
      state.year = 2012;
    }
    state.attributes.money += Math.ceil(state.attributes.gold * 0.06 * goldPrice);
    if (state.girlfriend) {
      state.relationRound++;
    }
  },

  async updateAttribute(state: State, payload: UpdateAttributePayload) {
    const { attribute, value } = payload;

    if (attribute === "money") {
      if (isNaN(state.attributes.money)) {
        state.attributes.money = 0;
        state.attributes.gold = 2;
      } else if (state.signedAgency && value > 0) {
        (state.attributes[attribute] as number) += value * 0.2;
      } else {
        (state.attributes[attribute] as number) += value;
      }
      state.attributes.money = Math.round(state.attributes.money);
    } else if (attribute === "gold") {
      if (isNaN(state.attributes.gold)) {
        state.attributes.money = 0;
        state.attributes.gold = 2;
      } else {
        state.attributes.gold += value;
      }
    } else if (attribute === "popularity") {
      if (value > 0) {
        state.attributes.popularity.red += value;
      } else {
        state.attributes.popularity.black += value;
      }
    } else if (attribute === "red") {
      state.attributes.popularity.red += value;
      if (state.attributes.popularity.red < 0) {
        state.attributes.popularity.red = 0;
      }
    } else if (attribute === "black") {
      state.attributes.popularity.black += value;
      if (state.attributes.popularity.black < 0) {
        state.attributes.popularity.black = 0;
      }
    } else if (attribute === "gaming" || attribute === "freestyle") {
      const skill = attribute;

      const currentLevel = SkillLevelMapping.find((level) => level.level === state.attributes.skill[`${skill}Level`]);
      const currentLevelMax = currentLevel ? currentLevel.max : 0;
      state.attributes.skill[skill] = Math.min(state.attributes.skill[skill] + value, currentLevelMax);
    } else if (attribute === "fightLevel") {
      const currentLevel = state.attributes.fight.level;
      const currentLevelMax = 81;
      state.attributes.fight.level = Math.min(currentLevel + value, currentLevelMax);
    } else {
      (state.attributes[attribute] as number) += value;

      if (attribute === "energy") {
        if (state.attributes.energy > state.attributes.maxEnergy) {
          state.attributes.energy = state.attributes.maxEnergy;
        }

        if (state.attributes.energy < 0 && !state.weak) {
          state.weak = true;
          // if (!state.weak) {

          //   await store.dispatch('typeWriter', '体力<0，姜云升进入了虚弱状态。')
          // } else {
          //   await store.dispatch('typeWriter', '体力<0，姜云升正处于虚弱状态。')
          // }
        } else if (state.attributes.energy >= 0 && state.weak) {
          state.weak = false;
          // await store.dispatch('typeWriter', '体力>0，姜云升从虚弱状态恢复啦。')
        }
      }
    }
  },

  addSleepHours(state: State, payload: number) {
    state.sleepHours += payload;
  },

  upgradeSkillLevel(state: State, skill: "gaming" | "freestyle") {
    if (skill === "gaming" || skill === "freestyle") {
      state.attributes.skill[skill]++;
      for (const level of SkillLevelMapping) {
        if (state.attributes.skill[skill] >= level.min && state.attributes.skill[skill] <= level.max) {
          state.attributes.skill[`${skill}Level`] = level.level;
          break;
        }
      }
    }
  },

  setWeak(state: State, payload: boolean) {
    state.weak = payload;
  },

  updateDrunk(state: State, payload: number) {
    state.drunk += payload;
  },

  setGirlfriend(state: State, payload: { type: string; effect: keyof Attributes; breakupReasons: string[] } | null) {
    state.girlfriend = payload;
    if (payload === null) {
      state.breakupTimes++;
      state.lastBreakupRound = state.round;
    }
  },
  incrementFlirtCount(state: State) {
    state.flirtCount += 1;
  },
  resetFlirtCount(state: State) {
    state.flirtCount = 0;
  },
  resetRelationRound(state: State) {
    state.relationRound = 0;
  },
  setSeamlessRelation(state: State, payload: boolean) {
    state.seamlessRelation = payload;
  },
  incrementAccompanyCount(state: State) {
    state.accompanyCount++;
  },
  resetAccompanyCount(state: State) {
    state.accompanyCount = 0;
  },
  incrementUndergroundCount(state: State) {
    state.undergroundCount++;
  },
  incrementTourCount(state: State, index: number) {
    state.tourCount[index]++;
  },
  updateBattleResult(state: State, payload: { year: number; result: "落选" | "海选" | "八强" | "冠军" | "Masta" }) {
    const { year, result } = payload;
    if (Array.isArray(state.battleResults)) {
      const index = state.battleResults.findIndex((battleResult) => battleResult.year === year);
      if (index !== -1) {
        state.battleResults[index].result = result;
      }
    }
  },
  updateBattleEnd(state: State, payload: { year: number; end: boolean }) {
    const { year, end } = payload;
    if (Array.isArray(state.battleResults)) {
      const index = state.battleResults.findIndex((battleResult) => battleResult.year === year);
      if (index !== -1) {
        state.battleResults[index].end = end;
      }
    }
  },
  setSignedAgency(state: State, payload: boolean) {
    state.signedAgency = payload;
    if (payload) {
      state.signedAgencyRound = state.round;
    }
  },
  incrementGoToAgencyTimes(state: State) {
    state.goToAgencyTimes++;
  },
  buyGold(state: State, payload: number) {
    state.attributes.gold += payload;
    state.attributes.money -= goldPrice * payload;
  },
  updateItem(state: State, payload: { itemName: string; quantity: number }) {
    const { itemName, quantity } = payload;
    if (itemName === "麦克风大锤" || itemName === "恶魔「S」之链" || itemName === "反穿之甲" || itemName === "虚无之裤" || itemName === "黄色卡车" || itemName === "巴黎之靴") {
      if (state.inventory[itemName] && state.inventory[itemName].quantity > 0) {
        state.inventory[itemName].quantity = 1;
      } else {
        state.inventory[itemName] = {
          quantity: 1,
          isFood: false,
        };
        state.lastSpecialItem = itemName;
      }
    } else {
      if (state.inventory[itemName]) {
        state.inventory[itemName].quantity += quantity;
      } else {
        state.inventory[itemName] = {
          quantity: quantity,
          isFood: false,
        };
      }
    }
  },
  packFood(state: State, { food, quantity }: { food: string; quantity: number }) {
    if (state.inventory[food]) {
      state.inventory[food].quantity += quantity;
    } else {
      state.inventory[food] = {
        quantity: quantity,
        isFood: true,
      };
    }
  },
  decreaseInventory(state: State, { itemName, quantity }: { itemName: string; quantity: number }) {
    if (state.inventory[itemName]) {
      state.inventory[itemName].quantity -= quantity;
      if (state.inventory[itemName].quantity <= 0) {
        delete state.inventory[itemName];
      }
    }
  },
  addHappenedEvent(state: State, event: string) {
    if (!state.happenedEvents.includes(event)) {
      state.happenedEvents.push(event);
    }
  },
  unlockSong(state: State, songTitle: string) {
    if (state.songStages[songTitle]) {
      state.songStages[songTitle].unlocked = true;
    } else {
      state.songStages[songTitle] = {
        completedStage: null,
        unlocked: true,
      };
    }
  },
  setSongStages(state: State, songStages: { songTitle: string; stage: string }) {
    if (state.songStages[songStages.songTitle]) {
      state.songStages[songStages.songTitle].completedStage = songStages.stage;
    } else {
      state.songStages[songStages.songTitle] = {
        completedStage: songStages.stage,
        unlocked: true,
      };
    }
  },

  unlockFeiSong(state: State, songFei: SongFei) {
    state.unlockedFeiSongs.push(songFei);
  },

  unlockVitamin(state: State, vitamin: Vitamin) {
    state.unlockedVitamins.push(vitamin);
  },

  unlockFood(state: State, food: Food) {
    state.unlockedFoods.push(food);
    state.attributes.maxEnergy += Math.ceil(food.energy / 10);
  },

  openFengyan(state: State, payload: boolean) {
    state.openFengyan = payload;
  },
  initArtist(state: State, artistName: string) {
    state.artists.push({ name: artistName, level: 0 });
  },
  recruitArtist(state: State, artistName: string) {
    let artist = state.artists.find((artist) => artist.name === artistName);
    if (artist && state.thisSeasonArtist.move === null) {
      artist.level += 1;
      state.thisSeasonArtist.move = { name: artistName, action: "招募" };
      state.attributes.money -= 800000; // 支出公司运营费用
    }
  },
  trainArtist(state: State, artistName: string) {
    let artist = state.artists.find((artist) => artist.name === artistName);
    if (artist && artist.level > 0 && state.thisSeasonArtist.move === null) {
      artist.level += 1;
      state.thisSeasonArtist.move = { name: artistName, action: "锻炼" };
      state.attributes.money -= 800000; // 支出公司运营费用
    }
  },
  dispatchArtist(state: State, artistName: string) {
    let artist = state.artists.find((artist) => artist.name === artistName);
    if (artist && artist.level > 0 && !state.thisSeasonArtist.dispatch.includes(artistName)) {
      state.thisSeasonArtist.dispatch.push(artistName);
      // 根据艺人等级，给予收益
      switch (artist.level) {
        case 1:
          break; // level 1 的艺人只获得冰箱，不增加收入
        case 2:
          state.attributes.money += 8000; // level 2 的艺人增加收入8000
          break;
        case 3:
          state.attributes.money += 80000; // level 3 的艺人增加收入8万
          break;
        case 4:
          state.attributes.money += 180000; // level 4 的艺人增加收入18万
          break;
        case 5:
          state.attributes.money += 280000; // level 5 的艺人增加收入28万
          break;
      }
    }
  },
  resetThisSeasonArtist(state: State) {
    state.thisSeasonArtist = { move: null, dispatch: [] };
  },

  collectShard(state: State, shard: string) {
    state.shards.push(shard);
  },

  unlockAchievement(state: State, achievementName: string) {
    const achievement = achievements.find((ach) => ach.name === achievementName);
    const achievementState = state.achievementStates.find((ach) => ach.name === achievementName);
    if (achievement && !achievementState) {
      state.achievementStates.push({
        name: achievement.name,
        unlocked: true,
        unlockTerm: state.term,
      });
    }
  },

  unlockAchievementCondition(state: State, achievementName: string) {
    if (state.unlockedAchievementConditions.length >= state.term - 1) {
      return;
    }
    state.unlockedAchievementConditions.push(achievementName);
  },

  investProject(state: State, project: { name: string; income: number; cost: number }) {
    state.investedProjects.push(project.name);
    state.investYearIncome += project.income;
    state.attributes.money -= project.cost;
  },

  addTextToHistory(state: State, message: string | string[]) {
    if (typeof message === "string") {
      state.textHistory.push(message);
    } else {
      message.forEach((m) => state.textHistory.push(m));
    }
  },

  setGameEnded(state: State, payload: { gameEnded: boolean; specialEndingAchievementName: string | string[] }) {
    if (typeof payload.specialEndingAchievementName === "string") {
      if (!payload.gameEnded) state.currentEndings.push(payload.specialEndingAchievementName);
      store.commit("unlockAchievement", payload.specialEndingAchievementName);
      const specialEndingAchievement = achievements.find((ach) => ach.name === payload.specialEndingAchievementName);
      state.specialEndingAchievement = specialEndingAchievement || null;
    } else {
      state.specialEndingAchievement = null;
    }

    state.gameEnded = payload.gameEnded;
    showGameEndDialog.value = true;
  },

  resetGameState(state: State, resetData: boolean) {
    state.term++;
    state.round = 1;
    state.year = 2012;
    state.gameEnded = false;
    state.currentEndings = [];
    state.specialEndingAchievement = null;
    state.happenedEvents = [];
    state.textHistory = [];

    state.weak = false;
    state.drunk = 0;
    state.sleepHours = 0;

    state.girlfriend = null;
    state.flirtCount = 0;

    state.accompanyCount = 0;
    state.relationRound = 0;
    state.lastBreakupRound = 0;

    // state.undergroundCount = 0
    state.battleResults = battleResults;
    state.openFengyan = false;
    state.thisSeasonArtist = { move: null, dispatch: [] };

    state.signedAgency = false;
    state.signedAgencyRound = null;
    state.currentLyricIndex = -1;
    
    if (resetData) {
      state.attributes = {
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

      state.inventory = {};
      state.lastSpecialItem = null;
      state.songStages = {};
      state.unlockedFeiSongs = [];
      state.unlockedVitamins = [];
      state.unlockedFoods = [];
      state.shards = [];
      (state.artists = allArtists), (state.realEstate = []);
      state.investedProjects = [];
      state.investYearIncome = 0;
      state.currentStock = false;
    } else {
      state.attributes.talent = Math.floor(state.attributes.talent * 0.2);
      state.attributes.charm = Math.floor(state.attributes.charm * 0.2);
      state.attributes.divine = Math.floor(state.attributes.divine * 0.2);
      state.attributes.popularity.red = Math.floor(state.attributes.popularity.red * 0.2);
      state.attributes.popularity.black = Math.floor(state.attributes.popularity.black * 0.2);
      state.attributes.money = Math.floor(state.attributes.money * 0.2);
      state.attributes.maxEnergy = Math.floor((state.attributes.maxEnergy - 100) * 0.2 + 100);
      state.attributes.energy = state.attributes.maxEnergy;
      state.attributes.mood = 0;
    }
  },
  loadGameState(state: State, gameData: State) {
    const { textHistory, ...otherData } = gameData;
    Object.assign(state, otherData);
  },
  setPlayer(state: State, player: Player) {
    state.player = player;
  },
  resetGame(state: State) {
    state.term = 1;
    state.round = 1;
    state.year = 2012;
    state.attributes = {
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
    state.weak = false;
    state.drunk = 0;
    state.sleepHours = 0;
    state.flirtCount = 0;
    state.girlfriend = null;
    state.accompanyCount = 0;
    state.relationRound = 0;
    state.lastBreakupRound = 0;
    state.seamlessRelation = false;
    state.unlockedFoods = [];
    state.inventory = {};
    state.lastSpecialItem = null;
    state.achievementStates = [];
    state.unlockedAchievementConditions = [];
    state.happenedEvents = [];
    state.battleResults = battleResults;
    state.undergroundCount = 0;
    state.tourCount = [0, 0];
    state.shards = [];
    state.openFengyan = false;
    (state.artists = allArtists), (state.thisSeasonArtist = { move: null, dispatch: [] }), (state.signedAgency = false);
    state.signedAgencyRound = null;
    state.goToAgencyTimes = 0;
    state.songs = [];
    state.songStages = {};
    state.unlockedFeiSongs = [];
    state.unlockedVitamins = [];
    state.realEstate = [];
    state.investedProjects = [];
    state.currentStock = false;
    state.gameEnded = false;
    state.currentEndings = [];
    state.specialEndingAchievement = null;
    state.textHistory = [];
    state.player = null;

    state.currentLyricIndex = -1;

    showStartGameDialog.value = true;
  },
  incrementLyricIndex(state: State) {
    state.currentLyricIndex++;
    if (state.currentLyricIndex >= skyTreeLyrics.length) {
      state.currentLyricIndex = 0;
    }
  },
};

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
  async waitAndType(context: { commit: Commit; state: State; dispatch: Function; getters: any }, waitTime = 1000) {
    isTyping.value = true;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    isTyping.value = false;
  },
  typeWriterPopup,
  upgradeSkill,

  async incrementRound(context: { commit: Commit; state: State; dispatch: Function; getters: any }) {
    context.commit("incrementRound");

    if (isNaN(state.attributes.money)) {
      context.commit("updateAttribute", { attribute: "money", value: 0 });
      await context.dispatch("typeWriter", "姜云升实在是太有爱心了，你的钱太多了，你无私地把你的钱全部捐给了有需要的人，甚至不需要任何回报，也不需要任何人知晓！姜云升行善积德+10");
    } else if (state.attributes.money > 10000000000) {
      context.commit("updateAttribute", { attribute: "money", value: -state.attributes.money });
      if (isNaN(state.attributes.gold)) {
        context.commit("updateAttribute", { attribute: "gold", value: 0 });
      } else if (state.attributes.gold > 2) {
        context.commit("updateAttribute", { attribute: "gold", value: 2 - state.attributes.gold });
      }
      await context.dispatch("typeWriter", "姜云升实在是太有爱心了，你的钱太多了，你无私地把你的钱全部捐给了有需要的人，甚至不需要任何回报，也不需要任何人知晓！姜云升行善积德+10");
    }

    if (state.attributes.popularity.red > 100000000) {
      const red = state.attributes.popularity.red;
      const black = state.attributes.popularity.black;

      // math random 将 red 修正到 60000 到 90000 ，red和black比例保持不变
      const redRandom = Math.floor(Math.random() * 30000) + 60000;
      const blackRandom = Math.max(Math.min(Math.floor((black * redRandom) / red), black), Math.floor(Math.random() * 20000) + 60000);

      context.commit("updateAttribute", { attribute: "red", value: redRandom - red });
      context.commit("updateAttribute", { attribute: "black", value: blackRandom - black });

      await context.dispatch("typeWriter", "【系统】姜云升操作「清理微博粉丝」~修复了人气数据！");
    }

    if (state.drunk > 0) {
      store.commit("updateDrunk", -1);
      if (state.drunk === 0) {
        await store.dispatch("waitAndType", 600);
        await context.dispatch("typeWriter", "姜云升的酒醒了。");
      }
    }

    if (state.relationRound > 15) {
      if (Math.random() < 0.52) {
        await store.dispatch("waitAndType", 600);
        showBreakupDialog.value = true;
      }
    }

    if (state.signedAgency && !Math.floor(state.round % 9)) {
      await store.dispatch("waitAndType", 600);
      store.commit("updateAttribute", { attribute: "money", value: 500 * 3 * 5 });
      await context.dispatch("typeWriter", "姜云升签约了公司，到账工资1500元。");
    }

    if (!Math.floor(state.round % 9)) {
      if (state.thisSeasonArtist.dispatch.length > 0) {
        let income = 0;
        let activities = [];

        for (const artistName of state.thisSeasonArtist.dispatch) {
          const artist = state.artists.find((artist) => artist.name === artistName);
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
      context.commit("resetThisSeasonArtist");
    }

    if (!Math.floor((state.round - 16) % 36)) {
      await store.dispatch("waitAndType", 600);
      await context.dispatch("specialEvent", "生日快乐");
    }

    // 第三年2月的时候，触发继承家业任务
    // if (state.round === 3 * 36 + 4) {
    //   context.dispatch('specialEvent', '继承家业');
    // }

    if (!Math.floor((state.round - 25) % 36)) {
      await store.dispatch("waitAndType", 600);
      await context.dispatch("typeWriter", "今年的Battle比赛已经开放，可以在外出时报名参加比赛了。");
    }

    if (!Math.floor(state.round % 36)) {
      await store.dispatch("waitAndType", 600);
      const investedProjects = state.investedProjects;
      const investYearIncome = state.investYearIncome;
      const investedProjectNames = investedProjects.map((project: string) => project).join("】、【");
      context.commit("updateAttribute", { attribute: "money", value: investYearIncome });

      if (investedProjects.length > 1) {
        await context.dispatch("typeWriter", "【投资年报】「付出没有结果，这事我不相信！」年底啦，恭喜投资奇才姜云升获得了【" + investedProjectNames + "】几大投资项目的年收益【" + investYearIncome + "】元！");
      } else if (investedProjects.length === 1) {
        await context.dispatch("typeWriter", "【投资年报】「付出没有结果，这事我不相信！」年底啦，恭喜投资奇才姜云升获得了【" + investedProjectNames + "】项目的年收益【" + investYearIncome + "】元！");
      }
    }

    if (state.round === 10 * 36) {
      await store.dispatch("waitAndType", 600);
      await context.dispatch("specialEvent", "十年");
    }

    if (state.attributes.popularity.red + state.attributes.popularity.black > 1200 && state.attributes.popularity.black > 1000) {
      const isAchUnlocked = context.getters.unlockedAchievement("我所拥有的人气，又是不是真的？");
      if (!isAchUnlocked) {
        await store.dispatch("waitAndType", 600);
        context.commit("unlockAchievement", "我所拥有的人气，又是不是真的？");
        await context.dispatch("typeWriter", "人气>1200，黑人气>1000。解锁成就【我所拥有的人气，又是不是真的？】");
      }
    }

    if (!state.currentEndings.includes("汤臣亿品") && state.attributes.money >= 100000000) {
      context.commit("setGameEnded", { gameEnded: false, specialEndingAchievementName: "汤臣亿品" });
      return;
    }

    if (
      !state.currentEndings.includes("刀削面子") &&
      state.girlfriend &&
      state.breakupTimes >= 11 &&
      state.songStages["浪漫主义"] &&
      state.songStages["浪漫主义"].completedStage &&
      state.songStages["浪漫主义2.0"] &&
      state.songStages["浪漫主义2.0"].completedStage
    ) {
      context.commit("setGameEnded", { gameEnded: false, specialEndingAchievementName: "刀削面子" });
      return;
    }

    if (
      !state.currentEndings.includes("皮卡皮卡") &&
      state.inventory["皮卡丘玩偶"] &&
      state.inventory["皮卡丘玩偶"].quantity >= 521 &&
      state.songStages["皮卡丘"] &&
      state.songStages["皮卡丘"].completedStage &&
      !(state.songStages["3"] && state.songStages["3"].completedStage)
    ) {
      context.commit("setGameEnded", { gameEnded: false, specialEndingAchievementName: "皮卡皮卡" });
      return;
    }

    if (state.round > state.totalRounds) {
      if (state.currentEndings.length > 0) {
        context.commit("setGameEnded", { gameEnded: true, specialEndingAchievementName: state.currentEndings });
        return;
      } else {
        if (state.attributes.money <= 99999) {
          context.commit("setGameEnded", { gameEnded: true, specialEndingAchievementName: "一肩明月，两袖清风" });
          return;
        } else {
          context.commit("setGameEnded", { gameEnded: true, specialEndingAchievementName: "无法定义的结局" });
          return;
        }
      }
    }

    if (state.attributes.energy <= -100) {
      context.commit("setGameEnded", { gameEnded: true, specialEndingAchievementName: "姜云升虚弱" });
      return;
    }

    if (state.attributes.mood <= -100) {
      context.commit("setGameEnded", { gameEnded: true, specialEndingAchievementName: "我不做人啦" });
      return;
    }
  },
};

const getters = {
  currentYear(state: State) {
    return state.year;
  },
  currentRound(state: State) {
    return state.round;
  },
  totalRounds(state: State) {
    return state.totalRounds;
  },
  attributes(state: State) {
    return state.attributes;
  },
  unlockedAchievement: (state: State) => (achievementName: string) => {
    const achievement = state.achievementStates.find((ach) => ach.name === achievementName);
    return achievement ? achievement.unlocked : false;
  },
  UnlockedAchievementCount(state: State) {
    return state.achievementStates.filter((ach) => ach.unlocked === true).length;
  },
};

export const store: Store<State> = createStore({
  state,
  mutations,
  actions,
  getters,
});

export default store;
