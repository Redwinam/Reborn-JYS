<template>
<div class="game-start-dialog">
  <img v-show="showStartButton" src="/mic.png" alt="mic" style="width: 6rem; margin: 0.5rem auto 0.25rem; display: block;">
  <p class="desc" id="textboxPopup"></p>
  <div class="button-container">
    <button v-if="showStartButton" @click="startGame()" class="start-game-button">开始游戏</button>
    <div class="quick-start-button-container">
      <button v-if="showStartButton" @click="quickStartGame()" class="quick-start-button">（跳过开始）</button>
    </div>
    <!-- 图片 @assets mic.png -->
  </div>
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
    await store.dispatch('typeWriterPopup', ['【系统】这是一个六月的夏天，你睁开了你的大眼睛🥺，你惊呆了！因为你重生了……', '【系统】你重生成了姜云升！', '【系统】你决定——'])
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
  await store.dispatch('typeWriter', '【系统】终于到了十五岁，你长成了风一样的少年，这一天，你决定去——')
}

const quickStartGame = async () => {
  showStartGameDialog.value = false
  await store.dispatch('typeWriter', '【系统】终于到了十五岁，你长成了风一样的少年，这一天，你决定去——')

}

</script>

<style scoped>


.game-start-dialog .desc {
  font-size: 0.9rem;
  margin: 1rem auto;
  width: 90%;
  color: #4c4d55;
}

.game-start-dialog button.start-game-button {
  padding: 0.4rem 1rem;
  border: 2px solid #1e2228;
  background-color: #9d4842;
  color: #fff;
}

.game-start-dialog button.continue-game-button {
  background-color: #262525;
  color: #fff;
  padding: 0.4rem 1rem;
  border: 2px solid #1e2228;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
}

.game-start-dialog .quick-start-button-container {
  margin: 0.25rem auto 0.3rem;
  gap: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-start-dialog button.quick-start-button {
  padding: 0.2rem;
  font-size: 0.8rem;
  border: none;
  background: none;
  color: #1e2228;
}


.game-start-dialog button.confirm-button {
  margin-bottom: 0.75rem;
}

.game-start-dialog button.cancel-button {
  margin-left: 0.75rem;
}

.game-start-dialog .achievement {
  font-size: 0.8rem;
  margin: 1rem 0 0;
  color: #4c4d55;
}

.game-start-dialog .hint {
  font-size: 0.7rem;
  color: #666;
  margin: 0.2rem 0 1rem;
}

</style>
