<template>
  <div class="song-container">
    <div v-for="song in availableSongs" :key="song.title" class="song">
      <div class="song-meta">
        <div class="album-cover">
          <img :src="'/cover-images/' + song.title + '@0.25x.jpg'" :alt="song.title" />
        </div>
        <div class="song-info">
          <h3>{{ song.title }}</h3>
          <p>
            <span v-for="(value, key, index) in song.conditions" :key="key">{{ attributeNames[key] }} ≥ {{ value }}<span v-if="index !== Object.keys(song.conditions).length - 1 || song.conditions_ne"> / </span></span>
            <span v-if="song.conditions_ne" v-for="(value, key, index) in song.conditions_ne" :key="key">{{ attributeNames[key] }} ≤ {{ value }}<span v-if="index !== Object.keys(song.conditions_ne).length - 1"> / </span></span>
            <span v-if="!Object.keys(song.conditions).length && !song.conditions_ne" class="condition-text">满足——</span>
            <BatteryWarning :size="16" v-if="song.conditionsText" @click="!isTyping && store.dispatch('typeWriterPopup', song.conditionsText)"></BatteryWarning>
          </p>
        </div>
      </div>
      <div class="button-group">
        <p :class="song.isAvailable ? 'song-available' : ''" @click="store.dispatch('typeWriterPopup', songConditions(song))">{{ !song.isAvailable ? '未达成' : '已达成' }}</p>
        <button @click="writeSong('demo', song)" :class="song.isAvailable ? 'song-available' : ''" v-if="!songStages[song.title] || songStages[song.title].completedStage === null" :disabled="isTyping"><Edit3 :size="10"></Edit3> DEMO</button>
        <button @click="writeSong('record', song)" class="song-available" v-if="songStages[song.title] && songStages[song.title].completedStage === 'demo'" :disabled="isTyping"><Mic2 :size="10"></Mic2>  录歌</button>
        <button @click="writeSong('release', song)" class="song-available" v-if="songStages[song.title] && songStages[song.title].completedStage === 'record'" :disabled="isTyping"><Radio :size="10"></Radio> 上线</button>
        <button @click="currentSong = song; showReleaseSongModal = true" v-if="songStages[song.title] && songStages[song.title].completedStage === 'release'"><Play :size="10"></Play> 收听</button>
      </div>
    </div>
    <div class="song">
      <div class="song-meta">
        <div class="album-cover">
          <img :src="'/cover-images/feige.png'" alt="废歌" />
        </div>
        <div class="song-info">
          <h3>废歌</h3>
          <p><span>姜云升今天要废掉哪首歌呢？</span></p>
        </div>
      </div>
      <div class="button-group">
        <p class="song-available">加油！</p>
        <button @click="writeFeiSong()" class="song-available" :disabled="isTyping"><Eraser :size="10"></Eraser> 写废歌</button>
      </div>
    </div>
  </div>

  <Popup title="" :visible="showReleaseSongModal" @close="showReleaseSongModal = false" class="song-modal" v-if="currentSong">
    <img :src="'/cover-images/' + currentSong.title + '.jpg'" :alt="currentSong.title" class="modal-cover-image" />
    <p>{{ currentSong.lyrics }}</p>
    <div class="modal-header">
      <button @click="listenSong(currentSong)"><Play :size="16"></Play> 播放</button>
      <h3>——《{{ currentSong.title }}》</h3>
    </div>
  </Popup>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { Edit3, Eraser, Mic2, Play, Radio, BatteryWarning } from 'lucide-vue-next'

import { attributeNames } from '../store/attributes'
import { Achievement } from '../store/achievements'
import { Song, songLibrary, songFeiLibrary } from '../store/songs'
import { isTyping } from './composables/gameRefs'
import Popup from '../components/Popup.vue'


const store = useStore()
const songStages = computed(() => store.state.songStages)

const showReleaseSongModal = ref(false)
const currentSong = ref<null | Song>(null)

