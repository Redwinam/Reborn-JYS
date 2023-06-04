<template>
<p id="textboxEvent">{{ unsignAgencyText }}</p>
<div class="event-dialog__options">
  <button v-for="unsignAgencyOption in unsignAgencyOptions" @click="handleUnsignAgency(unsignAgencyOption)">{{unsignAgencyOption}}</button>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'

import { showUnsignAgencyDialog } from '../components/composables/gameRefs'

const store = useStore()

const unsignAgencyText = ref("姜云升现在可以申请和现在公司解约了，你选择？")
const unsignAgencyOptions = ref(["申请解约", "先不了……", "再签一年！"])

const handleUnsignAgency = async (unsignAgencyOption: string) => {
  if (unsignAgencyOption === "申请解约") {
    unsignAgencyText.value = "姜云升毅然决然地决定申请解约，可公司要求姜云升支付600万+36万元经济成本，以及在此期间内所有演艺事业成本的合计金额作为合同解约金，在解约金全部支付前无法解约，并要求你不再使用「姜云升」作为艺名，你选择？"
    unsignAgencyOptions.value = ["接受", "再签一年！","告他丫的！"]

  } else if (unsignAgencyOption === "先不了……") {
    showUnsignAgencyDialog.value = false
  } else if (unsignAgencyOption === "再签一年！") {
    store.commit('setSignedAgency', true)
    showUnsignAgencyDialog.value = false
    store.dispatch('typeWriter', '想法很怪，但姜云升和原公司续约成功！')
  } else if (unsignAgencyOption === "接受") {
    showUnsignAgencyDialog.value = false
    await store.dispatch('typeWriter', '姜云升选择接受公司的要求。')
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 支付违约金
    store.commit('updateAttribute', { attribute: 'money', value: -6000000 })
    await store.dispatch('typeWriter', '姜云升支付了600万违约金。')
    await new Promise(resolve => setTimeout(resolve, 1000))
    store.commit('updateAttribute', { attribute: 'money', value: -360000 })
    await store.dispatch('typeWriter', '姜云升支付了36万元经济成本。')
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 如果当前money<0
    if (store.state.money > 0) {
      store.commit('updateAttribute', { attribute: 'money', value: -store.state.money })
      await store.dispatch('typeWriter', `姜云升支付了所有的金钱${store.state.money}元演艺事业成本作为合同解约金。`)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } else {
      await store.dispatch('typeWriter', `姜云升没能支付所有的解约金，公司没有同意解约。`)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    await store.dispatch('typeWriter', '姜云升从此不再使用「姜云升」作为艺名，《重生之我是姜云升》游戏也不再存在，游戏结束。')
    await new Promise(resolve => setTimeout(resolve, 1000))
    store.commit('setGameEnded', { gameEnded: true, specialEndingAchievementName: '被敲碎的小金猪' });

  } else if (unsignAgencyOption === "告他丫的！") {
    store.commit('setSignedAgency', false)
    showUnsignAgencyDialog.value = false

    store.commit('updateAttribute', { attribute: 'money', value: -6000000 })
    await store.dispatch('typeWriter', '姜云升支付了600万违约金。')
    await new Promise(resolve => setTimeout(resolve, 1000))
    store.commit('updateAttribute', { attribute: 'money', value: -360000 })
    await store.dispatch('typeWriter', '姜云升支付了36万元经济成本。')
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 解锁成就被敲碎的小金猪
    store.commit('unlockAchievement', '被敲碎的小金猪')
    await store.dispatch('typeWriter', '姜云升解锁了成就【被敲碎的小金猪】。')
    await new Promise(resolve => setTimeout(resolve, 1000))

    store.dispatch('typeWriter', '而对于其他要求，姜云升选择告他丫的！和原公司打官司。相信法律。')
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}
</script>

<style scoped>

#textboxEvent {
  font-size: 0.9rem;
  margin: 0.5rem 0;
  padding: 0.5rem;
  text-align: center;
}

.event-dialog__options {
  display: flex;
  justify-content: space-around;
  margin: 0.5rem 0;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.event-dialog__options button {
  padding: 0.5rem 1rem;
  background-color: #f3f3f3;
  color: #1e2228;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.event-dialog__options button:hover {
  background-color: #964742;
  outline:2px solid #1e2228;
  color: #fff;
}

</style>