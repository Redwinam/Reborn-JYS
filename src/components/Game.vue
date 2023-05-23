<template>
<div id="game-container" class="game-container">
  <transition name="fade">
    <div class="home-background" v-if="isAtHome"></div>
  </transition>
  <transition name="fade">
    <div class="going-out-background" v-if="isGoingOut"></div>
  </transition>

  <div v-if="!gameEnded">

  <div class="header">
    <div class="round-info">
      {{ currentYear }}年{{ currentMonth }}月{{ currentPeriod }} · 轮次: {{ currentRound }} / {{ totalRounds }}<template v-if="currentTerm>1"> · 第{{ arabicToChinese(currentTerm) }}周目</template>
    </div>
  </div>
    <!-- <h1>重生<small>之我是姜云升</small>之我是姜云升之我是姜云升之我是姜云升之我是姜云升之我是姜云升之我是姜云升之我是姜云升</h1> -->

  <div class="attributes" :class="isGoingOut? 'going-out-attributes' : ''">

    <div><span>{{ attributeNames['popularity'] }}</span> 红 {{ attributes['popularity']['red'] }} / 黑 {{ attributes['popularity']['black'] }}</div>
    <div><span>{{ attributeNames['money'] }}</span> {{ attributes['money'] }}</div>
    <div v-if="attributes['energy'] >= 0"><span> {{ attributeNames['energy'] }}</span> {{ attributes['energy'] }}<template v-if="weak">（虚弱！）</template></div>
    <div v-else><span class="weak">体力透支</span> {{ attributes['energy'] }} <template v-if="weak">（虚弱！）</template> </div>
    <div><span>{{ attributeNames['mood'] }}</span> {{ attributes['mood'] }}</div>
  </div>

  <!-- Textbox for the text-based game -->
  <div class="textbox">
    <p id="textboxText">今天你打算……</p>
  </div>

  <div class="actions">
    
    <button @click="performAction('回家')" class="action-button action-back-home" v-if="!isAtHome && !isGoingOut"></button>
    <button @click="performAction('出去鬼混')" class="action-button action-hang-out" v-if="!isAtHome && !isGoingOut"></button>
    <button @click="performAction('外出')" class="action-button action-go-out" v-if="!isAtHome && !isGoingOut"></button>
    <button @click="performAction('赚钱')" class="action-button action-make-money" v-if="!isAtHome && !isGoingOut"></button>

    <button @click="performAction('睡觉休息')" class="action-button action-sleep-rest" v-if="isAtHome"></button>
    <button @click="performAction('开直播')" class="action-button action-onlive" v-if="isAtHome"></button>
    <button @click="performAction('打游戏')" class="action-button action-gaming" v-if="isAtHome"></button>
    <button @click="performAction('写歌')" class="action-button action-write-song" v-if="isAtHome"></button>
    <button v-if="isAtHome" @click="isAtHome = false; typewriter('今天你打算……')" class="action-button action-back"></button>

    <button @click="goToLocation('去吃点东西')" class="action-button action-eat" v-if="isGoingOut"></button>
    <button @click="goToLocation('去喝点东西')" class="action-button action-drink" v-if="isGoingOut"></button>
    <button @click="goToLocation('买东西')" class="action-button action-shopping" v-if="isGoingOut"></button>
    <button @click="goToLocation('去剪头发')" class="action-button action-cut-hair" v-if="isGoingOut">去剪头发</button>
    <button @click="goToLocation('上山修行')" class="action-button action-dao" v-if="isGoingOut"></button>
    <button @click="goToLocation('Underground')" class="action-button action-underground" v-if="isGoingOut"></button>
    <!-- <button @click="performAction('去吃点东西')" class="action-button action-eat" v-if="isGoingOut">去吃点东西</button> -->
    <button v-if="isGoingOut" @click="isGoingOut = false; typewriter('今天你打算……')" class="action-button action-back going-out-back"></button>

    <button v-if="store.state.girlfriend && !isGoingOut" @click="accompanyGirlfriend" class="action-button action-accompany-girlfriend"></button>

  </div>


<Dialog :visible="showEventDialog" @close="showEventDialog = false"><dialog-event /></Dialog>
<Dialog :visible="showBreakupDialog" @close="showBreakupDialog = false"><dialog-breakup /></Dialog>
<Dialog :visible="showUpgradeSkillDialog" @close="showUpgradeSkillDialog = false"><dialog-upgrade-skill /></Dialog>
  
