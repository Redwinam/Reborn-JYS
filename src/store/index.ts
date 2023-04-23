import { createStore, Store, Commit } from 'vuex'
import TypeIt from 'typeit';

import { achievementLibrary, AchievementLibrary } from '../store/achievements'
import { songLibrary, Song } from '../store/songs'

import { Attributes, Popularity } from '../store/attributes'


interface State {
  year: number
  round: number
  totalRounds: number
  attributes: Attributes
  weak: boolean
  girlfriend: string | null
  girlfriendTypes: { type: string; effect: keyof Attributes; breakupReasons: string[] }[]
  flirtCount: number
  accompanyCount: number

  achievements: { name: string; desc: string }[]
  achievementLibrary: AchievementLibrary[]

  songs: string[]
  songLibrary: Song[]

  specialEvents: string[]

  gameEnded: boolean
  specialEndingAchievement: { name: string; desc: string } | null

  textHistory: string[]
}

const state: State = {
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
    skill: {
      freestyle: 0,
      gaming: 0,
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

  achievements: [],
  achievementLibrary,
  
  songs: [],
  songLibrary,

  specialEvents: [],

  gameEnded: false,
  specialEndingAchievement: null,

  textHistory: [],
}

type UpdateAttributePayload = {
  attribute: keyof Attributes
  value: number
}

const mutations = {
  incrementRound(state: State) {
    state.round++
    if (state.round > state.totalRounds) {
      state.year++
      state.round = 1
    }
  },
  // ...其他mutations保持不变
  updateAttribute(state: State, payload: UpdateAttributePayload) {
    const { attribute, value } = payload
    if (attribute === 'popularity') {
      console.error('Cannot update popularity directly, update red or black instead')
    } else {
      (state.attributes[attribute] as number) += value
      
      if (attribute === 'energy') {
        if (state.attributes.energy > state.attributes.maxEnergy) {
          state.attributes.energy = state.attributes.maxEnergy
        }

        if (state.attributes.energy < 0 && !state.weak) {
          state.weak = true
          // if (!state.weak) {
            
          //   // store.dispatch('typeWriterBreak', '体力<0，姜云升进入了虚弱状态。')
          // } else {
          //   // store.dispatch('typeWriterBreak', '体力<0，姜云升正处于虚弱状态。')
          // }
          
        } else if (state.attributes.energy >= 0 && state.weak) {
          state.weak = false
          // store.dispatch('typeWriterBreak', '体力>0，姜云升从虚弱状态恢复啦。')
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
  setGirlfriend(state: State, payload: string | null) {
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

  unlockAchievement(state: State, achievementId: string) {
    const achievement = state.achievementLibrary.find(
      (ach) => ach.id === achievementId
    )
    if (achievement) {
      state.achievements.push(achievement)
    }
  },

  setGameEnded(state: State, payload: { gameEnded: boolean; specialEndingAchievementId: string }) {
    state.gameEnded = payload.gameEnded
    const specialEndingAchievement = state.achievementLibrary.find(
      (ach) => ach.id === payload.specialEndingAchievementId && ach.ending
    )
    state.specialEndingAchievement = specialEndingAchievement || null
  },

  resetGameState(state: State) {
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
      skill: {
        freestyle: 0,
        gaming: 0,
      },
      energy: 100,
      maxEnergy: 100,
      mood: 0,
    }
    state.specialEvents = []
  },

}

const actions = {
  performAction(context: { commit: Commit }, payload: any) {
    // 在这里根据用户选择的行为，执行相应操作
    // 例如：修改数值、解锁成就、触发事件等
  },
  typeWriter (context: { commit: Commit }, message: string | string[]) {
    new TypeIt('#textboxText', {
      strings: message,
      speed: 25,
      loop: false,
      cursorSpeed: 1000,
      cursorChar: '▐',
      deleteSpeed: 0,
      startDelete: true,
      startDelay: 0,
      breakLines: true,
      afterComplete: (instance: { options: { cursor: boolean; }; destroy: () => void; }) => {
        instance.options.cursor = false;
        instance.destroy();
      },
    }).go();
    
    if (typeof message === 'string') {
      store.state.textHistory.push(message)
    } else {
      message.forEach((m) => store.state.textHistory.push(m))
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

const store: Store<State> = createStore({
  state,
  mutations,
  actions,
  getters,
})

export default store
