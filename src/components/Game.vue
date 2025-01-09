<template>
  <div id="game-container" class="game-container">
    <transition name="fade">
      <div class="home-background" v-if="isAtHome"></div>
    </transition>
    <transition name="fade">
      <div class="going-out-background" v-if="isGoingOut"></div>
    </transition>

    <div>
      <div class="header-container" v-if="!gameEnded">
        <div class="header" :class="currentTerm > 1 ? 'header-l' : ''">
          <div class="round-info">
            <span v-if="!showStartGameDialog"
              >{{ currentYear }}年{{ currentMonth }}月{{ currentPeriod }} · 轮次: {{ currentRound }} / {{ totalRounds }}<template v-if="currentTerm > 1"> · 第{{ arabicToChinese(currentTerm) }}周目</template></span
            >
            <span v-else>1996年6月1日 · 轮次: {{ currentRound }} / {{ totalRounds }}</span>
          </div>
        </div>
      </div>

      <div v-if="!showStartGameDialog && !gameEnded" class="attributes" :class="isGoingOut ? 'going-out-attributes' : ''">
        <div>
          <span class="attribute-name">{{ attributeNames["popularity"] }}</span
          ><span class="attribute-number">红 {{ Math.round(attributes["popularity"]["red"]) }} / 黑 {{ Math.round(attributes["popularity"]["black"]) }}</span>
        </div>
        <div>
          <span class="attribute-name">{{ attributeNames["money"] }}</span
          ><span class="attribute-number"
            >{{ Math.round(attributes["money"]) }}
            <span v-if="signedAgency" @click="!isTyping && checkUnsignAgency()"
              ><br />（二八分<small>{{ leftUnsignAgencyMonth }}/12月</small>）</span
            ></span
          >
        </div>
        <div v-if="attributes['energy'] >= 0">
          <span class="attribute-name">{{ attributeNames["energy"] }}</span
          ><span class="attribute-number">{{ attributes["energy"] }}<template v-if="weak">（虚弱！）</template></span>
        </div>
        <div v-else>
          <span class="attribute-name weak">体力透支</span><span class="attribute-number">{{ attributes["energy"] }} <template v-if="weak">（虚弱！）</template></span>
        </div>
        <div>
          <span class="attribute-name">{{ attributeNames["mood"] }}</span
          ><span class="attribute-number">{{ attributes["mood"] }}</span>
        </div>
        <div v-if="drunk > 0">
          <span class="attribute-name weak">醉酒</span><span class="attribute-number">× {{ drunk }}</span>
        </div>
      </div>

      <div class="textbox" :class="showStartGameDialog ? 'hide' : ''">
        <p id="textboxText"></p>
        <button @click="handleHistoryClick" class="text-history-button" :disabled="isLoading">
          {{ isLoading ? '游戏加载中……' : '文本记录' }}
        </button>
      </div>

      <div class="actions" v-if="!showStartGameDialog && !gameEnded">
        <button @click="performAction('回家')" class="action-button action-back-home" v-if="!isAtHome && !isGoingOut" :disabled="isTyping"></button>
        <button @click="performAction('出去鬼混')" class="action-button action-hang-out" v-if="!isAtHome && !isGoingOut" :disabled="isTyping"></button>
        <button @click="performAction('外出')" class="action-button action-go-out" v-if="!isAtHome && !isGoingOut" :disabled="isTyping"></button>
        <button @click="performAction('去上课')" class="action-button action-study" v-if="!isAtHome && !isGoingOut" :disabled="isTyping"></button>
        <button @click="performAction('赚钱')" class="action-button action-make-money" v-if="!isAtHome && !isGoingOut" :disabled="isTyping"></button>

        <button @click="performAction('睡觉休息')" class="action-button action-sleep-rest" v-if="isAtHome" :disabled="isTyping"></button>
        <button @click="typewriter('的确不如。')" class="action-button action-guahua" v-if="isAtHome && haveGuaHua" :disabled="isTyping"></button>
        <button @click="performAction('开直播')" class="action-button action-onlive" v-if="isAtHome" :disabled="isTyping"></button>
        <button @click="performAction('打游戏')" class="action-button action-gaming" v-if="isAtHome" :disabled="isTyping"></button>
        <button @click="performAction('写歌')" class="action-button action-write-song" v-if="isAtHome" :disabled="isTyping"></button>
        <button @click="showSLPopup = true" class="action-button action-sl" v-if="isAtHome" :disabled="isTyping"></button>
        <button
          v-if="isAtHome"
          @click="
            isAtHome = false;
            typewriter('今天你打算……');
          "
          class="action-button action-back"
          :disabled="isTyping"
        ></button>

        <button @click="goToLocation('去吃点东西')" class="action-button action-eat" v-if="isGoingOut" :disabled="isTyping"></button>
        <button @click="goToLocation('去喝点东西')" class="action-button action-drink" v-if="isGoingOut" :disabled="isTyping"></button>
        <button @click="goToLocation('买东西')" class="action-button action-shopping" v-if="isGoingOut" :disabled="isTyping"></button>
        <button @click="goToLocation('地下钱庄之暴富金铺')" class="action-button action-buy-gold" v-if="isGoingOut && !store.getters.unlockedAchievement('汤臣亿品')" :disabled="isTyping"></button>
        <button @click="goToLocation('交易所')" class="action-button action-exchange" v-if="isGoingOut && store.getters.unlockedAchievement('汤臣亿品')" :disabled="isTyping"></button>
        <button @click="goToLocation('公司')" class="action-button action-agency" v-if="isGoingOut && signedAgency" :disabled="isTyping"></button>
        <button @click="goToLocation('风炎文化')" class="action-button action-fengyan" v-if="isGoingOut && openFengyan" :disabled="isTyping"></button>

        <button @click="goToLocation('去剪头发')" class="action-button action-cut-hair" v-if="isGoingOut" :disabled="isTyping"></button>
        <button @click="goToLocation('上山修行')" class="action-button action-dao" v-if="isGoingOut" :disabled="isTyping"></button>
        <button @click="goToLocation('Underground')" class="action-button action-underground" v-if="isGoingOut" :disabled="isTyping"></button>
        <button @click="goToLocation('Battle大赛')" class="action-button action-battle" v-if="isGoingOut && isBattleOpen()" :disabled="isTyping"></button>
        <button
          v-if="isGoingOut"
          @click="
            isGoingOut = false;
            typewriter('今天你打算……');
          "
          class="action-button action-back going-out-back"
          :disabled="isTyping"
        ></button>
        <button v-if="store.state.girlfriend && !isGoingOut" @click="accompanyGirlfriend" class="action-button action-accompany-girlfriend" :disabled="isTyping"></button>
      </div>

      <Dialog :visible="showEventDialog" @close="showEventDialog = false"><dialog-event /></Dialog>
      <Dialog :visible="showBreakupDialog" @close="showBreakupDialog = false"><dialog-breakup /></Dialog>
      <Dialog :visible="showUpgradeSkillDialog" @close="showUpgradeSkillDialog = false"><dialog-upgrade-skill /></Dialog>
      <Dialog :visible="showUnsignAgencyDialog" @close="showUnsignAgencyDialog = false"><dialog-unsign-agency /></Dialog>
      <Dialog :visible="showBattleDialog" @close="showBattleDialog = false"><dialog-battle /></Dialog>

      <footer class="footer">
        <button class="button" @click="showCharacterPopup = true">角色</button>
        <button class="button" @click="showItemsPopup = true">物品</button>
        <button class="button" @click="showSkillsPopup = true">技能</button>
        <button class="button" @click="showAchievementsPopup = true">成就</button>
      </footer>

      <Popup
        title="客官今天打算吃点什么？"
        :visible="showFoodPopup"
        @close="
          showFoodPopup = false;
          store.dispatch('incrementRound');
        "
        ><popup-food
      /></Popup>
      <Popup
        title="买喝的！"
        :visible="showDrinkPopup"
        @close="
          showDrinkPopup = false;
          store.dispatch('incrementRound');
        "
        ><popup-drink
      /></Popup>
      <Popup
        title="买东西！"
        :visible="showShopPopup"
        @close="
          showShopPopup = false;
          store.dispatch('incrementRound');
        "
        ><popup-shop
      /></Popup>
      <Popup title="交易所" :visible="showExchangePopup" @close="showExchangePopup = false"><popup-exchange /></Popup>
      <Popup title="地下钱庄" :visible="showBankPopup" @close="showBankPopup = false"><popup-bank /></Popup>
      <Popup title="风炎文化" :visible="showFengyanPopup" @close="showFengyanPopup = false"><popup-fengyan /></Popup>

      <Popup title="写歌" :visible="showSongWritingDialog" @close="showSongWritingDialog = false"><popup-song-writing /></Popup>
      <Popup title="角色" :visible="showCharacterPopup" @close="showCharacterPopup = false"><popup-character /></Popup>
      <Popup title="物品" :visible="showItemsPopup" @close="showItemsPopup = false"><popup-items /></Popup>
      <Popup title="技能" :visible="showSkillsPopup" @close="showSkillsPopup = false"><popup-skills /></Popup>
      <Popup title="成就" :visible="showAchievementsPopup" @close="showAchievementsPopup = false"><popup-achievements /></Popup>

      <PopupSubGold></PopupSubGold>
      <PopupSubUnderground></PopupSubUnderground>
      <PopupDao></PopupDao>

      <popup-shard :shardName="shardName"></popup-shard>

      <Popup title="历史记录" :visible="showTextHistoryPopup" @close="showTextHistoryPopup = false">
        <div class="textHistory" ref="textHistoryContainer">
          <p v-for="text in textHistory" :key="text">{{ text }}</p>
        </div>
      </Popup>
    </div>

    <Dialog :visible="showStartGameDialog" @close="showStartGameDialog = false"><dialog-start-game /></Dialog>

    <PopupSL></PopupSL>

    <Dialog :visible="showGameEndDialog" class="game-ended-dialog">
      <h2>{{ gameEnded ? "游戏结束" : "游戏结局" }}</h2>
      <p class="desc" v-if="specialEndingAchievement">{{ specialEndingAchievement.desc }}</p>
      <p class="desc" v-else-if="currentEndings.length">
        12年游戏时间结束，您在本周目达成结局【{{
          Object.entries(currentEndings)
            .map((ending) => ending[1])
            .join("】、【")
        }}】，愿星辰庇佑于我们！
      </p>
      <div class="game-ended-dialog-buttons">
        <button class="continue-game-button" v-if="!gameEnded" @click="showGameEndDialog = false">继续本轮！</button>
        <button class="restart-game-button" @click="restartGame(false)">重新开始</button>
        <div class="reset-data-button-container">
          <button class="reset-data-button" @click="showGameEndConfirmPopup = true">重置数据</button>
          <HelpCircle :size="12" @click="showGameEndNotePopup = true"></HelpCircle>
        </div>
      </div>
      <p class="achievement" v-if="specialEndingAchievement">您已获得结局成就：【{{ specialEndingAchievement.name }}】</p>
      <p class="hint">（重启后保留已获得的成就）</p>
    </Dialog>

    <Popup :visible="showGameEndNotePopup" @close="showGameEndNotePopup = false" class="game-ended-dialog">
      <p class="desc">
        游戏默认重新开启是为类Roguelite模式，保留当前角色属性的20%⚡️以及所有已解锁的收集品🌟。如玩家希望游戏结局时重置数据，将清空所有属性⚡️和收集品🌟，但依旧会保留已获得的成就🏆，并解锁成就条件。希望玩得开心！
      </p>
      <div class="game-ended-dialog-buttons">
        <button class="restart-game-button confirm-button" @click="showGameEndNotePopup = false">了解！</button>
      </div>
    </Popup>

    <Popup :visible="showGameEndConfirmPopup" @close="showGameEndConfirmPopup = false" class="game-ended-dialog">
      <h2>确认重置游戏数据吗？</h2>
      <p class="desc">
        游戏默认重新开启是为类Roguelite模式，保留当前角色属性的20%⚡️以及所有已解锁的收集品🌟。如玩家希望游戏结局时重置数据，将清空所有属性⚡️和收集品🌟，但依旧会保留已获得的成就🏆，并解锁成就条件。希望玩得开心！
      </p>
      <div class="game-ended-dialog-buttons">
        <button class="restart-game-button" @click="restartGame(true)">重新开始</button>
        <button class="confirm-button cancel-button" @click="showGameEndConfirmPopup = false">取消</button>
      </div>
    </Popup>
  </div>
