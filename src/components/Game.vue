<template>
<div id="game-container" class="game-container">
  <transition name="fade">
    <div class="home-background" v-if="isAtHome"></div>
  </transition>

  <div v-if="!gameEnded">

  <div class="header">

    <!-- <h1>重生<small>之我是姜云升</small></h1> -->
    <div class="round-info">
      {{ currentYear }}年{{ currentMonth }}月{{ currentPeriod }} · 轮次: {{ currentRound }} / {{ totalRounds }}
    </div>

  </div>
    <!-- <h1>重生<small>之我是姜云升</small>之我是姜云升之我是姜云升之我是姜云升之我是姜云升之我是姜云升之我是姜云升之我是姜云升</h1> -->

  <div class="attributes">

    <div><span>{{ attributeNames['popularity'] }}</span> 红 {{ attributes['popularity']['red'] }} / 黑 {{ attributes['popularity']['black'] }}</div>
    <div><span>{{ attributeNames['money'] }}</span> {{ attributes['money'] }}</div>
    <div v-if="attributes['energy'] >= 0"><span> {{ attributeNames['energy'] }}</span> {{ attributes['energy'] }}</div>
    <div v-else><span class="weak">体力透支</span> {{ attributes['energy'] }}（虚弱！）</div>
    <div><span>{{ attributeNames['mood'] }}</span> {{ attributes['mood'] }}</div>
  </div>

  <!-- Textbox for the text-based game -->
  <div class="textbox">
    <p id="textboxText">今天你打算……</p>
  </div>

  <div class="actions">
    <!-- <button v-for="action in actions" :key="action" @click="performAction(action)">
      {{ action }}
    </button> -->
    
    <button @click="performAction('回家')" class="action-button action-back-home" v-if="!isAtHome"></button>
    <button @click="performAction('出去鬼混')" class="action-button action-hang-out" v-if="!isAtHome"></button>
    <button @click="performAction('外出')" class="action-button action-go-out" v-if="!isAtHome"></button>
    <button @click="performAction('赚钱')" class="action-button action-make-money" v-if="!isAtHome"></button>

    <button @click="performAction('睡觉休息')" class="action-button action-sleep-rest" v-if="isAtHome"></button>
    <button @click="performAction('写歌')" class="action-button action-write-song" v-if="isAtHome"></button>

    <button v-if="isAtHome" @click="isAtHome = false; typewriter('今天你打算……')" class="action-button action-back"></button>

    <button v-if="store.state.girlfriend" @click="accompanyGirlfriend" class="action-button action-accompany-girlfriend"></button>

  </div>

  <!-- Separate layer for the "going out" action -->
  <transition name="fade">
    <div class="going-out-layer" v-if="showGoingOutLayer">
      <h2>外出</h2>
      <button v-for="location in locations" :key="location" @click="goToLocation(location)">
        {{ location }}
      </button>
      <button @click="showGoingOutLayer = false; typewriter('今天你打算……')">返回</button>
    </div>
  </transition>

  <div class="events">
    <h2>特殊事件</h2>
    <ul>
      <li v-for="event in specialEvents" :key="event">{{ event }}</li>
    </ul>
  </div>

  
<footer class="footer">
  <button class="button" @click="showCharacterPopup = true">角色</button>
  <button class="button" @click="showItemsPopup = true">物品</button>
  <button class="button" @click="showSkillsPopup = true">技能</button>
  <button class="button" @click="showAchievementsPopup = true">成就</button>
</footer>

<Popup title="写歌" :visible="showSongWritingDialog" @close="showSongWritingDialog = false">
  <song-writing-popup />
</Popup>

<breakup-dialog :showDialog="showBreakupDialog" @closeDialog="showBreakupDialog = false"  @typewriter="typewriter" />

<Popup title="角色" :visible="showCharacterPopup" @close="showCharacterPopup = false">
  <character-popup />
</Popup>

<Popup title="成就" :visible="showAchievementsPopup" @close="showAchievementsPopup = false">
  <achievements-popup />
</Popup>



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
import { mapActions } from 'vuex';

import { computed, ref } from 'vue'

import Popup from '../components/Popup.vue'
import AchievementsPopup from '../components/AchievementsPopup.vue'
import CharacterPopup from '../components/CharacterPopup.vue'

import SongWritingPopup from './SongWritingPopup.vue'
import BreakupDialog from '../components/BreakupDialog.vue'

import { attributeNames } from '../store/attributes'


const store = useStore()

const currentYear = computed(() => store.state.year)
const currentRound = computed(() => store.state.round)
const totalRounds = computed(() => store.state.totalRounds)
const attributes = computed(() => store.state.attributes)
const specialEvents = computed(() => store.state.specialEvents)

const locations = ['餐馆吃饭', '商场买衣服', '上山修行', '去比赛Battle']

const showGoingOutLayer = ref(false)
const showBreakupDialog = ref(false)
const showSongWritingDialog = ref(false)



