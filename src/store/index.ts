import { createStore, Store, Commit } from 'vuex'

interface Skill {
  freestyle: number
  gaming: number
}

interface Popularity {
  red: number
  black: number
}

interface Attributes {
  divine: number
  talent: number
  charm: number
  popularity: Popularity
  money: number
  skill: Skill
  energy: number
  mood: number
}

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
  songs: string[]
  specialEvents: string[]

  gameEnded: boolean
  specialEndingAchievement: string
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
      breakupReasons: ['你父母给了她500万让她离开你', '你父母给了她1000万让她离开你', '你父母给了她2000万让她离开你', '你父母给了她5000万让她离开你', '你父母给了她10000万让她离开你'],
    },
  ],
  accompanyCount: 0,

  achievements: [],
  songs: [],
  specialEvents: [],

  gameEnded: false,
  specialEndingAchievement: '',
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
    }
  },
  updatePopularity(state: State, payload: { type: keyof Popularity; value: number }) {
    state.attributes.popularity[payload.type] += payload.value
  },
  unlockAchievement(state: State, achievement: { name: string; desc: string }) {
    state.achievements.push(achievement)
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

  setGameEnded(state: State, payload: { gameEnded: boolean; specialEndingAchievement: string }) {
    state.gameEnded = payload.gameEnded
    state.specialEndingAchievement = payload.specialEndingAchievement
  },

  resetGameState(state: State) {
    state.round = 1
    state.gameEnded = false
    state.specialEndingAchievement = ''
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
      mood: 0,
    }
    state.achievements = []
    state.specialEvents = []
  },
}

const actions = {
  performAction(context: { commit: Commit }, payload: any) {
    // 在这里根据用户选择的行为，执行相应操作
    // 例如：修改数值、解锁成就、触发事件等
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
