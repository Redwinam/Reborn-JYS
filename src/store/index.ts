import { createStore, Store, Commit } from 'vuex'

import { Food, selectFood } from '../store/foods'
import { achievements, Achievement } from '../store/achievements'
import { songLibrary, Song } from '../store/songs'

import { Attributes, Popularity } from '../store/attributes'

import { accompanyGirlfriend } from './actions/accompanyGirlfriend';
import { goToLocation } from './actions/goToLocation';
import { specialEvent, specialEventOptionChosen } from './actions/specialEvent';
import { performAction } from './actions/performActions';
import { typeWriter, typeWriterPopup } from './actions/typeWriter';

interface State {
  term: number
  year: number
  round: number
  totalRounds: number
  attributes: Attributes
  weak: boolean
  girlfriend: { type: string; effect: keyof Attributes; breakupReasons: string[] } | null
  girlfriendTypes: { type: string; effect: keyof Attributes; breakupReasons: string[] }[]
  flirtCount: number
  accompanyCount: number

  unlockedFoods: Food[]

  achievements: Achievement[]

  undergroundCount: number

  songs: string[]
  songLibrary: Song[]

  specialEvents: string[]
  specialEventDetails: { name: string, intro: string, options: string[] } | null

  gameEnded: boolean
  specialEndingAchievement: { name: string; desc: string } | null

  textHistory: string[]
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

  unlockedFoods: [],

  achievements: achievements,

  undergroundCount: 0,
  
  songs: [],
  songLibrary,

  specialEvents: [],
  specialEventDetails: null,

  gameEnded: false,
  specialEndingAchievement: null,

  textHistory: [],
}

type UpdateAttributePayload = {
  attribute: keyof Attributes | "red" | "black" | "gaming"
  // attribute: string
  value: number
}

const mutations = {
  incrementRound(state: State) {
    state.round++
    if (state.round % 36 === 0) {
      state.year++
    }
    state.attributes.money += Math.ceil(state.attributes.gold * 0.06 * 360);
  },
  async updateAttribute(state: State, payload: UpdateAttributePayload) {
    const { attribute, value } = payload
    if (attribute === 'popularity') {
      console.error('Cannot update popularity directly, update red or black instead')
    } else if (attribute === 'red') {
      state.attributes.popularity.red += value
      // if (state.attributes.popularity.red > 100) {
      //   state.attributes.popularity.red = 100
      // }
    } else if (attribute === 'black') {
      state.attributes.popularity.black += value
    } else if (attribute === 'gaming') {
      state.attributes.skill.gaming += value;

      if (state.attributes.skill.gaming > 28) {
        state.attributes.skill.gaming = 28;
      }

      const levelMapping = [
        { level: 'D', min: 0, max: 3 },
        { level: 'C', min: 4, max: 8 },
        { level: 'B', min: 9, max: 14 },
        { level: 'A', min: 15, max: 20 },
        { level: 'S', min: 21, max: 24 },
        { level: 'SS', min: 25, max: 27 },
        { level: 'SSS', min: 28, max: 28 },
      ];

      for (const level of levelMapping) {
        if (state.attributes.skill.gaming >= level.min && state.attributes.skill.gaming <= level.max) {
          state.attributes.skill.gamingLevel = level.level;
          break;
        }
      }
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
  updatePopularity(state: State, payload: { type: keyof Popularity; value: number }) {
    state.attributes.popularity[payload.type] += payload.value
  },

  
  setWeak(state: State, payload: boolean) {
    state.weak = payload
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

  setSpecialEventDetails(state: State, specialEventDetails: { name: string; intro: string; options: string[]; }) {
    state.specialEventDetails = specialEventDetails;
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
    state.specialEndingAchievement = null
    state.accompanyCount = 0
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
  selectFood,
  specialEvent,
  specialEventOptionChosen,
  typeWriter,
  typeWriterPopup,

  incrementRound(context: { commit: Commit; state: State; dispatch: Function }) {
    if ( !Math.floor((store.state.round - 16) % 36) ) {
      context.dispatch('specialEvent', '生日快乐');
    }



    if (state.round > state.totalRounds) {
      context.commit('setGameEnded', { gameEnded: true, specialEndingAchievementName: '无法定义的结局' });
      context.commit('unlockAchievement', '无法定义的结局');
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