// const actions = ['上课', '赚钱', '出去鬼混', '休息', '回家', '外出', '写歌']

const isAtHome = ref(false)

const gameEnded = computed(() => store.state.gameEnded)
const specialEndingAchievement = computed(() => store.state.specialEndingAchievement)

mapActions(['performAction', 'typeWriter'])

const typewriter = (message: string | string[]) => {
  store.dispatch('typeWriter', message)
}

function loadGame() {
  typewriter('今天你打算……')
}

function performAction(action: string) {
  if (action === '外出') {
    if (store.state.attributes.energy >= 0) {
      showGoingOutLayer.value = true
      typewriter('打算出发去……')
    } else {
      typewriter('体力小于零，无法外出。')
    }
  } else {
    store.dispatch('performAction', { action })
    store.commit('updateAttribute', { attribute: 'energy', value: -10 })
    store.commit('incrementRound') // 增加这一行来使轮次+1

    switch (action) {
      case '上课':
        store.commit('updateAttribute', { attribute: 'talent', value: 1 })
        typewriter('姜云升参加了一堂课，才华+1。')
        break
      case '赚钱':
        store.commit('updateAttribute', { attribute: 'money', value: 100 })
        typewriter('姜云升努力工作，赚到了100金钱。')
        break
        
      case '出去鬼混':
        if (!store.state.girlfriend) {
          store.commit('updateAttribute', { attribute: 'charm', value: 1 })
          const toMessage = ref([] as string[])
          if (store.state.flirtCount) {
            toMessage.value.push('姜云升又成功地搭讪了一个姑娘，魅力+1。')
          } else {
            toMessage.value.push('姜云升成功地搭讪了一个姑娘，魅力+1。')
          }

          store.commit('incrementFlirtCount')
          if (store.state.flirtCount >= 3) {
            const randomGirlfriend = store.state.girlfriendTypes[Math.floor(Math.random() * store.state.girlfriendTypes.length)]
            store.commit('setGirlfriend', randomGirlfriend)
            store.commit('resetFlirtCount')

            toMessage.value.push(`恭喜！姜云升交到了一个${randomGirlfriend.type}。`)
          }

          typewriter(toMessage.value)
        } else {
          typewriter('姜云升已经有女朋友了，不能再出来鬼混把妹了。快去陪陪你的女朋友吧！')
        }
        break

      case '回家':
        isAtHome.value = true
        typewriter('姜云升回到了家。')
        break
      case '睡觉休息':
        if (store.state.weak) {
          store.commit('updateAttribute', { attribute: 'energy', value: 60 - store.state.attributes.energy })
          typewriter(['姜云升睡了17个小时，体力+60。', '姜云升不虚弱啦！'])
        } else {
          store.commit('updateAttribute', { attribute: 'energy', value: 60 })
          typewriter('姜云升睡了17个小时，体力+60。')
        }
        
        break
      case '写歌':
        showSongWritingDialog.value = true
        break
    }
  }

  if (store.state.attributes.energy <= -100) {
    store.commit('setGameEnded', { gameEnded: true, specialEndingAchievementId: 'jiangyunsheng-weak' })
    store.commit('unlockAchievement', 'jiangyunsheng-weak')
  }
}


function accompanyGirlfriend() {
  if (store.state.accompanyCount < 8) {
    const energy = store.state.attributes.energy

    const girlfriendType = store.state.girlfriend.type
    const girlfriendEffect = store.state.girlfriend.effect

    const toMessage = ref([] as string[])

    if (store.state.isWeak) {
      toMessage.value.push(`姜云升处于虚弱状态，无法陪女朋友。`)
      typewriter(toMessage.value)
      return
    }

    console.log(store.state.accompanyCount)

    if (store.state.accompanyCount < 1) {
      store.commit('updateAttribute', { attribute: 'energy', value: - 50 })
      store.commit('incrementAccompanyCount')
      toMessage.value.push(`姜云升陪了${girlfriendType}，消耗了50点体力。`)
      
      store.commit('setWeak', true)
      toMessage.value.push('姜云升已进入虚弱状态。')

      store.commit('updateAttribute', { attribute: girlfriendEffect, value: Math.floor(Math.random() * 11) })
      toMessage.value.push(`姜云升的${attributeNames[girlfriendEffect]}属性上升了。`)

      typewriter(toMessage.value)

    } else {
      
      if (energy >= 50) {
        store.commit('updateAttribute', { attribute: 'energy', value: - 50 })
        store.commit('incrementAccompanyCount')
        toMessage.value.push(`姜云升陪了${girlfriendType}，消耗了50点体力。`)
        
        store.commit('updateAttribute', { attribute: girlfriendEffect, value: Math.floor(Math.random() * 11) })
        toMessage.value.push(`姜云升的${attributeNames[girlfriendEffect]}属性上升了。`)

        typewriter(toMessage.value)

      } else if (energy >= 20) {
        store.commit('updateAttribute', { attribute: 'energy', value: -20 })
        store.commit('incrementAccompanyCount')
        toMessage.value.push(`姜云升陪了${girlfriendType}，消耗了20点体力。`)

        store.commit('updateAttribute', { attribute: girlfriendEffect, value: Math.floor(Math.random() * 6) })
        toMessage.value.push(`姜云升的${attributeNames[girlfriendEffect]}属性上升了。`)

        typewriter(toMessage.value)

      } else {
        toMessage.value.push(`姜云升体力不足，无法陪女朋友。`)
        typewriter(toMessage.value)
        return
      }
    }

  } else {
    showBreakupDialog.value = true
  }
}

