import { createStore, Store, Commit } from 'vuex'

import { Food, eatFood, packFood, eatPackedFood, drinkDrink } from './eats'
import { achievements, Achievement } from './achievements'
import { songLibrary, Song, SongFei } from './songs'
import { Vitamin } from './vitamins'
import { battleResults, BattleResult } from './battle'

import { Attributes } from '../store/attributes'
import { girlfriendTypes, Girlfriend } from './girlfriend'
import { accompanyGirlfriend } from './actions/accompanyGirlfriend';
import { goToLocation } from './actions/goToLocation';
import { specialEvent, specialEventOptionChosen } from './actions/specialEvent';
import { performAction } from './actions/performActions';
import { purchaseItem, Inventory } from './actions/purchaseItem';
import { upgradeSkill, SkillLevelMapping } from './actions/upgradeSkill';
import { typeWriter, typeWriterPopup } from './actions/typeWriter';

import { showBreakupDialog, showGameEndDialog } from '../components/composables/gameRefs';

interface State {
  term: number
  year: number
  round: number
  totalRounds: number
  attributes: Attributes
  weak: boolean
  drunk: number
  sleepHours: number

  girlfriend: Girlfriend | null
  girlfriendTypes: Girlfriend[]
  flirtCount: number
  accompanyCount: number
  relationRound: number
  breakupTimes: number
  lastBreakupRound: number | null
  seamlessRelation: boolean

  unlockedFoods: Food[]
  inventory: Inventory
  lastSpecialItem: string | null

  achievements: Achievement[]
  unlockedAchievementConditions: string[]
  
  battleResults: BattleResult[]

  undergroundCount: number
  tourCount: number[]

  signedAgency: boolean
  signedAgencyRound: number | null
  goToAgencyTimes: number

  songs: string[]
  songLibrary: Song[]
  songStages: Record<string, { completedStage: string | null, unlocked: boolean }>
  unlockedFeiSongs: SongFei[]


  unlockedVitamins: Vitamin[]

  happenedEvents: string[]

  gameEnded: boolean
  currentEndings: string[]
  specialEndingAchievement: { name: string; desc: string } | null

  textHistory: string[],

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
      gamingLevel: 'D',
      freestyleLevel: 'D'
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
  girlfriendTypes: girlfriendTypes,
  accompanyCount: 0,
  relationRound: 0,
  breakupTimes: 0,
  lastBreakupRound: null,
  seamlessRelation: false,

  unlockedFoods: [],
  inventory: {},
  lastSpecialItem: null,

  achievements: achievements,
  unlockedAchievementConditions: [],

  battleResults: battleResults,
  undergroundCount: 0,
  tourCount: [0,0],

  signedAgency: false,
  signedAgencyRound: null,
  goToAgencyTimes: 0,
  
  songs: [],
  songLibrary,
  songStages: {},
  unlockedFeiSongs: [],

  unlockedVitamins: [],

  happenedEvents: [],

  gameEnded: false,
  currentEndings: [],
  specialEndingAchievement: null,

  textHistory: [],

}

type UpdateAttributePayload = {
  attribute: keyof Attributes | "red" | "black" | "gaming" | "freestyle" | 'fightLevel'
  value: number
}

