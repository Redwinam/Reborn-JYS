<template>

<transition name="fade">
    <div v-if="showDialog" class="popup-container">

      <div class="popup">
        <h2>女朋友想和你分手</h2>
        <p>{{ randomBreakupReason }}</p>
        <button @click="handleBreakup('挽回')">挽回</button>
        <button @click="handleBreakup('沉默')">沉默</button>
        <button @click="handleBreakup('拜拜就拜拜')">拜拜就拜拜</button>

      </div>
    </div>
  </transition>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const props = defineProps<{
  showDialog: boolean
}>()

const emit = defineEmits<{
  (event: 'closeDialog'): void
  (event: 'addTextBoxMessage', message: string): void
}>()

const closeDialog = () => {
  emit('closeDialog')
}

const addTextBoxMessage = (message: string) => {
  emit('addTextBoxMessage', message)
}

const randomBreakupReason = computed(() => {
  const currentGirlfriend = store.state.girlfriend
  if (!currentGirlfriend) {
    return ''
  }
  const reasonIndex = Math.floor(Math.random() * currentGirlfriend.breakupReasons.length)
  return `你的女朋友想和你分手，因为${currentGirlfriend.breakupReasons[reasonIndex]}。你选择？`
})

function handleBreakup(choice: string) {
  switch (choice) {
    case '挽回':
      if (Math.random() < 0.520) {
        store.commit('resetAccompanyCount')
        store.commit('updateAttribute', { attribute: 'charm', value: 5 })
        addTextBoxMessage('经过努力，你成功挽回了你们的感情。姜云升魅力+5！')
      } else {
        store.commit('setGirlfriend', null)
        store.commit('updateAttribute', { attribute: 'charm', value: -5 })
        addTextBoxMessage('尽管你努力挽回，但你们最终还是分手了。你的魅力-5！')
      }
      break
    case '沉默':
      // 添加随机选择是否挽回感情的逻辑
      if (Math.random() < 0.5) {
        store.commit('resetAccompanyCount')
        addTextBoxMessage('你的沉默让你们的感情得以修复。在命运的指引下，你没被甩。')
      } else {
        store.commit('setGirlfriend', null)
        addTextBoxMessage('你的沉默让你们之间的感情破裂。在命运的指引下，你被甩了。')
      }
      break
    case '拜拜就拜拜':
      store.commit('setGirlfriend', null)
      store.commit('resetAccompanyCount')
      addTextBoxMessage('你放手了，选择了拜拜就拜拜。你现在没有女朋友了。')
      break
  }
  closeDialog()
}

</script>

<style scoped>
.popup-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.popup {
  background-color: white;
  border-radius: 5px;
  padding: 20px;
  width: 80%;
  max-width: 500px;
  border: 1px solid black;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>