function goToLocation(location: string) {
  typewriter('正在前往：' + location)
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

function restartGame() {
  store.commit('resetGameState')
}

</script>

<style scoped>
#game-container {
  position: relative;
  height: 100vh; /* 高度设置为 100vh */
  background-size: cover;
  background-position: top center;
  margin: 0 auto; /* 水平居中 */
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  background-image: url('src/assets/bg_just.png');

}
.home-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('src/assets/bg_sleep.png');
  background-size: cover;
  background-position: top center;
  /* z-index: -1; */
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.header {
  /* display: flex;
  justify-content: space-between;
  width: 100%; */
  background: url('src/assets/header.png') no-repeat;
  background-size: contain;
  background-position: top center;
  padding: 0.6vh 0.6vh 1.2vh;
  position: relative;
}
.round-info {
  color: #f7f6f6;
  text-align: center;
  margin: 0 auto;
  line-height: 2;
}

.attributes {
  display: block;
  position: absolute;
  top: 22%;
  left: 70%;
  text-align: left;
  font-size: 0.9rem;
  color: #94847d;
  font-weight: 500;

}
.attributes span {
  background-color: #433e41;
  color: #fcfcfc;
  padding: 0.1rem;
}

.attributes span.weak {
  background-color: #9d4842;
}

.attribute {
  /* flex: 0 0 calc(50% - 8px); */
  margin-bottom: 8px;

}

.textbox {
  position: relative;
  top: 36vh;
  width: 45vh;
  /* height:10vh; */
  margin-bottom: 16px;
  margin: 6vh 6vh;
  border: 2px solid #262525;
  border-radius: 8px;
  background-color: #fcfcfc;
  /* padding: 1rem */
}

.textbox p {
  margin: 1rem;
}

.actions {
  margin-bottom: 16px;
}

.action-button {
  cursor: pointer;
  position: absolute;
}

.action-back-home {
  background: url('src/assets/back-home.png') center / contain no-repeat;
  width: 46.5px;
  height: 78.5px;
  top: 57%;
  left: 20%;
}

.action-go-out {
  background: url('src/assets/go-out.png') center / contain no-repeat;
  width: 50px;
  height: 123px;
  top: 70%;
  left: 72%;
}

.action-hang-out {
  background: url('src/assets/hang-out.png') center / contain no-repeat;
  width: 50px;
  height: 136px;
  top: 69%;
  left: 11%;
}

.action-sleep-rest {
  background: url('src/assets/sleep-rest.png') center / contain no-repeat;
  width: 46px;
  height: 135px;
  top: 24%;
  left: 18%;
}

.action-write-song {
  background: url('src/assets/write-song.png') center / contain no-repeat;
  width: 47px;
  height: 111px;
  top: 64%;
  left: 36%;
}

.action-make-money {
  background: url('src/assets/make-money.png') center / contain no-repeat;
  width: 47px;
  height: 96.5px;
  top: 60%;
  left: 36%;
}

.action-back {
  background: url('src/assets/back.png') center / contain no-repeat;
  width: 44px;
  height: 105px;
  top: 68%;
  left: 76%;
}

.action-accompany-girlfriend {
  background: url('src/assets/accompany-girlfriend.png') center / contain no-repeat;
  width: 50px;
  height: 159px;
  top: 72%;
  left: 21%;
}

.events,
.achievements {
  width: 100%;

  display: none;
}

.events ul,
.achievements ul {
  padding-left: 16px;
}

/* Styling for pop-ups */
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 16px;
  border: 1px solid black;
  z-index: 1;
}

.values-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.values-popup .attribute {
  margin-bottom: 8px;
}

.achievements-popup ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.achievements-popup li {
  margin-bottom: 8px;
}

/* Styling for pop-up buttons */
.show-values-button,
.show-achievements-button {
  margin-bottom: 16px;
}
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  /* background: url('src/assets/menu.png') no-repeat center/cover; */
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
  background-color: #1e2228;
}
footer button {
  /* background-color: #1e2228  191c22; */
  background-color: #1e2228;
  color: #d3c6c4;
  border: none;
  outline: none;
  cursor: pointer;
}
</style>
