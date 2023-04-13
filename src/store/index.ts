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
  flirtCount: number
  achievements: string[]
  songs: string[]
  specialEvents: string[]
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
    { type: '有才华的女朋友', effect: 'talent' },
    { type: '长得超级好看的女朋友', effect: 'charm' },
    { type: '让你伤心的女朋友', effect: 'mood' },
    { type: '身材火辣的女朋友', effect: 'energy' },
    { type: '会理财的女朋友', effect: 'money' },
  ],


  achievements: [],
  songs: [],
  specialEvents: [],
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
  unlockAchievement(state: State, achievement: string) {
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