const mutations = {
  incrementRound(state: State) {
    state.round++
    if (state.round % 36 === 0) { state.year++ }
    state.attributes.money += Math.ceil(state.attributes.gold * 0.06 * 360);
    if (state.girlfriend) { state.relationRound++; }
  },
  
  async updateAttribute(state: State, payload: UpdateAttributePayload) {
    const { attribute, value } = payload

    if (attribute === 'money') {
      if (state.signedAgency && value > 0) {
        (state.attributes[attribute] as number) += value * 0.2
      } else {
        (state.attributes[attribute] as number) += value
      }
    } else if (attribute === "popularity") {
      if (value > 0) {
        state.attributes.popularity.red += value
      } else {
        state.attributes.popularity.black += value
      }
    }
    else if (attribute === 'red') {
      state.attributes.popularity.red += value
    } else if (attribute === 'black') {
      state.attributes.popularity.black += value

    } else if (attribute === 'gaming' || attribute === 'freestyle') {
      const skill = attribute;

      const currentLevel = SkillLevelMapping.find(level => level.level === state.attributes.skill[`${skill}Level`]);
      const currentLevelMax = currentLevel ? currentLevel.max : 0;
      state.attributes.skill[skill] = Math.min(state.attributes.skill[skill] + value, currentLevelMax);

    } else if (attribute === 'fightLevel') {
      const currentLevel = state.attributes.fight.level;
      const currentLevelMax = 81;
      state.attributes.fight.level = Math.min(currentLevel + value, currentLevelMax);
    }
    else {
      (state.attributes[attribute] as number) += value
      
      if (attribute === 'energy') {
        if (state.attributes.energy > state.attributes.maxEnergy) {
          state.attributes.energy = state.attributes.maxEnergy
        }

        if (state.attributes.energy < 0 && !state.weak) {
          state.weak = true
          // if (!state.weak) {
            
          //   await store.dispatch('typeWriter', '体力<0，姜云升进入了虚弱状态。')
          // } else {
          //   await store.dispatch('typeWriter', '体力<0，姜云升正处于虚弱状态。')
          // }
          
        } else if (state.attributes.energy >= 0 && state.weak) {
          state.weak = false
          // await store.dispatch('typeWriter', '体力>0，姜云升从虚弱状态恢复啦。')
        }

      }
    }
  },

  addSleepHours(state: State, payload: number) {
    state.sleepHours += payload
  },

  upgradeSkillLevel(state: State, skill: 'gaming' | 'freestyle') {
    if ( skill === 'gaming' || skill === 'freestyle' ) {
      state.attributes.skill[skill] ++;
      for (const level of SkillLevelMapping) {
        if (state.attributes.skill[skill] >= level.min && state.attributes.skill[skill] <= level.max) {
          state.attributes.skill[`${skill}Level`] = level.level;
          break;
        }
      }
    }
  },
  
  setWeak(state: State, payload: boolean) {
    state.weak = payload
  },

  updateDrunk(state: State, payload: number) {
    state.drunk += payload
  },

  setGirlfriend(state: State, payload: { type: string; effect: keyof Attributes; breakupReasons: string[] } | null) {
    state.girlfriend = payload
    if (payload === null) {
      state.breakupTimes++
      state.lastBreakupRound = state.round
    }
  },
  incrementFlirtCount(state: State) {
    state.flirtCount += 1
  },
  resetFlirtCount(state: State) {
    state.flirtCount = 0
  },
  resetRelationRound(state: State) {
    state.relationRound = 0
  },
  setSeamlessRelation(state: State, payload: boolean) {
    state.seamlessRelation = payload
  },
  incrementAccompanyCount(state: State) {
    state.accompanyCount++
  },
  resetAccompanyCount(state: State) {
    state.accompanyCount = 0
  },
  incrementUndergroundCount(state: State) {
    state.undergroundCount ++
  },
  incrementTourCount(state: State, index: number) {
    state.tourCount[index] ++
  },
  updateBattleResult(state: State, payload: { year: number; result: "落选" | "海选" | "八强" | "冠军" }) { 
    const { year, result } = payload
    const index = state.battleResults.findIndex(battleResult => battleResult.year === year)
    if (index !== -1) {
      state.battleResults[index].result = result
    }
  },
  updateBattleEnd(state: State, payload: { year: number; end: boolean }) {
    const { year, end } = payload
    const index = state.battleResults.findIndex(battleResult => battleResult.year === year)
    if (index !== -1) {
      state.battleResults[index].end = end
    }
  },

  setSignedAgency(state: State, payload: boolean) {
    state.signedAgency = payload
    if (payload) {
      state.signedAgencyRound = state.round
    }
  },
  incrementGoToAgencyTimes(state: State) {
    state.goToAgencyTimes++
  },

  buyGold(state: State, payload: number) {
    state.attributes.gold += payload
    state.attributes.money -= 360 * payload
  },

  updateItem(state: State, payload: { itemName: string; quantity: number }) {
    const { itemName, quantity } = payload

    if (itemName === '麦克风大锤' || itemName === '恶魔「S」之链' || itemName === '反穿之甲' || itemName === '虚无之裤' || itemName === '黄色卡车' || itemName === '巴黎之靴') {
      if (state.inventory[itemName] && state.inventory[itemName].quantity > 0) {
        state.inventory[itemName].quantity = 1
      } else {
        state.inventory[itemName] = {
          quantity: 1,
          isFood: false,
        }
        state.lastSpecialItem = itemName
      }
    }

    if (state.inventory[itemName]) {
      
      state.inventory[itemName].quantity += quantity
    } else {
      state.inventory[itemName] = {
        quantity: quantity,
        isFood: false,
      }
    }
  },

  packFood(state: State, { food, quantity }: { food: string, quantity: number }) {
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
      state.inventory[itemName].quantity -= quantity
      if (state.inventory[itemName].quantity <= 0) {
        delete state.inventory[itemName];
      }
    }
  },

  addHappenedEvent(state: State, event: string) {
    state.happenedEvents.push(event);
  },

  unlockSong(state: State, songTitle: string) {
    if (state.songStages[songTitle]) {
      state.songStages[songTitle].unlocked = true;
    } else {
      state.songStages[songTitle] = {
        completedStage: null,
        unlocked: true
      };
    }
  },

  setSongStages(state: State, songStages: { songTitle: string; stage: string }) {
    if (state.songStages[songStages.songTitle]) {
      state.songStages[songStages.songTitle].completedStage = songStages.stage;
    } else {
      state.songStages[songStages.songTitle] = {
        completedStage: songStages.stage,
        unlocked: true
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

  unlockAchievement(state: State, achievementName: string) {
    const achievement = state.achievements.find(
      (ach) => ach.name === achievementName
    )
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockTerm = state.term;
    }
  },

  unlockAchievementCondition(state: State, achievementName: string) {
    if (state.unlockedAchievementConditions.length >= state.term - 1) {
      return;
    }
    state.unlockedAchievementConditions.push(achievementName);
  },

  addTextToHistory(state: State, message: string | string[]) {
    if (typeof message === 'string') {
      state.textHistory.push(message);
    } else {
      message.forEach((m) => state.textHistory.push(m));
    }
  },

  setGameEnded(state: State, payload: { gameEnded: boolean; specialEndingAchievementName: string | string[] }) {
    
    if (typeof payload.specialEndingAchievementName === 'string') {
      if (!payload.gameEnded) state.currentEndings.push(payload.specialEndingAchievementName)
      store.commit('unlockAchievement', payload.specialEndingAchievementName)
      const specialEndingAchievement = state.achievements.find(
        (ach) => ach.name === payload.specialEndingAchievementName
      )
      state.specialEndingAchievement = specialEndingAchievement || null
    } else {
      state.specialEndingAchievement = null
    }

    state.gameEnded = payload.gameEnded
    showGameEndDialog.value = true

  },

  resetGameState(state: State, resetData: boolean) {
    state.term ++
    state.round = 1
    state.gameEnded = false
    state.currentEndings = []
    state.specialEndingAchievement = null
    state.happenedEvents = []
    state.textHistory = []

    state.weak = false
    state.drunk = 0
    state.sleepHours = 0

    state.girlfriend = null
    state.flirtCount = 0

    state.accompanyCount = 0
    state.relationRound = 0
    state.lastBreakupRound = 0

    if (state.undergroundCount > 2) state.undergroundCount = 2
    state.battleResults = battleResults

    state.signedAgency = false
    state.signedAgencyRound = null

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
          gamingLevel: 'D',
          freestyleLevel: 'D'
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
        superstition: 0
      }

      state.inventory = {}
      state.lastSpecialItem = null
      state.songStages = {}
      state.unlockedFeiSongs = []
      state.unlockedVitamins = []
      state.unlockedFoods = []

    } else {
      state.attributes.talent = Math.floor(state.attributes.talent * 0.2)
      state.attributes.charm = Math.floor(state.attributes.charm * 0.2)
      state.attributes.divine = Math.floor(state.attributes.divine * 0.2)
      state.attributes.popularity.red = Math.floor(state.attributes.popularity.red * 0.2)
      state.attributes.popularity.black = Math.floor(state.attributes.popularity.black * 0.2)
      state.attributes.money = Math.floor(state.attributes.money * 0.2)
      state.attributes.maxEnergy = Math.floor((state.attributes.maxEnergy - 100) * 0.2 + 100)
      state.attributes.energy = state.attributes.maxEnergy
      state.attributes.mood = 0
    }
  },

}

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
  typeWriterPopup,
  upgradeSkill,

  async incrementRound(context: { commit: Commit; state: State; dispatch: Function }) {
    context.commit('incrementRound');

    if (state.drunk > 0) {
      store.commit('updateDrunk', -1);
      if (state.drunk === 0) {
        await new Promise(resolve => setTimeout(resolve, 600));
        await context.dispatch('typeWriter', '姜云升的酒醒了。');
      }
    }

    if ( state.relationRound > 15) {
      if (Math.random() < 0.52) {
        showBreakupDialog.value = true
      }
    }

    if ( state.signedAgency && !Math.floor(state.round % 9) ) {
      store.commit('updateAttribute', { attribute: "money", value: 500 * 3 * 5 })
      context.dispatch('typeWriter', '姜云升签约了公司，到账工资1500元。');
    }

    await new Promise(resolve => setTimeout(resolve, 600));

    if ( !Math.floor((state.round - 16) % 36) ) {
      context.dispatch('specialEvent', '生日快乐');
    }

    // 第三年2月的时候，触发继承家业任务
    if (state.round === 3 * 36 + 4) {
      context.dispatch('specialEvent', '继承家业');
    }

    if ( !Math.floor((state.round - 25) % 36) ) {
      await context.dispatch('typeWriter', '今年的Battle比赛已经开放，可以在外出时报名参加比赛了。');
    }

    if (state.round === 10 * 36 ) {
      context.dispatch('specialEvent', '十年');
    }

    if ((state.attributes.popularity.red + state.attributes.popularity.black) > 1200 && state.attributes.popularity.black > 1000) {
      if (!state.achievements.find((ach) => ach.name === '我所拥有的人气，又是不是真的？' && ach.unlocked === true)) {
        context.commit('unlockAchievement', '我所拥有的人气，又是不是真的？');
        context.dispatch('typeWriter', '人气>1200，黑人气>1000。解锁成就【我所拥有的人气，又是不是真的？】')
      }
    }

    if ( !state.currentEndings.includes('汤臣亿品') && state.attributes.money >= 100000000) {
      context.commit('setGameEnded', { gameEnded: false, specialEndingAchievementName: '汤臣亿品' });
      return
    }

    if (!state.currentEndings.includes('刀削面子') && state.girlfriend && state.breakupTimes >= 11 && state.songStages['浪漫主义'].completedStage && state.songStages['浪漫主义2.0'].completedStage) {
      context.commit('setGameEnded', { gameEnded: false, specialEndingAchievementName: '刀削面子' });
      return
    }

    if (!state.currentEndings.includes('皮卡皮卡') && state.inventory['皮卡丘玩偶'] && state.inventory['皮卡丘玩偶'].quantity >= 521 && state.songStages['皮卡丘'].completedStage && !state.songStages['3'].completedStage) {
      context.commit('setGameEnded', { gameEnded: false, specialEndingAchievementName: '皮卡皮卡' });
      return
    }


    if (state.round > state.totalRounds) {
      if (state.currentEndings.length > 0) {
        context.commit('setGameEnded', { gameEnded: true, specialEndingAchievementName: state.currentEndings });
      } else {
        
        if (state.attributes.money <= 99999) {
          context.commit('setGameEnded', { gameEnded: true, specialEndingAchievementName: '一肩明月，两袖清风' });
          return;

        } else {
          context.commit('setGameEnded', { gameEnded: true, specialEndingAchievementName: '无法定义的结局' });
          return;
        }

      }
    }

    if (state.attributes.energy <= -100) {
      context.commit('setGameEnded', { gameEnded: true, specialEndingAchievementName: '姜云升虚弱' });
      return;
    }

    if (state.attributes.mood <= -100) {
      context.commit('setGameEnded', { gameEnded: true, specialEndingAchievementName: '我不做人啦' });
      return;
    }

  },

}

const getters = {
  currentYear(state: State) {
    return state.year
  },
  currentRound(state: State) {
    return state.round
  },
  totalRounds(state: State) {
    return state.totalRounds
  },
  attributes(state: State) {
    return state.attributes
  },
  achievements(state: State) {
    return state.achievements
  },
}

export const store: Store<State> = createStore({
  state,
  mutations,
  actions,
  getters,
})

export default store