</template>
<script setup lang="ts">
import { useStore } from "vuex";
import { computed, ref, nextTick, watch, onMounted } from "vue";
import { HelpCircle } from "lucide-vue-next";

import Popup from "../components/Popup.vue";

import PopupAchievements from "../components/PopupAchievements.vue";
import PopupCharacter from "../components/PopupCharacter.vue";
import PopupItems from "../components/PopupItems.vue";
import PopupSkills from "../components/PopupSkills.vue";
import PopupSongWriting from "../components/PopupSongWriting.vue";

import PopupFood from "../components/PopupFood.vue";
import PopupDrink from "../components/PopupDrink.vue";
import PopupShop from "../components/PopupShop.vue";
import PopupBank from "../components/PopupBank.vue";
import PopupSubGold from "../components/PopupSubGold.vue";
import PopupExchange from "../components/PopupExchange.vue";
import PopupSubUnderground from "../components/PopupSubUnderground.vue";
import PopupDao from "../components/PopupDao.vue";
import PopupFengyan from "../components/PopupFengyan.vue";
import PopupShard from "../components/PopupShard.vue";

import PopupSL from "../components/PopupSL.vue";

import Dialog from "../components/Dialog.vue";
import DialogBreakup from "../components/DialogBreakup.vue";
import DialogEvent from "../components/DialogEvent.vue";
import DialogUpgradeSkill from "../components/DialogUpgradeSkill.vue";
import DialogUnsignAgency from "../components/DialogUnsignAgency.vue";
import DialogBattle from "../components/DialogBattle.vue";
import DialogStartGame from "../components/DialogStartGame.vue";

