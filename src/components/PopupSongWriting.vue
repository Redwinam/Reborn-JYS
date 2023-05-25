<template>
  <div class="song-container">
    <div v-for="song in availableSongs" :key="song.title" class="song">
      <div class="song-meta">
        <div class="album-cover">
          <img :src="'/cover-images/' + song.coverImage + '@0.25x.jpg'" :alt="song.title" />
        </div>
        <div class="song-info">
          <h3>《{{ song.title }}》</h3>
          <p>{{ !song.isAvailable ? '未达成' : '已达成' }} / <span v-for="(value, key, index) in song.conditions" :key="key">{{ attributeNames[key] }}: {{ value }}<span v-if="index !== Object.keys(song.conditions).length - 1">，</span></span></p>
        </div>
      </div>
      <div class="button-group">
        <button @click="writeSong('demo', song)" :disabled="!song.isAvailable" v-if="!songStages[song.title] || songStages[song.title].completedStage === null">{{ !song.isAvailable ? "×": "✐"}} DEMO</button>
        <button @click="writeSong('record', song)" v-if="songStages[song.title] && songStages[song.title].completedStage === 'demo'">录歌</button>
        <button @click="writeSong('release', song)" v-if="songStages[song.title] && songStages[song.title].completedStage === 'record'">上线</button>
        <button @click="currentSong = song; showReleaseSongModal = true" v-if="songStages[song.title] && songStages[song.title].completedStage === 'release'">▶ 收听</button>
      </div>
    </div>
    <div class="song">
      <div class="song-meta">
        <div class="album-cover">
          <img :src="'/cover-images/feige.png'" alt="废歌" />
        </div>
        <div class="song-info">
          <h3>废歌</h3>
          <p>姜云升今天要废掉哪首歌呢？</p>
        </div>
      </div>
      <div class="button-group">
        <button @click="writeFeiSong()" :disabled="isTyping">✐ 写歌</button>
      </div>
    </div>
  </div>

  <div v-if="showReleaseSongModal" class="song-modal">
    <div class="modal-content">
      <div class="close-button" @click="showReleaseSongModal = false">×</div>
      <img :src="'/cover-images/' + currentSong.coverImage + '.jpg'" :alt="currentSong.title" class="modal-cover-image" />
      <p>{{ currentSong.lyrics }}</p>
      <div class="modal-header">
        <button @click="listenSong(currentSong)">▶ 播放</button>
        <h3>——《{{ currentSong.title }}》</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, ssrContextKey } from 'vue'
import { useStore } from 'vuex'
import { attributeNames } from '../store/attributes'
import { Achievement } from '../store/achievements'
import { Song, songLibrary, songFeiLibrary } from '../store/songs'
import { isTyping } from './composables/gameRefs'

const store = useStore()
const songStages = computed(() => store.state.songStages)

const showReleaseSongModal = ref(false)
const currentSong = ref(null) as any

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

  const currentStage = store.state.songStages[song.title] || {
    completedStage: null,
  }

  if (stage === 'demo' && !currentStage.completedStage) {
    for (const [key, effect] of Object.entries(song.effects)) {
      if (key === 'money') {
        continue
      }
      store.commit('updateAttribute', { attribute: key, value: effect * 0.2 })
    }
    store.commit('setSongStages', { songTitle: song.title, stage: 'demo' })
    let attributesChangeStr = Object.entries(song.effects).map(([key, value]) => {
      if (key === 'money') {
        return ''
      }
      value = value *0.2;
      let sign = value >= 0 ? '+' : '';
      return `${attributeNames[key]}${sign}${value}`;
    }).join('、');
    store.dispatch('typeWriterPopup', `歌曲《${song.title}》已经完成DEMO啦，姜云升属性 ${attributesChangeStr} 。`)

  } else if (stage === 'record' && currentStage.completedStage === 'demo') {
    if (store.state.attributes.money >= song.cost) {
      store.commit('updateAttribute', { attribute: 'money', value: -song.cost })
      store.commit('setSongStages', { songTitle: song.title, stage: 'record' })
      store.dispatch('typeWriterPopup', `歌曲《${song.title}》已经录好啦，花费了姜云升 ${song.cost} 元。`)
    } else {
      store.dispatch('typeWriterPopup', `姜云升没有足够的钱录歌，录这首歌需要 ${song.cost} 元。`)
    }

  } else if (stage === 'release' && currentStage.completedStage === 'record') {
    for (const [key, effect] of Object.entries(song.effects)) {
      if (key === 'money') {
        store.commit('updateAttribute', { attribute: key, value: effect })
        continue
      }
      store.commit('updateAttribute', { attribute: key, value: effect * 0.8 })
    }
    store.commit('setSongStages', { songTitle: song.title, stage: 'release' })
    let attributesChangeStr = Object.entries(song.effects).map(([key, value]) => {
      if (key != 'money') {
        value = value *0.8;
      }
      let sign = value >= 0 ? '+' : '';
      return `${attributeNames[key]}${sign}${value}`;
    }).join('、');
    store.dispatch('typeWriterPopup', `歌曲《${song.title}》已经上线啦，姜云升属性 ${attributesChangeStr} 。`)
    
    currentSong.value = song || null;
    showReleaseSongModal.value = true

  } else {
    store.dispatch('typeWriterPopup', '无法执行当前阶段，请按顺序完成写歌任务。')
  }
}

