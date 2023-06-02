<template>
<Popup v-if="player" title="存档·读档" :visible="showSLPopup" @close="showSLPopup = false" class="player">

<div class="player-meta">
  <span class="player-label">玩家</span>
  <span class="player-info">{{ player.name }} / {{ player.email }}</span>
</div>


<div class="focus-button-container">
  <button class="sl" @click="savePlay()">存档！！</button>
  <div class="button-group">
    <RefreshCw :size="16" @click="refreshPlayer()"></RefreshCw>
    <button class="button-load" @click="showUpdatePlayerPopup = true">设置</button>
    <button class="button-delete" @click="logoutPlayer()">退出</button>
  </div>
</div>
<p class="note-message error">{{ errorMessage }}</p>

<div class="play-list" v-if="player.plays && player.plays.length">
  <div class="play-item" v-for="play in player.plays">
    <span class="play-name"><p class="play-id">存档{{ play.id }}</p> <p class="play-time">{{ timeToString(play.created_at) }}</p></span>
    <div class="button-group">
      <button class="button-load" @click="loadPlay(play.id)">读取</button>
      <button class="button-delete" @click="deletePlay(play.id)">删除</button>
    </div>
  </div>
</div>

<div v-else>
  <p class="note-message dashed">（暂无线上存档，可点击按钮存档当前游戏记录！）</p>
</div>
<p class="note-message small last">（目前限制一位玩家最多存档记录≤99条）</p>

</Popup>

<Popup v-if="!player" title="连接·玩家" :visible="showSLPopup" @close="showSLPopup = false" class="player">
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
<p class="note-message error">{{ errorMessage }}</p>
  <span v-if="showAnonymousNote" class="note-message">（希望匿名的玩家昵称不会在后续的星星墙上显示）</span>
  <p class="note-message dashed">说明：游戏线上存档会保存在游戏服务器。第一次连接时请记得输入的昵称和邮箱，因为在再次连接时需要昵称与邮箱匹配才可以连接成功。PS：不支持特别冒犯的昵称，系统会定期删你存档。</p>
</Popup>

<Popup v-if="player" title="设置·玩家" :visible="showUpdatePlayerPopup" @close="showUpdatePlayerPopup = false" class="player">
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
    <span class="player-info"><input v-model="update_player.anonymous" type="checkbox"></span>
  </div>
  <div><button class="sl" @click="updatePlayer()">确认</button></div>
<p class="note-message error">{{ errorMessage }}</p>
  <span v-if="showAnonymousNote" class="note-message">（希望匿名的玩家昵称不会在后续的星星墙上显示）</span>
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
import { HelpCircle, RefreshCw } from 'lucide-vue-next'

const store = useStore()
const player = computed(() => store.state.player)

const link_player = ref({
  name: '',
  email: '',
  anonymous: false,
})

const errorMessage = ref("")

const savePlay = () => {
  if (!player.value) return
  const { textHistory, ...toSaveStore } = store.state;
  const play = {
    player_id: player.value.id,
    state: toSaveStore,
  }
  axios.post('https://api.jys-wtf.proxy.mayq.me/plays', {
    player: {
      name: player.value.name,
      email: player.value.email,
    },
    play,
  }).then(res => {
    const player: Player = res.data
    store.commit('setPlayer', player)
  }).catch(error => {
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = "由于未知错误，加载失败……"
    }
  })
}

const linkPlayer = () => {
  axios.post('https://api.jys-wtf.proxy.mayq.me/players', {
    player: link_player.value,
  }).then(res => {
    const player: Player = res.data
    store.commit('setPlayer', player)
  }).catch(error => {
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = "由于未知错误，加载失败……"
    }
  })
}

const loadPlay = (id: number) => {
  axios.get(`https://api.jys-wtf.proxy.mayq.me/plays/${id}`).then(res => {
    const play: Play = res.data
    store.commit('loadGameState', play.state)
    showSLPopup.value = false
  }).catch(error => {
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = "由于未知错误，加载失败……"
    }
  })
}

const deletePlay = (id: number) => {
  axios.delete(`https://api.jys-wtf.proxy.mayq.me/plays/${id}`, {
    data: {
      player: {
        id: player.value.id,
        email: player.value.email,
      }
    }
  }).then(res => {
    const player: Player = res.data
    store.commit('setPlayer', player)
  }).catch(error => {
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = "由于未知错误，加载失败……"
    }
  })
}

const showAnonymousNote = ref(false)
const showUpdatePlayerPopup = ref(false)

const update_player = ref({
  name: player.value? player.value.name : "",
  anonymous: player.value? player.value.anonymous : false,
})

const updatePlayer = () => {
  axios.put('https://api.jys-wtf.proxy.mayq.me/players/' + player.value.id, {
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
  }).catch(error => {
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = "由于未知错误，加载失败……"
    }
  })
}

const refreshPlayer = () => {
  axios.put('https://api.jys-wtf.proxy.mayq.me/players/' + player.value.id, {
    player: {
      id: player.value.id,
      email: player.value.email,
    },
    update: false
  }).then(res => {
    const player: Player = res.data
    store.commit('setPlayer', player)
    showUpdatePlayerPopup.value = false
  }).catch(error => {
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = "由于未知错误，加载失败……"
    }
  })
}

const logoutPlayer = () => {
  store.commit('setPlayer', null)
}

const timeToString = (time: string) => {
  const date = new Date(time)
  return new Intl.DateTimeFormat('default', {dateStyle: 'long', timeStyle: 'medium'}).format(date)
}

</script>

<style scoped>
.player {
  font-size: 0.9rem;
}

.player button {
  font-size: 0.85rem;
  padding: 0.25rem 0.4rem;
  margin-left: 0.4rem;
  border: 1px solid #ccc;
  background-color: #fafafa;

}


.player-meta {
  display: flex;
  align-items: center;
  margin: 0.25rem auto;
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

.play-list {
  margin: 0.5rem 0;
}

.play-item {
  display: flex;
  align-items: center;
  margin: 0.25rem auto;
  justify-content: center;
  border-bottom: 1px dashed #aaa;
}

.play-item p {
  margin: 0;
  font-size: 0.7rem;
  text-align: left;
}

.play-item p.play-id {
  font-weight: bold;
  margin-top: 0.2rem;
}

.play-item p.play-time {
  margin-bottom: 0.4rem;
}



.player .sl {
  color: #d3c6c4;
  background-color: #9d4842;
  border: 1px solid #1e2228;
  color: #fff;
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  width: 72%;
  /* width: -webkit-fill-available; */
  margin: 0.25rem auto 0.4rem;
}


.note-message {
  font-size: 0.7rem;
  color: #666;
  margin: 0.25rem 0;
}

.note-message.dashed {
  padding-top: 0.5rem;
  border-top: 1px dashed #aaa;
}

.note-message.error {
  color: #9d4842;
}

.last {
  margin-bottom: 0.9rem;

}

</style>
