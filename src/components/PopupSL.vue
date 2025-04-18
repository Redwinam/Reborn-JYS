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
        <button class="button-load" @click="openUpdatePlayerPopup">设置</button>
        <button class="button-delete" @click="logoutPlayer()">退出</button>
      </div>
    </div>
    <p class="note-message error">{{ errorMessage }}</p>

    <div class="play-list" v-if="player.plays && player.plays.length">
      <div class="play-item" v-for="play in sortedPlays">
        <span class="play-name"
          ><p class="play-id">存档{{ play.id }}</p>
          <p class="play-time">{{ timeToString(play.createdAt || play.created_at) }}</p></span
        >
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
      <span class="player-info"><input v-model="link_player.name" type="text" /></span>
    </div>
    <div class="player-meta">
      <span class="player-label">邮箱</span>
      <span class="player-info"><input v-model="link_player.email" type="email" /></span>
    </div>
    <div class="player-meta">
      <span class="player-label">匿名</span>
      <span class="player-info"><input v-model="link_player.anonymous" type="checkbox" /> <HelpCircle :size="12" @click="showAnonymousNote = true"></HelpCircle></span>
    </div>
    <div><button class="sl" @click="linkPlayer()">确认</button></div>
    <div class="reset-game-button-container">
      <button @click="showResetGameConfirmPopup = true" class="reset-game-button">（恢复初始）</button>
    </div>
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
      <span class="player-info"><input v-model="update_player.name" type="text" /></span>
    </div>
    <div class="player-meta">
      <span class="player-label">匿名</span>
      <span class="player-info"><input v-model="update_player.anonymous" type="checkbox" /> <HelpCircle :size="12" @click="showAnonymousNote = true"></HelpCircle></span>
    </div>
    <div><button class="sl" @click="updatePlayer()">确认</button></div>
    <div class="reset-game-button-container">
      <button @click="showResetGameConfirmPopup = true" class="reset-game-button">（恢复初始）</button>
    </div>
    <p class="note-message error">{{ errorMessage }}</p>
    <span v-if="showAnonymousNote" class="note-message">（希望匿名的玩家昵称不会在后续的星星墙上显示）</span>
    <p class="note-message dashed">说明：游戏线上存档会保存在游戏服务器。第一次连接时请记得输入的昵称和邮箱，因为在再次连接时需要昵称与邮箱匹配才可以连接成功。PS：不支持特别冒犯的昵称，系统会定期删你存档。</p>
  </Popup>

  <PopupSub :visible="showResetGameConfirmPopup" @close="showResetGameConfirmPopup = false" class="game-ended-dialog">
    <h3>确认恢复初始游戏数据吗？</h3>
    <p class="desc">恢复初始会将当前游戏进度恢复到初始状态，不保留任何数据（不影响线上存档），请问确认操作嘛？</p>
    <div class="game-ended-dialog-buttons">
      <button class="restart-game-button" @click="resetGame()">确认</button>
      <button class="confirm-button cancel-button" @click="showResetGameConfirmPopup = false">取消</button>
    </div>
  </PopupSub>
</template>

<script setup lang="ts">
import { computed, watch, ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

import Popup from "../components/Popup.vue";
import PopupSub from "../components/PopupSub.vue";
import { Play, Player } from "../store/player";
import { isAtHome, showSLPopup } from "./composables/gameRefs";
import { HelpCircle, RefreshCw } from "lucide-vue-next";

const store = useStore();
const player = computed(() => store.state.player);

const link_player = ref({
  name: "",
  email: "",
  anonymous: false,
});

const errorMessage = ref("");

const savePlay = () => {
  if (!player.value) return;
  const { textHistory, ...toSaveStore } = store.state;

  // 深拷贝状态，避免修改原始state
  const cleanState = JSON.parse(JSON.stringify(toSaveStore));

  // 删除冗余数据
  delete cleanState.player; // 移除player字段
  // 如果state中嵌套了plays数组，也移除它
  if (cleanState.plays) delete cleanState.plays;

  const play = {
    player_id: player.value.id,
    state: cleanState,
  };

  axios
    .post(`${API_BASE_URL}/plays`, {
      player: {
        name: player.value.name,
        email: player.value.email,
      },
      play,
    })
    .then((res) => {
      const player: Player = res.data;
      store.commit("setPlayer", player);
      errorMessage.value = "";
    })
    .catch((error) => {
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage.value = error.response.data.error;
      } else {
        errorMessage.value = "由于未知错误，加载失败……";
      }
    });
};

const linkPlayer = () => {
  axios
    .post(`${API_BASE_URL}/players`, {
      player: link_player.value,
    })
    .then((res) => {
      const player: Player = res.data;
      store.commit("setPlayer", player);
      errorMessage.value = "";
    })
    .catch((error) => {
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage.value = error.response.data.error;
      } else {
        errorMessage.value = "由于未知错误，加载失败……";
      }
    });
};

const loadPlay = (id: number) => {
  axios
    .get(`${API_BASE_URL}/plays/${id}`)
    .then(async (res) => {
      const play: Play = res.data;
      store.commit("loadGameState", play.state);
      showSLPopup.value = false;
      errorMessage.value = "";
      await store.dispatch("typeWriter", "【系统】存档读取成功！你回来啦！");
    })
    .catch((error) => {
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage.value = error.response.data.error;
      } else {
        errorMessage.value = "由于未知错误，加载失败……";
      }
    });
};

const deletePlay = (id: number) => {
  axios
    .delete(`${API_BASE_URL}/plays/${id}`, {
      data: {
        player: {
          id: player.value.id,
          email: player.value.email,
        },
      },
    })
    .then((res) => {
      const player: Player = res.data;
      store.commit("setPlayer", player);
      errorMessage.value = "";
    })
    .catch((error) => {
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage.value = error.response.data.error;
      } else {
        errorMessage.value = "由于未知错误，加载失败……";
      }
    });
};

