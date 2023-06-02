<template>
<Popup v-if="player" title="存档·读档" :visible="showSLPopup && player" @close="showSLPopup = false">

<div class="player-meta">
  <span class="player-label">玩家</span>
  <span class="player-info">{{ player.name }} / {{ player.email }}</span>
</div>
<div class="button-group">
  <button class="button-load" @click="showUpdatePlayerPopup = true">设置</button>
  <button class="button-delete" @click="logoutPlayer()">退出</button>
</div>

<button class="sl" @click="savePlay()">存档！！</button><button class="sl" @click="refreshPlayer()">刷新</button>
<ul class="play-info" v-if="player.plays.length">
  <li v-for="play in player.plays">
    <span class="play-name"><span class="play-id">存档{{ play.id }}</span> <span class="play-time">{{ play.created_at }}</span></span>
    <div class="button-group">
      <button class="button-load" @click="loadPlay(play.id)">读取</button>
      <button class="button-delete" @click="deletePlay(play.id)">删除</button>
    </div>
  </li>
</ul>
  
<div v-else>
  <p class="note-message dashed">（暂无线上存档，可点击按钮存档当前游戏记录！）</p>
</div>
<p class="note-message note-message-small">（目前限制一位玩家最多存档记录≤99条）</p>

</Popup>

<Popup v-if="!player" title="连接·玩家" :visible="showSLPopup && !player" @close="showSLPopup = false">
  <div class="player-meta">
    <span class="player-label">昵称</span>
    <span class="player-info"><input v-model="link_player.name" type="text"></span>
  </div>
  <div class="player-meta">
    <span class="player-label">邮箱</span>
    <span class="player-info"><input v-model="link_player.email" type="email"></span>
  </div>
  <div class="player-meta">
    <span class="player-label">匿名</span>
    <span class="player-info"><input v-model="link_player.anonymous" type="checkbox"> <HelpCircle :size="12" @click="showAnonymousNote = true"></HelpCircle></span>
  </div>
  <div><button class="sl" @click="linkPlayer()">确认</button></div>
  <span v-if="showAnonymousNote" class="note-message">（希望匿名的玩家昵称不会在后续的星星墙上显示）</span>
  <p class="note-message dashed">说明：游戏线上存档会保存在游戏服务器。第一次连接时请记得输入的昵称和邮箱，因为在再次连接时需要昵称与邮箱匹配才可以连接成功。PS：不支持特别冒犯的昵称，系统会定期删你存档。</p>
</Popup>

<Popup v-if="player" title="设置·玩家" :visible="showUpdatePlayerPopup" @close="showUpdatePlayerPopup = false" class="update-player">
  <div class="player-meta">
    <span class="player-label">邮箱</span>
    <span class="player-info">{{ player.email }}</span>
  </div>
  <div class="player-meta">
    <span class="player-label">昵称</span>
    <span class="player-info"><input v-model="update_player.name" type="text"></span>
  </div>
  <div class="player-meta">
    <span class="player-label">匿名</span>
    <span class="player-info"><input v-model="update_player.anonymous" type="checkbox"> （希望匿名的玩家昵称不会在后续的星星墙上显示）</span>
  </div>
  <button class="sl" @click="updatePlayer()">确认</button>
  <p class="note-message dashed">说明：游戏线上存档会保存在游戏服务器。第一次连接时请记得输入的昵称和邮箱，因为在再次连接时需要昵称与邮箱匹配才可以连接成功。PS：不支持特别冒犯的昵称，系统会定期删你存档。</p>
</Popup>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

import Popup from '../components/Popup.vue'
import { Play, Player } from '../store/player'
import { showSLPopup } from './composables/gameRefs';
import { HelpCircle } from 'lucide-vue-next'

const store = useStore()
const player = computed(() => store.state.player)

const link_player = ref({
  name: '',
  email: '',
  anonymous: false,
})

const savePlay = () => {
  if (!player.value) return
  const { textHistory, ...toSaveStore } = store.state;
  const play = {
    player_id: player.value.id,
    state: toSaveStore,
  }
  axios.post('/api/play', {
    player: {
      name: player.value.name,
      email: player.value.email,
    },
    play,
  }).then(res => {
    const player: Player = res.data
    store.commit('setPlayer', player)
  })
}

const linkPlayer = () => {
  axios.post('/api/player', {
    player: link_player.value,
  }).then(res => {
    const player: Player = res.data
    store.commit('setPlayer', player)
  })
}

const loadPlay = (id: number) => {
  axios.get(`/api/play/${id}`).then(res => {
    const play: Play = res.data
    store.commit('loadGameState', play.state)
    showSLPopup.value = false
  })
}

const deletePlay = (id: number) => {
  axios.delete(`/api/play/${id}`, {
    data: {
      player: {
        id: player.value.id,
        email: player.value.email,
      }
    }
  }).then(res => {
    const player: Player = res.data
    store.commit('setPlayer', player)
  })
}

const showAnonymousNote = ref(false)
const showUpdatePlayerPopup = ref(false)

const update_player = ref({
  name: '',
  anonymous: false,
})

const updatePlayer = () => {
  axios.put('/api/player/' + player.value.id, {
    player: {
      id: player.value.id,
      name: update_player.value.name,
      email: player.value.email,
      anonymous: update_player.value.anonymous,
    }, 
    update: true
  }).then(res => {
    const player: Player = res.data
    store.commit('setPlayer', player)
    showUpdatePlayerPopup.value = false
  })
}

const refreshPlayer = () => {
  axios.put('/api/player' + player.value.id, {
    player: {
      id: player.value.id,
      email: player.value.email,
    },
    update: false
  }).then(res => {
    const player: Player = res.data
    store.commit('setPlayer', player)
    showUpdatePlayerPopup.value = false
  })
}

const logoutPlayer = () => {
  store.commit('setPlayer', null)
}

</script>

<style scoped>
.button-dao{
  display: block;
  background-color: #3a3c43;
  border: none;
  color: #fff;
  border-radius: 4px;
  padding: 5px 7px;
  font-size: 0.9rem;
  cursor: pointer;
  margin: 0.5rem auto;
  /* margin-left: 10px; */
  transition: background-color 0.3s ease;
}

.button-dao:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.button-activity {
  background-color: #964742;
  border: none;
  color: #fff;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s ease;
}


.button_cancel {
  background-color: #ddd;
  border: none;
  color: #333;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
}

.player-meta {
  display: flex;
  align-items: center;
  margin: 0 auto;
  justify-content: center;
}

.player-label {
  font-weight: bold;
  margin-right:4px;
}

.player-info input[type="text"],
.player-info input[type="email"],
.player-info input[type="checkbox"] {
  /* width: 2.5rem; */
  margin: 2px;
  padding: 6px;
  border: 2px solid #1e2228;
  border-radius: 4px;
}

.sl {
  color: #d3c6c4;
  background-color: #9d4842;
  border: 1px solid #1e2228;
  color: #fff;
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  width: 72%;
  /* width: -webkit-fill-available; */
  margin: 0.2rem auto;
}


.note-message {
  font-size: 0.7rem;
  color: #666;
  margin-top: 0.5rem;
}

.note-message.dashed {
  padding-top: 0.5rem;
  border-top: 1px dashed #aaa;
}

</style>
