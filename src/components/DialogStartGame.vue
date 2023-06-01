<template>
  <p class="desc" id="textboxPopup"></p>
  <div class="button-container">
    <button v-if="showStartButton" @click="startGame()">开始游戏</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

import { showStartGameDialog } from '../components/composables/gameRefs'

const store = useStore()
const showStartButton = ref(false)
onMounted(async () => {
  if (document.getElementById('textboxPopup')) {
    await store.dispatch('typeWriterPopup', ['【系统】这是一个六月的夏天，你睁开了你的大眼睛，你惊呆了！因为你重生了……', '【系统】你重生成了姜云升！', '【系统】你决定——'])
    await new Promise(resolve => setTimeout(resolve, 200))
    showStartButton.value = true
  }
});

const startGame = async () => {
  showStartGameDialog.value = false
  await store.dispatch('typeWriter', '【系统】你选择了开始游戏！')
  await new Promise(resolve => setTimeout(resolve, 200))
  await store.dispatch('typeWriter', '【系统】你哭得很大声！')
  await new Promise(resolve => setTimeout(resolve, 200))
  await store.dispatch('typeWriter', '【系统】你哭你的懵懂出生，你哭你的前途未卜，这一世，你要卷土重来，你获得了初始属性：【虚弱】')
  await new Promise(resolve => setTimeout(resolve, 1000))
  await store.dispatch('typeWriter', '【系统】你哭得更大声了！')
  await new Promise(resolve => setTimeout(resolve, 200))
  await store.dispatch('typeWriter', '【系统】终于到了15岁，你长成了风一样的少年，这一天，你决定去——')
}

</script>

<style scoped>
.button-container {
  margin: 0.25rem auto;
  gap: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-container button {
  padding: 0.4rem 1rem;
  border: 2px solid #1e2228;
  background-color: #9d4842;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}
</style>
