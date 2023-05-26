import { createStore, Store, Commit } from 'vuex'

import { Food, eatFood, packFood, eatPackedFood, drinkDrink } from './eats'
import { achievements, Achievement } from '../store/achievements'
import { songLibrary, Song, SongFei } from '../store/songs'

import { Attributes, Popularity, Skill } from '../store/attributes'

import { accompanyGirlfriend } from './actions/accompanyGirlfriend';
import { goToLocation } from './actions/goToLocation';
import { specialEvent, specialEventOptionChosen } from './actions/specialEvent';
import { performAction } from './actions/performActions';
import { purchaseItem, Inventory } from './actions/purchaseItem';
import { upgradeSkill, SkillLevelMapping } from './actions/upgradeSkill';
import { typeWriter, typeWriterPopup } from './actions/typeWriter';

import { showBreakupDialog } from '../components/composables/gameRefs';

interface State {
  term: number
  year: number
  round: number
  totalRounds: number
  attributes: Attributes
  weak: boolean
  drunk: number
  girlfriend: { type: string; effect: keyof Attributes; breakupReasons: string[] } | null
  girlfriendTypes: { type: string; effect: keyof Attributes; breakupReasons: string[] }[]
  flirtCount: number
  accompanyCount: number
  relationRound: number

  unlockedFoods: Food[]
  inventory: Inventory

  achievements: Achievement[]

  undergroundCount: number

  songs: string[]
  songLibrary: Song[]
  songStages: Record<string, { completedStage: string | null, unlocked: boolean }>
  unlockedFeiSongs: SongFei[]

  specialEvents: string[]
  specialEventDetails: { name: string, intro: string, options: string[] } | null

  gameEnded: boolean
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
  },
  weak: false,
  drunk: 0,
  flirtCount: 0,
  girlfriend: null,
  girlfriendTypes: [
    { 
      type: '有才华的女朋友', effect: 'talent', 
      breakupReasons: ['她觉得你愚钝', '她觉得你看着有点傻', '她觉得你太有才华了自己配不上'],
    },
    { 
      type: '长得超级好看的女朋友', effect: 'charm',
      breakupReasons: ['她觉得你们不合适', '她觉得你太帅了自己配不上', '想起了她的前男友'],
    },
    { 
      type: '让你牵肠挂肚的女朋友', effect: 'mood',
      breakupReasons: ['你两个小时没回她微信', '你一天没回她微信', '你一周没回她微信', '你一月没回她微信', '你一年没回她微信'],
    },
    { 
      type: '身材火辣的女朋友', effect: 'energy',
      breakupReasons: ['最近体力有些跟不上', '最近想换换口味', '最近想换个人试试', '腻了'],
    },
    { 
      type: '会理财的女朋友', effect: 'money',
      breakupReasons: ['你父母给了她500万让她离开你', '你父母给了她1000万让她离开你', '你父母给了她2000万让她离开你', '你父母给了她5000万让她离开你', '你父母给了她一个亿让她离开你'],
    },
  ],
  accompanyCount: 0,
  relationRound: 0,

  unlockedFoods: [],
  inventory: {},

  achievements: achievements,

  undergroundCount: 0,
  
  songs: [],
  songLibrary,
  songStages: {},
  unlockedFeiSongs: [],

  specialEvents: [],
  specialEventDetails: null,

  gameEnded: false,
  specialEndingAchievement: null,

  textHistory: [],

}