function isSongAvailable(song: Song) {
  if (store.state.songStages[song.title] && store.state.songStages[song.title].unlocked) {
    return true;
  }

  for (const [key, value] of Object.entries(song.conditions)) {
    if (key === 'popularity') {
      if (store.state.attributes.popularity.red + store.state.attributes.popularity.black < value) {
        return false;
      }
    } else if (key === 'gaming') {
      if (store.state.attributes.skill.gaming < value) {
        return false;
      }
    } else if (key === 'freestyle') {
      if (store.state.attributes.skill.freestyle < value) {
        return false;
      }
    } else if (store.state.attributes[key] < value) {
      return false;
    }
  }

  if (song.conditions_ne) {
    for (const [key, value] of Object.entries(song.conditions_ne)) {
      if (store.state.attributes[key] > value) {
        return false;
      }
    }
  }

  switch (song.title) {
    case '孤独面店':
      if (store.state.breakupTimes < 2 || store.state.flirtCount > 0 || (store.state.term - store.state.lastBreakupTerm) < 9) {
        return false;
      }
      break;

    case '真没睡':
      if (!store.state.inventory['衣服'] || store.state.inventory['衣服'].quantity < 5 || !store.state.inventory['包包']|| store.state.inventory['包包'].quantity < 5) {
        return false;
      }
      break;

    case 'SAD':
      if (store.state.attributes['心情'] > -20 || !store.state.seamlessRelation || store.state.girlfriend) {
        return false;
      }
      break;
  }

  return true;
}

const availableSongs = computed(() => {
  return songLibrary.map((song) => {
    return {
      ...song,
      isAvailable: isSongAvailable(song),
    }
  })
})

async function unlockSongs() {
  for (const song of songLibrary) {
    if (isSongAvailable(song) && (!store.state.songStages[song.title] || !store.state.songStages[song.title].unlocked)) {
      store.commit('unlockSong', song.title);
      await store.dispatch('typeWriterPopup', [`解锁了新歌曲《${song.title}》！`]);
    }
  }
}

onMounted(() => {
  const textboxPopup = document.getElementById('textboxPopup');
  if (textboxPopup) {
    unlockSongs();
  }
});

const songConditions = (song: Song) => {
  const conditions = []
  conditions.push(
    Object.entries(song.conditions).map(([key, value]) => `${attributeNames[key]} ≥ ${value}`).join(', ')
  )
  if (song.conditions_ne) {
    conditions.push(
      Object.entries(song.conditions_ne).map(([key, value]) => `${attributeNames[key]} ≤ ${value}`).join(', ')
    )
  }
  if (song.conditionsText) {
    conditions.push(song.conditionsText)
  }
  return conditions
}

async function writeSong(stage: string, song: Song) {
  if (!isSongAvailable(song)) {
    const conditions = [`歌曲《${song.title}》未达成所有条件——`]
    // 连接songonditions(song)数组
    conditions.push(...songConditions(song))
    store.dispatch('typeWriterPopup', conditions)
    return
  }

  const currentStage = store.state.songStages[song.title] || {
    completedStage: null,
  }

  if (stage === 'demo' && !currentStage.completedStage) {
    for (const [key, effect] of Object.entries(song.effects)) {
      if (key === 'money') {
        continue
      } else if (key === 'energy') {
        store.commit('updateAttribute', { attribute: key, value: effect })
        continue
      }
      store.commit('updateAttribute', { attribute: key, value: effect * 0.2 })
    }
    store.commit('setSongStages', { songTitle: song.title, stage: 'demo' })
    let attributesChangeStr = Object.entries(song.effects)
    .filter(([key]) => key !== 'money')
    .map(([key, value]) => {
      if (key !== 'energy') {
        value = value * 0.2;
      }
      let sign = value >= 0 ? '+' : '';
      return `${attributeNames[key]}${sign}${value}`;
    })
    .join('、');
    store.dispatch('typeWriterPopup', `歌曲《${song.title}》已经完成DEMO啦，姜云升属性 ${attributesChangeStr} 。`)

  } else if (stage === 'record' && currentStage.completedStage === 'demo') {
    if (store.state.attributes.money >= song.cost) {
      store.commit('updateAttribute', { attribute: 'money', value: -song.cost })
      store.commit('setSongStages', { songTitle: song.title, stage: 'record' })
      store.dispatch('typeWriterPopup', `歌曲《${song.title}》已经录好啦，花费了姜云升 ${song.cost} 元编曲制作费。`)
    } else {
      store.dispatch('typeWriterPopup', `姜云升没有足够的钱录歌，录这首歌需要 ${song.cost} 元编曲制作费。`)
    }

  } else if (stage === 'release' && currentStage.completedStage === 'record') {
    for (const [key, effect] of Object.entries(song.effects)) {
      if (key === 'money') {
        if (store.state.signedAgency) {
          store.commit('updateAttribute', { attribute: key, value: 0 })
        } else {
          store.commit('updateAttribute', { attribute: key, value: effect })
        }
        continue
      } else if (key === 'energy') {
        continue
      }
      store.commit('updateAttribute', { attribute: key, value: effect * 0.8 })
    }
    store.commit('setSongStages', { songTitle: song.title, stage: 'release' })
    let attributesChangeStr = Object.entries(song.effects)
    .filter(([key]) => key !== 'energy')
    .map(([key, value]) => {
      if (key === 'money') {
        if (store.state.signedAgency) {
          value = 0
        }
      } else {
        value = value *0.8;
      }
      let sign = value >= 0 ? '+' : '';
      return `${attributeNames[key]}${sign}${value}`;
    }).join('、');
    store.dispatch('typeWriterPopup', `歌曲《${song.title}》已经上线啦，姜云升属性 ${attributesChangeStr} 。${store.state.signedAgency ? '由于姜云升签约了经纪公司，这首歌的版权归属公司，姜云升没有收入。' : ''}`)

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    currentSong.value = song;
    showReleaseSongModal.value = true

  } else {
    store.dispatch('typeWriterPopup', '无法执行当前阶段，请按顺序完成写歌任务。')
  }
}

