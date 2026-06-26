import { ref } from 'vue';
import { Commit } from 'vuex';
import { store } from '../index';
import { attributeNames } from '../attributes'

import { isAtHome, showBreakupDialog } from '../../components/composables/gameRefs';

export async function accompanyGirlfriend(context: { commit: Commit, dispatch: Function ,getters: any}) {
  if (store.state.relationship.girlfriend) {
    const energy = store.state.character.attributes.energy

    const girlfriendType = store.state.relationship.girlfriend.type
    const girlfriendEffect = store.state.relationship.girlfriend.effect

    const toMessage = ref([] as string[])
    const isAchUnlocked_onesong = context.getters.unlockedAchievement('一首歌的时间');

    if (store.state.relationship.accompanyCount < 5) {

      if (store.state.character.weak) {
        toMessage.value.push(`姜云升处于虚弱状态，无法陪女朋友。`)
        await context.dispatch('typeWriter', toMessage.value);
        return
      }

      if (store.state.relationship.accompanyCount < 1) {
        
        if (store.state.character.drunk > 0 && !isAchUnlocked_onesong ) {
          context.commit('updateAttribute', { attribute: 'charm', value: -50 });
          context.commit('unlockAchievement', '一首歌的时间');
          await context.dispatch('typeWriter', ['她是你在酒吧认识的一位姑娘，昏暗的灯光下，一切都很好。你忘了你喝了酒，状态有些不好，一首歌的时间后……第二天她向你提出了分手。姜云升魅力-50，解锁了第' + context.getters.UnlockedAchievementCount + '个成就【一首歌的时间】']);
          store.commit('setGirlfriend', null)
          store.commit('relationship/resetAccompanyCount')
          store.commit('relationship/resetRelationRound');
          return;

        } else if (store.state.character.drunk > 0 && isAchUnlocked_onesong) {
          await context.dispatch('typeWriter', '姜云升今天喝醉了，状态不好！👋🏻');
          return;

        } else {
      
          store.commit('updateAttribute', { attribute: 'energy', value: - 50 })
          store.commit('relationship/incrementAccompanyCount')
          toMessage.value.push(`姜云升${isAtHome.value ? '在家' :''}陪了${girlfriendType}，消耗了50点体力。`)
          // store.commit('updateAttribute', { attribute: 'talent', value: 1 })
          // toMessage.value.push(`姜云升的才华属性上升了。`)
          store.commit('character/setWeak', true)
          toMessage.value.push('姜云升已进入虚弱状态。')

          store.commit('updateAttribute', { attribute: girlfriendEffect, value: Math.floor(Math.random() * 11) })
          toMessage.value.push(`姜云升的${attributeNames[girlfriendEffect]}属性上升了。`)

          await context.dispatch('typeWriter', toMessage.value);
          return
        }
      } 

    } else {
      if (Math.random() < 0.5) {
        showBreakupDialog.value = true
        return
      }
    }

    if (energy >= 50) {
      if (store.state.character.drunk > 0 && isAchUnlocked_onesong) {
        await context.dispatch('typeWriter', '姜云升今天喝醉了，状态不好！👋🏻');
        return;
      }
      store.commit('updateAttribute', { attribute: 'energy', value: - 50 })
      store.commit('relationship/incrementAccompanyCount')
      
      toMessage.value.push(`姜云升${isAtHome.value ? '在家' :''}陪了${girlfriendType}，消耗了50点体力。`)
      
      if (girlfriendEffect === 'money') {
        store.commit('updateAttribute', { attribute: girlfriendEffect, value: Math.floor(Math.random() * 360) })
      } else {
        store.commit('updateAttribute', { attribute: girlfriendEffect, value: Math.floor(Math.random() * 36) })
      }
      toMessage.value.push(`姜云升的${attributeNames[girlfriendEffect]}属性上升了。`)

      context.dispatch('typeWriter', toMessage.value);

      if (isAtHome.value) {
        const isAchUnlocked_playgood = context.getters.unlockedAchievement('姜哥，玩挺好')
        if (!isAchUnlocked_playgood && !store.state.progress.happenedEvents.includes('姜哥，玩挺好')) {
          if (Math.random() < 0.15 * store.state.relationship.relationRound) {
            context.dispatch('specialEvent', '姜哥，玩挺好');
          }
        }
      }
      

    } else if (energy >= 20) {
      if (store.state.character.drunk > 0 && isAchUnlocked_onesong) {
        await context.dispatch('typeWriter', '姜云升今天喝醉了，状态不好！👋🏻');
        return;
      }
      store.commit('updateAttribute', { attribute: 'energy', value: -20 })
      store.commit('relationship/incrementAccompanyCount')
      toMessage.value.push(`姜云升${isAtHome.value ? '在家' :''}陪了${girlfriendType}，消耗了20点体力。`)

      if (girlfriendEffect === 'money') {
        store.commit('updateAttribute', { attribute: girlfriendEffect, value: Math.floor(Math.random() * 180) })
      } else {
        store.commit('updateAttribute', { attribute: girlfriendEffect, value: Math.floor(Math.random() * 18) })
      }
      toMessage.value.push(`姜云升的${attributeNames[girlfriendEffect]}属性上升了。`)

      await context.dispatch('typeWriter', toMessage.value);

    } else {
      toMessage.value.push(`姜云升体力不足，无法陪女朋友。`)
      await context.dispatch('typeWriter', toMessage.value);
      return
    }
    
  } else {
    await context.dispatch('typeWriter', ['姜云升没有女朋友，无法陪女朋友。'])
  }
}