<template>

<h2>女朋友想和你分手</h2>
<p>{{ randomBreakupReason }}</p>
<div class="button-container">
  <button @click="handleBreakup('挽回')">挽回</button>
  <button @click="handleBreakup('沉默')">沉默</button>
  <button @click="handleBreakup('拜拜就拜拜')">拜拜就拜拜</button>
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

import { showBreakupDialog } from '../components/composables/gameRefs'
import { Achievement } from '../store/achievements'

const store = useStore()

const randomBreakupReason = computed(() => {
  const currentGirlfriend = store.state.girlfriend
  if (!currentGirlfriend) {
    return ''
  }
  const reasonIndex = Math.floor(Math.random() * currentGirlfriend.breakupReasons.length)
  return `你的女朋友想和你分手，因为${currentGirlfriend.breakupReasons[reasonIndex]}。你选择？`
})

async function handleBreakup(choice: string) {
  showBreakupDialog.value = false
  switch (choice) {
    case '挽回':
      if (Math.random() < 0.520) {
        store.commit('resetAccompanyCount');
        store.commit('resetRelationRound');
        store.commit('updateAttribute', { attribute: 'charm', value: 20 })
        await store.dispatch('typeWriter', '经过努力，你成功挽回了你们的感情。姜云升魅力+20！')
      } else {
        store.commit('setGirlfriend', null);
        store.commit('resetAccompanyCount');
        store.commit('resetRelationRound');
        store.commit('updateAttribute', { attribute: 'charm', value: -20 })
        await store.dispatch('typeWriter', '尽管你努力挽回，但姜云升最终还是被甩了。姜云升魅力-20。')

        if (store.state.breakupTimes >= 10) {
          const hasAchievement = store.state.achievements.find(
            (ach: Achievement) => ach.name === '拜拜就拜拜' && ach.unlocked
          );
          if (!hasAchievement) {
            store.commit('unlockAchievement', '拜拜就拜拜');
            await store.dispatch('typeWriter', ['姜云升累计被分手超过了10次，解锁了第' + store.state.achievements.filter((ach: { unlocked: any; }) => ach.unlocked).length + '个成就【拜拜就拜拜】！']);
          }
        }

      }
      break
      
    case '沉默':
      // 添加随机选择是否挽回感情的逻辑
      if (Math.random() < 0.5) {
        store.commit('resetAccompanyCount')
        store.commit('resetRelationRound');
        await store.dispatch('typeWriter', '你的沉默让你们的感情得以修复。在命运的指引下，你没被甩。')
      } else {
        store.commit('setGirlfriend', null)
        store.commit('resetAccompanyCount')
        store.commit('resetRelationRound');
        await store.dispatch('typeWriter', '你的沉默让你们之间的感情破裂。在命运的指引下，姜云升被甩了。')

        if (store.state.breakupTimes >= 10) {
          const hasAchievement = store.state.achievements.find(
            (ach: Achievement) => ach.name === '拜拜就拜拜' && ach.unlocked
          );
          if (!hasAchievement) {
            store.commit('unlockAchievement', '拜拜就拜拜');
            await store.dispatch('typeWriter', ['姜云升累计被分手超过了10次，解锁了第' + store.state.achievements.filter((ach: { unlocked: any; }) => ach.unlocked).length + '个成就【拜拜就拜拜】！']);
          }
        }

      }
      break

    case '拜拜就拜拜':
      store.commit('setGirlfriend', null)
      store.commit('resetAccompanyCount')
      store.commit('resetRelationRound');
      await store.dispatch('typeWriter', '你放手了，选择了拜拜就拜拜。你现在没有女朋友了。')

      if (store.state.breakupTimes >= 10) {
        const hasAchievement = store.state.achievements.find(
          (ach: Achievement) => ach.name === '拜拜就拜拜' && ach.unlocked
        );
        if (!hasAchievement) {
          store.commit('unlockAchievement', '拜拜就拜拜');
          await store.dispatch('typeWriter', ['姜云升累计被分手超过了10次，解锁了第' + store.state.achievements.filter((ach: { unlocked: any; }) => ach.unlocked).length + '个成就【拜拜就拜拜】！']);
        }
      }

      break
  }
}
</script>

<style scoped>

.button-container {
  display: flex;
  justify-content: center;
  margin: 0.5rem 0;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.button-container button {
  padding: 0.5rem 1rem;
  background-color: #f3f3f3;
  color: #1e2228;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

</style>