async function writeFeiSong() {
  if (store.state.attributes.energy <= 0) {
    store.dispatch('typeWriterPopup', '姜云升体力不足，需要休息才能写歌啦。')
    return
  }

  const unlockedFeiSongs = store.state.unlockedFeiSongs;
  const lockedFeiSongs = songFeiLibrary.filter((songFei: { name: any; }) => !unlockedFeiSongs.find((uf: { name: any; }) => uf.name === songFei.name));
  let toMessage = [];
  if (lockedFeiSongs.length > 0) {
    let songFei = lockedFeiSongs[Math.floor(Math.random() * lockedFeiSongs.length)];
    if (unlockedFeiSongs.length === 0) {
      songFei = lockedFeiSongs[2];
    }
    store.commit('unlockFeiSong', songFei);
    toMessage.push(`姜云升写了半首《${songFei.name}》，「${songFei.lyrics}」然后说这歌废啦。`);

    if(lockedFeiSongs.length === 1) {
      const hasAchievement = store.state.achievements.find(
        (ach: Achievement) => ach.name === '这歌废啦' && ach.unlocked
      );
      if (!hasAchievement) {
        store.commit('unlockAchievement', '这歌废啦');
        store.commit('updateAttribute', { attribute: 'talent', value: 30 });
        store.commit('updateAttribute', { attribute: 'charm', value: 30 });
        store.commit('updateAttribute', { attribute: 'red', value: 300 });
        toMessage.push('姜云升已经写完了所有废歌，再写废歌就要被打啦！解锁了第' + store.state.achievements.filter((ach: Achievement) => ach.unlocked).length + '个成就【这歌废啦】，姜云升才华+30，魅力+30，红色人气+300。');
      }
    }
  } else {
    toMessage.push("姜云升废歌 + 1！")
  }

  store.commit('updateAttribute', { attribute: 'energy', value: -100 });
  const redValue = 60 + Math.floor(Math.random() * 0.12 * store.state.attributes.popularity.red);
  const blackValue = 20 + Math.floor(Math.random() * 0.08 * store.state.attributes.popularity.black);
  store.commit('updateAttribute', { attribute: 'red', value: redValue });
  store.commit('updateAttribute', { attribute: 'black', value: blackValue });
  store.commit('updateAttribute', { attribute: 'talent', value: 20 });
  store.commit('updateAttribute', { attribute: 'charm', value: 20 });
  toMessage.push('姜云升体力-100，人气红值+' + redValue + '，黑值+' + blackValue + '，才华+20，魅力+20。');
  await store.dispatch('typeWriterPopup', toMessage);
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
  margin: 0.25rem 0;
  font-size: 0.7rem;
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
}

.song .song-info p > span, .song .song-info p > svg {
  white-space: nowrap;
  margin: -0.25rem 0;
}

.song .button-group p {
  margin: 0;
  font-size: 0.7rem;
  font-weight: bold;
  text-align: right;
  color: #999999;
}

.song .button-group p.song-available {
  color: #1e2228;
}

.song .button-group button {
  padding: 2px 5px;
  font-size: 0.8rem;
  border: none;

  border-radius: 5px;
  white-space: nowrap;
  background-color: #ddd;
  color: #1e2228;
}

.song .button-group button.song-available {
  background-color: #1e2228;
  color: #d3c6c4;
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



.song-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.song-modal .modal-header button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px
}
.modal-cover-image {
  width: 100%;
  height: auto;
  margin-top: 0.6rem;
}
</style>