import { attributeNames } from "../store/attributes";
import {
  isAtHome,
  isGoingOut,
  showBreakupDialog,
  showEventDialog,
  showSongWritingDialog,
  showGameEndDialog,
  showUnsignAgencyDialog,
  showBattleDialog,
  showFoodPopup,
  showDrinkPopup,
  showShopPopup,
  showUpgradeSkillDialog,
  showBankPopup,
  showStartGameDialog,
  showSLPopup,
  showFengyanPopup,
  showExchangePopup,
  shardName,
  isTyping,
} from "./composables/gameRefs";
import { BattleResult } from "../store/battle";
import { preloadAssets } from '../utils/preload';

const convertStyle = () => {
  document.body.style.setProperty("height", `${window.innerHeight}px`);
};
window.addEventListener("resize", convertStyle);
window.addEventListener("DOMContentLoaded", convertStyle);

const store = useStore();

const currentTerm = computed(() => store.state.term);
const currentYear = computed(() => store.state.year);
const currentRound = computed(() => store.state.round);
const totalRounds = computed(() => store.state.totalRounds);
const gameEnded = computed(() => store.state.gameEnded);

const attributes = computed(() => store.state.attributes);
const weak = computed(() => store.state.weak);
const drunk = computed(() => store.state.drunk);
const signedAgency = computed(() => store.state.signedAgency);
const openFengyan = computed(() => store.state.openFengyan);