async function writeFeiSong() {
  const unlockedFeiSongs = store.state.unlockedFeiSongs;
  const lockedFeiSongs = songFeiLibrary.filter((songFei: { name: any; }) => !unlockedFeiSongs.find((uf: { name: any; }) => uf.name === songFei.name));
  let toMessage = '';
  if (lockedFeiSongs.length > 0) {
    let songFei = lockedFeiSongs[Math.floor(Math.random() * lockedFeiSongs.length)];
    if (unlockedFeiSongs.length === 0) {
      songFei = lockedFeiSongs[2];
    }
    store.commit('unlockFeiSong', songFei);
    toMessage = `姜云升写了半首《${songFei.name}》，「${songFei.lyrics}」然后说这歌废啦。`;
  } else {
    const hasAchievement = store.state.achievements.find(
      (ach: Achievement) => ach.name === '这歌废了' && ach.unlockTerm === store.state.term
    );
    if (!hasAchievement) {
      store.commit('unlockAchievement', '这歌废了');
      toMessage = '姜云升写了半首《这歌废了》，「这歌废了」然后说这歌废啦。';
    } else {
      toMessage = '姜云升废歌 + 1，'
    }
  }

  store.commit('updateAttribute', { attribute: 'energy', value: -20 });
  const redValue = 20 + Math.floor(Math.random() * 0.2 * store.state.attributes.popularity.red);
  const blackValue = 5 + Math.floor(Math.random() * 0.08 * store.state.attributes.popularity.black);
  store.commit('updateAttribute', { attribute: 'red', value: redValue });
  store.commit('updateAttribute', { attribute: 'black', value: blackValue });
  await store.dispatch('typeWriterPopup', [toMessage, '姜云升体力-20，人气红值+' + redValue + '，黑值+' + blackValue + '。']);
  store.dispatch('incrementRound');
}

function listenSong(song: Song) {
  window.open(song.url)
}

</script>

<style scoped>
.song-container {
  max-height: 75vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px 0;
}

.song {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.song .song-meta {
  display: flex;
  gap: 10px;
}

.song .album-cover {
  height: 2.8rem; /* Adjust as needed */
}

.song .album-cover img {
  height: 100%;
  object-fit: cover;
}


.song .song-info {
  text-align: left;
}

.song .song-info h3 {
  margin: 0;
  font-size: 0.9rem;
}

.song .song-info p {
  margin: 0;
  font-size: 0.7rem;
}

.song .button-group {
  display: flex;
  gap: 5px;
}

.song .button-group button {
  padding: 2px 5px;
  font-size: 0.8rem;
  border: none;
  background-color: #1e2228;
  color: #d3c6c4;
  border-radius: 5px;
}

.song .button-group button:disabled {
  background-color: #ddd;
  color: #1e2228;
}


.song-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 36vh;
  /* height: 60vh; */
  border-radius: 12px;
}

.modal-content .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close-button:hover,
.close-button:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.modal-cover-image {
  width: 100%;
  height: auto;
}
</style>