type UpdateAttributePayload = {
  attribute: keyof Attributes | "red" | "black" | "gaming" | "freestyle"
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

    if (attribute === 'popularity') {
      console.error('Cannot update popularity directly, update red or black instead')
    } else if (attribute === 'red') {
      state.attributes.popularity.red += value
    } else if (attribute === 'black') {
      state.attributes.popularity.black += value
    } else if (attribute === 'gaming' || attribute === 'freestyle') {
      const skill = attribute;

      const currentLevel = SkillLevelMapping.find(level => level.level === state.attributes.skill[`${skill}Level`]);
      const currentLevelMax = currentLevel ? currentLevel.max : 0;
      state.attributes.skill[skill] = Math.min(state.attributes.skill[skill] + value, currentLevelMax);
    } else {
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

  upgradeSkillLevel(state: State, { skill }: { skill: keyof Skill }) {
    if ( skill === 'gaming' || skill === 'freestyle' ) {
      state.attributes.skill[skill] = (state.attributes.skill[skill] as number) + 1;
      for (const level of SkillLevelMapping) {
        if (state.attributes.skill.gaming >= level.min && state.attributes.skill.gaming <= level.max) {
          state.attributes.skill.gamingLevel = level.level;
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
  incrementAccompanyCount(state: State) {
    state.accompanyCount++
  },
  resetAccompanyCount(state: State) {
    state.accompanyCount = 0
  },
  incrementUndergroundCount(state: State) {
    state.undergroundCount++
  },

  buyGold(state: State, payload: number) {
    state.attributes.gold += payload
    state.attributes.money -= 360 * payload
  },

  purchaseItem(state: State, payload: { itemName: string; quantity: number }) {
    const { itemName, quantity } = payload
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

  setSpecialEventDetails(state: State, specialEventDetails: { name: string; intro: string; options: string[]; }) {
    state.specialEventDetails = specialEventDetails;
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

  unlockFood(state: State, food: Food) {
    state.unlockedFoods.push(food);
    state.attributes.maxEnergy += Math.ceil(food.energy / 10);
  },

  unlockAchievement(state: State, achievementName: string) {
    const achievement = state.achievements.find(
      (ach) => ach.name === achievementName
    )
    if (achievement) {
      achievement.unlocked = true;
      achievement.unlockTerm = state.term;
    }
  },
  addTextToHistory(state: State, message: string | string[]) {
    if (typeof message === 'string') {
      state.textHistory.push(message);
    } else {
      message.forEach((m) => state.textHistory.push(m));
    }
  },

  setGameEnded(state: State, payload: { gameEnded: boolean; specialEndingAchievementName: string }) {
    state.gameEnded = payload.gameEnded
    const specialEndingAchievement = state.achievements.find(
      (ach) => ach.name === payload.specialEndingAchievementName && ach.ending
    )
    state.specialEndingAchievement = specialEndingAchievement || null
  },

  resetGameState(state: State) {
    state.term ++
    state.round = 1
    state.gameEnded = false

    state.weak = false
    state.drunk = 0
    state.specialEndingAchievement = null
    state.girlfriend = null
    state.flirtCount = 0
    state.accompanyCount = 0
    state.relationRound = 0
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
    }
    state.undergroundCount = 0
    state.specialEvents = []
    state.specialEventDetails = null
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
    if ( !Math.floor((store.state.round - 16) % 36) ) {
      context.dispatch('specialEvent', '生日快乐');
    }

    // 第三年2月的时候，触发继承家业任务
    if (store.state.round === 3 * 36 + 2) {
      context.dispatch('specialEvent', '继承家业');
    }


    if ((store.state.attributes.popularity.red + store.state.attributes.popularity.black) > 1200 && store.state.attributes.popularity.black > 1000) {
      if (!store.state.achievements.find((ach) => ach.name === '我所拥有的人气，又是不是真的？' && ach.unlocked === true)) {
        context.commit('unlockAchievement', '我所拥有的人气，又是不是真的？');
        context.dispatch('typeWriter', '人气>1200，黑人气>1000。解锁成就【我所拥有的人气，又是不是真的？】')
      }
    }











    if (state.round > state.totalRounds) {
      context.commit('setGameEnded', { gameEnded: true, specialEndingAchievementName: '无法定义的结局' });
      context.commit('unlockAchievement', '无法定义的结局');
    }

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