const haveGuaHua = computed(() => {
  return store.state.inventory["挂画"] && store.state.inventory["挂画"].quantity > 0;
});

const textHistory = computed(() => {
  const history = store.state.textHistory;
  const filteredHistory = history.map((record: string) => record.replace(/<\/?small>/g, ""));
  return filteredHistory.length > 99 ? filteredHistory.slice(-99) : filteredHistory;
});

const showTextHistoryPopup = ref(false);
const textHistoryContainer = ref<HTMLDivElement | null>(null);

watch(showTextHistoryPopup, async (newValue) => {
  if (newValue) {
    await nextTick();
    if (textHistoryContainer.value) {
      textHistoryContainer.value.scrollTop = textHistoryContainer.value.scrollHeight;
    }
  }
});

const specialEndingAchievement = computed(() => store.state.specialEndingAchievement);
const currentEndings = computed(() => store.state.currentEndings);

const accompanyGirlfriend = () => {
  store.dispatch("accompanyGirlfriend");
};
const goToLocation = (location: string) => {
  store.dispatch("goToLocation", location);
};
const performAction = (action: string) => {
  store.dispatch("performAction", action);
};
const typewriter = async (message: string | string[]) => {
  await store.dispatch("typeWriter", message);
};

const showCharacterPopup = ref(false);
const showItemsPopup = ref(false);
const showSkillsPopup = ref(false);
const showAchievementsPopup = ref(false);