<footer class="footer">
  <button class="button" @click="showCharacterPopup = true">角色</button>
  <button class="button" @click="showItemsPopup = true">物品</button>
  <button class="button" @click="showSkillsPopup = true">技能</button>
  <button class="button" @click="showAchievementsPopup = true">成就</button>
</footer>

<Popup title="客官今天打算吃点什么？" :visible="showFoodPopup" @close="showFoodPopup = false; store.dispatch('incrementRound');"><popup-food /></Popup>
<Popup title="买喝的！" :visible="showDrinkPopup" @close="showDrinkPopup = false; store.dispatch('incrementRound'); "><popup-drink /></Popup>
<Popup title="买东西！" :visible="showShopPopup" @close="showShopPopup = false; store.dispatch('incrementRound');"><popup-shop /></Popup>

<Popup title="写歌" :visible="showSongWritingDialog" @close="showSongWritingDialog = false"><popup-song-writing /></Popup>
<Popup title="角色" :visible="showCharacterPopup" @close="showCharacterPopup = false"><popup-character /></Popup>
<Popup title="技能" :visible="showSkillsPopup" @close="showSkillsPopup = false"><popup-skills /></Popup>
<Popup title="成就" :visible="showAchievementsPopup" @close="showAchievementsPopup = false"><popup-achievements /></Popup>



</div>

<div class="popup" v-if="gameEnded" >
  <h2>游戏结束</h2>
  <p>{{ specialEndingAchievement.desc }}</p>
  <p>您已获得结局成就：{{ specialEndingAchievement.name }}</p>
  <button @click="restartGame">重新开始</button>
  <p>（重启后保留已获得的成就）</p>
</div>

</div>


</template>
<script setup lang="ts">
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

import Popup from '../components/Popup.vue'
import PopupAchievements from '../components/PopupAchievements.vue'
import PopupCharacter from '../components/PopupCharacter.vue'
import PopupSkills from '../components/PopupSkills.vue'
import PopupSongWriting from '../components/PopupSongWriting.vue'

import PopupFood from '../components/PopupFood.vue'
import PopupDrink from '../components/PopupDrink.vue'
import PopupShop from '../components/PopupShop.vue'

import Dialog from '../components/Dialog.vue'
import DialogBreakup from '../components/DialogBreakup.vue'
import DialogEvent from '../components/DialogEvent.vue'
import DialogUpgradeSkill from '../components/DialogUpgradeSkill.vue'

import { attributeNames } from '../store/attributes'

import { isAtHome, isGoingOut, 
  showBreakupDialog, showEventDialog, showSongWritingDialog,
  showFoodPopup, showDrinkPopup, showShopPopup, showUpgradeSkillDialog
} from './composables/gameRefs';


const store = useStore()

const currentTerm = computed(() => store.state.term)
const currentYear = computed(() => store.state.year)
const currentRound = computed(() => store.state.round)
const totalRounds = computed(() => store.state.totalRounds)
const attributes = computed(() => store.state.attributes)
const specialEvents = computed(() => store.state.specialEvents)
const weak = computed(() => store.state.weak)

const gameEnded = computed(() => store.state.gameEnded)
const specialEndingAchievement = computed(() => store.state.specialEndingAchievement)

const accompanyGirlfriend = () => { store.dispatch('accompanyGirlfriend') }
const goToLocation = (location: string) => { store.dispatch('goToLocation', location) }
const performAction = (action: string) => { store.dispatch('performAction', action) }
const typewriter = (message: string | string[]) => { store.dispatch('typeWriter', message) }


function loadGame() {
  typewriter('今天你打算……')
}

// Add refs for character, items and skills pop-ups
const showCharacterPopup = ref(false)
const showItemsPopup = ref(false)
const showSkillsPopup = ref(false)
const showAchievementsPopup = ref(false)

// Calculate the current month and period
const currentMonth = computed(() => Math.ceil((currentRound.value % 36) / 3) || 12)
const currentPeriod = computed(() => {
  const period = (currentRound.value - 1) % 3
  return ['上旬', '中旬', '下旬'][period]
})

// loadGame();

function arabicToChinese(number: number): string {
  const chineseNumbers = [
    '零',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十',
  ];
  if (number <= 10) {
    return chineseNumbers[number];
  } else {
    return number.toString();
  }
}

function restartGame() {
  store.commit('resetGameState')
}

</script>

<style scoped>
  @import './Game.css';
</style>
