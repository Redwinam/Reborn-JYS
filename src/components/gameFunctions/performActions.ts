import { ref } from 'vue'
import { useStore } from 'vuex'
import { mapActions } from 'vuex';

import { isAtHome, isGoingOut, showBreakupDialog, showSongWritingDialog } from '../composables/gameRefs';

const store = useStore()
mapActions(['performAction', 'typeWriter'])

const typewriter = (message: string | string[]) => {
  store.dispatch('typeWriter', message)
}

export function performAction(action: string) {
  if (action === '外出') {
    if (store.state.attributes.energy >= 0) {
      isGoingOut.value = true
      typewriter('打算出发去……')
    } else {
      typewriter('体力小于零，无法外出。')
    }
  } else {
    store.dispatch('performAction', { action })
    store.commit('updateAttribute', { attribute: 'energy', value: -10 })
    store.commit('incrementRound') // 增加这一行来使轮次+1

    switch (action) {
      case '上课':
        store.commit('updateAttribute', { attribute: 'talent', value: 1 })
        typewriter('姜云升参加了一堂课，才华+1。')
        break
      case '赚钱':
        store.commit('updateAttribute', { attribute: 'money', value: 100 })
        typewriter('姜云升努力工作，赚到了100金钱。')
        break
        
      case '出去鬼混':
        if (!store.state.girlfriend) {
          store.commit('updateAttribute', { attribute: 'charm', value: 1 })
          const toMessage = ref([] as string[])
          if (store.state.flirtCount) {
            toMessage.value.push('姜云升又成功地搭讪了一个姑娘，魅力+1。')
          } else {
            toMessage.value.push('姜云升成功地搭讪了一个姑娘，魅力+1。')
          }

          store.commit('incrementFlirtCount')
          if (store.state.flirtCount >= 3) {
            const randomGirlfriend = store.state.girlfriendTypes[Math.floor(Math.random() * store.state.girlfriendTypes.length)]
            store.commit('setGirlfriend', randomGirlfriend)
            store.commit('resetFlirtCount')

            toMessage.value.push(`恭喜！姜云升交到了一个${randomGirlfriend.type}。`)
          }

          typewriter(toMessage.value)
        } else {
          typewriter('姜云升已经有女朋友了，不能再出来鬼混把妹了。快去陪陪你的女朋友吧！')
        }
        break

      case '回家':
        isAtHome.value = true
        typewriter('姜云升回到了家。')
        break
      case '睡觉休息':
        if (store.state.weak) {
          store.commit('updateAttribute', { attribute: 'energy', value: 60 - store.state.attributes.energy })
          typewriter(['姜云升睡了17个小时，体力+60。', '姜云升不虚弱啦！'])
        } else {
          store.commit('updateAttribute', { attribute: 'energy', value: 60 })
          typewriter('姜云升睡了17个小时，体力+60。')
        }
        
        break
      case '写歌':
        showSongWritingDialog.value = true
        break
    }
  }

  if (store.state.attributes.energy <= -100) {
    store.commit('setGameEnded', { gameEnded: true, specialEndingAchievementId: 'jiangyunsheng-weak' })
    store.commit('unlockAchievement', 'jiangyunsheng-weak')
  }
} 