const showGameEndNotePopup = ref(false);
const showGameEndConfirmPopup = ref(false);

const leftUnsignAgencyMonth = computed(() => Math.max(Math.ceil((36 - (store.state.round - store.state.signedAgencyRound)) / 3), 0));
const checkUnsignAgency = async () => {
  if (leftUnsignAgencyMonth.value > 0) {
    typewriter("签约公司后需要1年后才可以解约，当前剩余" + leftUnsignAgencyMonth.value + "个月。");
  } else {
    await typewriter("姜云升可以和原来签约的公司解约了。要去公司看看吗？");
    await store.dispatch("waitAndType", 1000);
    isAtHome.value = false;
    isGoingOut.value = true;
    goToLocation("公司");
  }
};

// Calculate the current month and period
const currentMonth = computed(() => Math.ceil((currentRound.value % 36) / 3) || 12);
const currentPeriod = computed(() => {
  const period = (currentRound.value - 1) % 3;
  return ["上旬", "中旬", "下旬"][period];
});

const isBattleOpen = () => {
  // 当前year的battle的状态 不为 end 且 当前月份为 9-12月
  const isEnd = Array.isArray(store.state.battleResults) && store.state.battleResults.find((battleResult: BattleResult) => battleResult.year === currentYear.value)?.end;
  return currentMonth.value >= 9 && currentMonth.value <= 12 && !isEnd;
};

// loadGame();

function arabicToChinese(number: number): string {
  const chineseNumbers = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  if (number <= 10) {
    return chineseNumbers[number];
  } else {
    return number.toString();
  }
}

async function restartGame(resetData: boolean) {
  showGameEndDialog.value = false;
  store.commit("resetGameState", resetData);
  if (document.getElementById("textboxText")) {
    await store.dispatch("typeWriter", "【系统】你重生啦！");
  }
}

// 保存游戏数据到localStorage
function saveGameData(data: any) {
  localStorage.setItem("gameData", JSON.stringify(data));
}

// 从localStorage读取游戏数据
function loadGameData() {
  const data = localStorage.getItem("gameData");
  return data ? JSON.parse(data) : null;
}

const isLoading = ref(true);

const handleHistoryClick = () => {
  if (!isLoading.value) {
    showTextHistoryPopup.value = true;
  }
};

onMounted(async () => {
  const savedGameData = loadGameData();

  if (savedGameData) {
    try {
      store.commit("loadGameState", savedGameData);
      if (store.state.term == 1 && store.state.round == 1) {
        showStartGameDialog.value = true;
      } else if (store.state.gameEnded) {
        showGameEndDialog.value = true;
      } else if (document.getElementById("textboxText")) {
        await store.dispatch("typeWriter", "【系统】你回来啦！");
      }
    } catch (e) {
      console.error("加载游戏数据时发生错误:", e);
      saveGameData(store.state);
      if (document.getElementById("textboxText")) {
        await store.dispatch("typeWriter", "【系统】读取本地游戏记录失败，你回来了但没完全回来！（不影响线上存档）");
      }
    }
  } else {
    showStartGameDialog.value = true;
  }

  store.subscribe(() => {
    const copiedState = JSON.parse(JSON.stringify(store.state));
    delete copiedState.textHistory; // 删除不想存储的部分
    saveGameData(copiedState);
  });

  // 添加预加载逻辑
  try {
    await preloadAssets();
  } catch (error) {
    console.error('资源预加载失败:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
@import "./Game.css";
</style>
