<template>
<div class="song-container">
  <div v-for="song in availableSongs" :key="song.title" class="song">
    <h3>《{{ song.title }}》</h3>
    <p>条件：</p>
    <ul>
      <li v-for="(value, key) in song.conditions" :key="key">{{ key }}: {{ value }}</li>
    </ul>
    <button @click="writeSong('demo', song)" :disabled="!song.isAvailable" v-if="!songStages[song.title] || songStages[song.title].completedStage === null">Demo</button>
    <button @click="writeSong('record', song)" v-if="songStages[song.title] && songStages[song.title].completedStage === 'demo'">录歌</button>
    <button @click="writeSong('release', song)" v-if="songStages[song.title] && songStages[song.title].completedStage === 'record'">上线</button>
    <button @click="listenSong(song)" v-if="songStages[song.title] && songStages[song.title].completedStage === 'release'">收听</button>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { Song, songLibrary } from '../store/songs'
// 声明 props showSongWritingDialog


let songStages = {} as Record<string, { completedStage: string | null }>

const textBoxMessage = ref('')

const store = useStore()

function isSongAvailable(song: Song) {
  for (const [key, value] of Object.entries(song.conditions)) {
    if (store.state.attributes[key] < value) {
      return false
    }
  }
  switch (song.title) {
    case '真没睡':
      if (store.state.attributes.popularity < 100) {
        return false
      }
      break
  }


  return true
}

const availableSongs = computed(() => {
  return songLibrary.map((song) => {
    return {
      ...song,
      isAvailable: isSongAvailable(song),
    }
  })
})

function writeSong(stage: string, song: Song) {
  if (!songStages[song.title]) {
    songStages[song.title] = {
      completedStage: null,
    }
  }

  const currentStage = songStages[song.title]

  if (stage === 'demo' && currentStage.completedStage === null) {
    // 处理 Demo 阶段逻辑
    // 更新歌曲的人气值（一半）
    // ...
    currentStage.completedStage = 'demo'
  } else if (stage === 'record' && currentStage.completedStage === 'demo') {
    // 检查金钱是否充足
    if (store.state.attributes.money >= song.cost) {
      // 处理录歌阶段逻辑
      // 扣除金钱
      store.commit('updateAttribute', { attribute: 'money', value: -song.cost })
      // ...
      currentStage.completedStage = 'record'
    } else {
      // 金钱不足的提示
      // textBoxMessage.value = '金钱不足，无法录制歌曲。'
      store.commit('typeWriterPopup', '金钱不足，无法录制歌曲。')
    }
  } else if (stage === 'release' && currentStage.completedStage === 'record') {
    // 处理上线阶段逻辑
    // 更新歌曲的完整数值奖励
    for (const [key, effect] of Object.entries(song.effects)) {
      const randomValue = Math.floor(Math.random() * (effect.max - effect.min + 1)) + effect.min
      store.commit('updateAttribute', { attribute: key, value: randomValue })
    }
    // ...
    currentStage.completedStage = 'release'
    store.commit('typeWriterPopup', `歌曲《${song.title}》已经上线，获得了 ${song.effects.popularity} 点人气值！`)
  } else {
    // 无法执行当前阶段的提示
    store.commit('typeWriterPopup', '无法执行当前阶段，请按顺序完成写歌任务。')
  }
}

function listenSong(song: Song) {
  window.open(song.url)
}

</script>

<style scoped>
.song-container {
  height: 75vh;
  overflow-y: auto;
}
</style>