const showAnonymousNote = ref(false);
const showUpdatePlayerPopup = ref(false);

const update_player = ref({
  name: "",
  anonymous: false,
});

const openUpdatePlayerPopup = () => {
  if (player.value) {
    const anonymousValue = player.value.anonymous === true || player.value.anonymous === "true" || player.value.anonymous === 1;

    update_player.value.name = player.value.name;
    update_player.value.anonymous = anonymousValue;

    showUpdatePlayerPopup.value = true;
  }
};

const updatePlayer = () => {
  if (!player.value) return;

  const updateData = {
    name: update_player.value.name,
    email: player.value.email,
    anonymous: update_player.value.anonymous,
  };

  axios
    .put(`${API_BASE_URL}/players/${player.value.id}`, {
      player: updateData,
      update: true,
    })
    .then((res) => {
      const updatedPlayer: Player = res.data;
      store.commit("setPlayer", updatedPlayer);
      showUpdatePlayerPopup.value = false;
      errorMessage.value = "";
    })
    .catch((error) => {
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage.value = error.response.data.error;
      } else {
        errorMessage.value = "由于未知错误，更新失败……";
      }
    });
};

const refreshPlayer = () => {
  if (!player.value?.id) {
    errorMessage.value = "玩家信息无效，请重新登录";
    return;
  }
  axios
    .put(`${API_BASE_URL}/players/${player.value.id}`, {
      player: {
        id: player.value.id,
        email: player.value.email,
      },
      update: false,
    })
    .then((res) => {
      const player: Player = res.data;
      store.commit("setPlayer", player);
      showUpdatePlayerPopup.value = false;
    })
    .catch((error) => {
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage.value = error.response.data.error;
      } else {
        errorMessage.value = "由于未知错误，加载失败……";
      }
    });
};

const logoutPlayer = () => {
  store.commit("setPlayer", null);
};

const timeToString = (time: string | Date) => {
  try {
    // 如果是字符串，尝试多种解析方式
    if (typeof time === "string") {
      // 尝试解析 ISO 格式
      let parsedTime = new Date(time);

      // 如果解析失败，尝试解析 created_at 格式
      if (isNaN(parsedTime.getTime())) {
        parsedTime = new Date(time.replace(" ", "T"));
      }

      // 如果仍然解析失败，返回原始字符串
      if (isNaN(parsedTime.getTime())) {
        console.warn("Invalid time format:", time);
        return time;
      }

      return new Intl.DateTimeFormat("default", {
        dateStyle: "long",
        timeStyle: "medium",
      }).format(parsedTime);
    }

    // 如果已经是 Date 对象
    return new Intl.DateTimeFormat("default", {
      dateStyle: "long",
      timeStyle: "medium",
    }).format(time);
  } catch (error) {
    console.error("Error parsing time:", error);
    return String(time);
  }
};

const showResetGameConfirmPopup = ref(false);

const resetGame = () => {
  store.commit("resetGame");
  isAtHome.value = false;
  showResetGameConfirmPopup.value = false;
  showSLPopup.value = false;
};

const sortedPlays = computed(() => {
  if (!player.value?.plays) return [];

  // 按创建时间倒序排序
  return [...player.value.plays].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.created_at).getTime();
    const dateB = new Date(b.createdAt || b.created_at).getTime();
    return dateB - dateA;
  });
});

watch(showSLPopup, (newValue, oldValue) => {
  if (newValue && player.value) {
    errorMessage.value = "加载中……";
    refreshPlayer();
    errorMessage.value = "";
  }
});
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
  color: #1e2228;
}

.player .focus-button-container .button-group {
  display: flex;
  align-items: center;
  margin: 0.25rem auto;
  justify-content: center;
}

.player-meta {
  display: flex;
  align-items: center;
  margin: 0.25rem auto;
  justify-content: center;
}

.player-label {
  font-weight: bold;
  margin-right: 4px;
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
  max-height: 50vh;
  overflow-y: auto;
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

.reset-game-button-container {
  margin: 0 auto 0.5rem;
  gap: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.reset-game-button-container button.reset-game-button {
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  /* border: none; */
  background: none;
  color: #1e2228;
  border-radius: 0.5rem;
  cursor: pointer;
  margin: 0 auto;
  width: 72%;
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

.game-ended-dialog .desc {
  font-size: 0.9rem;
  margin: 1rem auto;
  width: 90%;
  color: #4c4d55;
}

.game-ended-dialog button.restart-game-button {
  padding: 0.4rem 1rem;
  border: 2px solid #1e2228;
  background-color: #9d4842;
  color: #fff;
}

.game-ended-dialog button.continue-game-button {
  background-color: #262525;
  color: #fff;
  padding: 0.4rem 1rem;
  border: 2px solid #1e2228;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
}

.game-ended-dialog .reset-data-button-container {
  margin: 0.25rem auto;
  gap: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-ended-dialog button.reset-data-button {
  padding: 0.2rem;
  font-size: 0.8rem;
  border: none;
  background: none;
  color: #1e2228;
}

.game-ended-dialog button.confirm-button {
  margin-bottom: 0.75rem;
}

.game-ended-dialog button.cancel-button {
  margin-left: 0.75rem;
}

.game-ended-dialog .achievement {
  font-size: 0.8rem;
  margin: 1rem 0 0;
  color: #4c4d55;
}

.game-ended-dialog .hint {
  font-size: 0.7rem;
  color: #666;
  margin: 0.2rem 0 1rem;
}
</style>
