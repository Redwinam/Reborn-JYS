import { ref } from 'vue';
import { Commit } from 'vuex';
import { store } from '../index';
import { attributeNames } from '../attributes'

import { isAtHome, isGoingOut, showBreakupDialog, showSongWritingDialog } from '../../components/composables/gameRefs';

export async function accompanyGirlfriend(context: { commit: Commit, dispatch: Function }) {
  if (store.state.girlfriend) {
      
    if (store.state.accompanyCount < 8) {
      const energy = store.state.attributes.energy

      const girlfriendType = store.state.girlfriend.type
      const girlfriendEffect = store.state.girlfriend.effect

      const toMessage = ref([] as string[])

      if (store.state.weak) {
        toMessage.value.push(`姜云升处于虚弱状态，无法陪女朋友。`)
        await context.dispatch('typeWriter', toMessage.value);
        return
      }

      console.log(store.state.accompanyCount)

      if (store.state.accompanyCount < 1) {
        store.commit('updateAttribute', { attribute: 'energy', value: - 50 })
        store.commit('incrementAccompanyCount')
        toMessage.value.push(`姜云升${isAtHome?'在家':''}陪了${girlfriendType}，消耗了50点体力。`)
        
        store.commit('setWeak', true)
        toMessage.value.push('姜云升已进入虚弱状态。')

        store.commit('updateAttribute', { attribute: girlfriendEffect, value: Math.floor(Math.random() * 11) })
        toMessage.value.push(`姜云升的${attributeNames[girlfriendEffect]}属性上升了。`)

        await context.dispatch('typeWriter', toMessage.value);

      } else {
        
        if (energy >= 50) {
          store.commit('updateAttribute', { attribute: 'energy', value: - 50 })
          store.commit('incrementAccompanyCount')
          
          toMessage.value.push(`姜云升${isAtHome?'在家':''}陪了${girlfriendType}，消耗了50点体力。`)
          
          store.commit('updateAttribute', { attribute: girlfriendEffect, value: Math.floor(Math.random() * 11) })
          toMessage.value.push(`姜云升的${attributeNames[girlfriendEffect]}属性上升了。`)

          await context.dispatch('typeWriter', toMessage.value);

          if (isAtHome) {
            context.dispatch('specialEvent', '【姜哥，玩挺好】')
          }
          

        } else if (energy >= 20) {
          store.commit('updateAttribute', { attribute: 'energy', value: -20 })
          store.commit('incrementAccompanyCount')
          toMessage.value.push(`姜云升${isAtHome?'在家':''}陪了${girlfriendType}，消耗了20点体力。`)

          store.commit('updateAttribute', { attribute: girlfriendEffect, value: Math.floor(Math.random() * 6) })
          toMessage.value.push(`姜云升的${attributeNames[girlfriendEffect]}属性上升了。`)

          await context.dispatch('typeWriter', toMessage.value);

        } else {
          toMessage.value.push(`姜云升体力不足，无法陪女朋友。`)
          await context.dispatch('typeWriter', toMessage.value);
          return
        }
      }

    } else {
      showBreakupDialog.value = true
    }
    
  } else {
    await context.dispatch('typeWriter', ['姜云升没有女朋友，无法陪女朋友。'])
  }
}