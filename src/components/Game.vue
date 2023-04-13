<template>
  <div class="game-container">
    <div v-if="!gameEnded">
    <div class="header">
      <h1>重生之我是姜云升</h1>
      <div class="round-info">
        当前时间: {{ currentYear }}年{{ currentMonth }}月{{ currentPeriod }}
        <br />
        轮次: {{ currentRound }} / {{ totalRounds }}
      </div>
    </div>

    <div class="attributes">
      <div
        class="attribute"
        v-for="(value, attribute) in attributes"
        :key="attribute"
      >
        <div
          v-if="
            attribute === 'popularity' ||
            attribute === 'money' ||
            attribute === 'energy' ||
            attribute === 'mood'
          "
        >
          {{ attributeNames[attribute] }}: {{ value }}
        </div>
      </div>
    </div>



    
    <!-- Textbox for the text-based game -->
    <div class="textbox">
      <p>{{ textBoxMessage }}</p>
    </div>


    <div class="actions">
      <h2>选择行动</h2>
      <button v-for="action in actions" :key="action" @click="performAction(action)">
        {{ action }}
      </button>
      <button v-if="store.state.girlfriend" @click="accompanyGirlfriend">陪女朋友</button>

    </div>

    
    <!-- Separate layer for the "going out" action -->
    <transition name="fade">
      <div class="going-out-layer" v-if="showGoingOutLayer">
        <h2>外出</h2>
        <button v-for="location in locations" :key="location" @click="goToLocation(location)">
          {{ location }}
        </button>
        <button @click="showGoingOutLayer = false">返回</button>
      </div>
    </transition>

    <div class="achievements">
      <h2>成就</h2>
      <ul>
        <li v-for="achievement in achievements" :key="achievement">
          {{ achievement }}
        </li>
      </ul>
    </div>


    <div class="events">
      <h2>特殊事件</h2>
      <ul>
        <li v-for="event in specialEvents" :key="event">{{ event }}</li>
      </ul>
    </div>
  </div>


<footer class="footer">
  <button class="button" @click="showCharacterPopup = true">角色</button>
  <button class="button" @click="showItemsPopup = true">物品</button>
  <button class="button" @click="showSkillsPopup = true">技能</button>
  <button class="button" @click="showAchievementsPopup = true">成就</button>
  <p>制作人：@千啾略</p>
</footer>

<!-- Separate pop-up for values -->
<div class="values-popup" v-if="showCharacterPopup">
  <h2>数值</h2>
  <div
    class="attribute"
    v-for="(value, attribute) in attributes"
    :key="attribute"
  >
    {{ attributeNames[attribute] }}: {{ value }}
  </div>

  <h3 class="title">数值说明：</h3>
  <ul>
    <li><strong>才华：</strong>决定你的学习能力和创造力。</li>
    <li><strong>魅力：</strong>决定你的人缘和交际能力。</li>
    <li><strong>人气：</strong>决定你的知名度和影响力，分为红色人气和黑色人气。</li>
    <li><strong>金钱：</strong>决定你的经济实力。</li>
    <li><strong>Freestyle：</strong>决定你的说唱Freestyle实力。</li>
    <li><strong>电竞：</strong>决定你的电竞实力。</li>
    <li><strong>体力：</strong>决定你的身体素质和耐力。</li>
    <li><strong>心情：</strong>决定你的情绪和心态。</li>
    <li><strong>神性：</strong>决定你的神秘能力和超自然力量。</li>
  </ul>

  <button @click="showCharacterPopup = false">关闭</button>
</div>

<!-- Separate pop-up for achievements -->
<div class="achievements-popup" v-if="showAchievementsPopup">
  <h2>成就</h2>
  <ul>
    <li v-for="achievement in achievements" :key="achievement">
      {{ achievement }}
    </li>
  </ul>
  <button @click="showAchievementsPopup = false">关闭</button>
</div>

<div v-if="showBreakupDialog" class="breakup-dialog">
  <h2>女朋友想和你分手</h2>
  <p>你的女朋友想和你分手，你要如何应对？</p>
  <button @click="handleBreakup('挽回')">挽回</button>
  <button @click="handleBreakup('沉默')">沉默</button>
  <button @click="handleBreakup('拜拜就拜拜')">拜拜就拜拜</button>
</div>

<div v-if="gameEnded">
  <h2>游戏结束</h2>
  <p>{{ specialEndingAchievement.desc }}</p>
  <p>您已获得结局成就：{{ specialEndingAchievement.name }}</p>
  <button @click="restartGame">重新开始</button>
</div>


</div>


</template>
<script setup lang="ts">
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

interface AttributeNames {
  [key: string]: string;
}

const store = useStore()

const currentYear = computed(() => store.state.year)
const currentRound = computed(() => store.state.round)
const totalRounds = computed(() => store.state.totalRounds)
const attributes = computed(() => store.state.attributes)
const achievements = computed(() => store.state.achievements)
const specialEvents = computed(() => store.state.specialEvents)

const textBoxMessage = ref('这里是文字游戏的文字框，您可以根据游戏进程显示相应的文本。')


const locations = ['餐馆吃饭', '商场买衣服', '上山修行', '去比赛Battle']

const showGoingOutLayer = ref(false)
const showBreakupDialog = ref(false)

const actions = ['上课', '赚钱', '把妹', '休息', '外出']


const attributeNames: AttributeNames = {
  talent: '才华',
  charm: '魅力',
  popularity: '人气',
  money: '金钱',
  skill: '技能',
  freestyleskill: 'Freestyle',
  gamingSkill: '电竞',
  energy: '体力',
  mood: '心情',
  divine: '神性',
}

const gameEnded = computed(() => store.state.gameEnded)
const specialEndingAchievement = computed(() => store.state.specialEndingAchievement)


function performAction(action: string) {
  if (action === '外出') {
    if (store.state.attributes.energy >= 0) {
      showGoingOutLayer.value = true
    } else {
      textBoxMessage.value = '体力小于零，无法外出。'
    }
  } else {
    store.dispatch('performAction', { action })
    store.commit('updateAttribute', { attribute: 'energy', value: -10 })
    store.commit('incrementRound') // 增加这一行来使轮次+1

    switch (action) {
      case '上课':
        store.commit('updateAttribute', { attribute: 'talent', value: 1 })
        textBoxMessage.value = '你参加了一堂课，才华+1。'
        break
      case '赚钱':
        store.commit('updateAttribute', { attribute: 'money', value: 100 })
        textBoxMessage.value = '你努力工作，赚到了100金钱。'
        break
      case '把妹':
        if (!store.state.girlfriend) {
          store.commit('updateAttribute', { attribute: 'charm', value: 1 })
          if (store.state.flirtCount) {
            textBoxMessage.value = '你又成功地搭讪了一个姑娘，魅力+1。'
          } else {
            textBoxMessage.value = '你成功地搭讪了一个姑娘，魅力+1。'
          }

          store.commit('incrementFlirtCount')
          if (store.state.flirtCount >= 3) {
            const randomGirlfriend = store.state.girlfriendTypes[Math.floor(Math.random() * store.state.girlfriendTypes.length)]
            store.commit('setGirlfriend', randomGirlfriend)
            store.commit('resetFlirtCount')
            textBoxMessage.value = `恭喜！你交到了一个${randomGirlfriend.type}。`
          }
        } else {
          textBoxMessage.value = '你已经有女朋友了，不能再把妹。'
        }
        break
      case '休息':
        store.commit('updateAttribute', { attribute: 'energy', value: 60 })
        textBoxMessage.value = '你休息了一天，体力+60。'
        break
    }
  }

  if (store.state.attributes.energy <= -100) {
    store.commit('setGameEnded', { gameEnded: true, specialEndingAchievement: '姜云升虚弱' })
    store.commit('unlockAchievement', { 
      name: '姜云升虚弱', 
      desc: "你的体力被透支到了极限，由于极度虚弱，你不得不结束游戏。" 
    })
  }
}


  function accompanyGirlfriend() {
    if (store.state.accompanyCount < 14) {
      const energy = store.state.attributes.energy

      const girlfriendType = store.state.girlfriend.type
      const girlfriendEffect = store.state.girlfriend.effect
      
      if (energy >= 50) {
        store.commit('updateAttribute', { attribute: 'energy', value: - 50 })
        textBoxMessage.value = `你陪了${girlfriendType}，消耗了50点体力。`
        store.commit('setWeak', true)
        textBoxMessage.value += '你已进入虚弱状态。'
      } else {
        textBoxMessage.value = '体力不足，无法陪女朋友。'
      }

      store.commit('updateAttribute', { attribute: girlfriendEffect, value: Math.floor(Math.random() * 11) - 5 })
      store.commit('incrementAccompanyCount')

      textBoxMessage.value = `你陪了${girlfriendType}，你的${attributeNames[girlfriendEffect]}发生了变化。`
    } else {
      showBreakupDialog.value = true
    }
  }

function goToLocation(location: string) {
  textBoxMessage.value = '正在前往：' + location
}

// Add refs for character, items and skills pop-ups
const showCharacterPopup = ref(false)
const showItemsPopup = ref(false)
const showSkillsPopup = ref(false)

// Use refs to control pop-up visibility
const showValuesPopup = ref(false)
const showAchievementsPopup = ref(false)

// Calculate the current month and period
const currentMonth = computed(() => Math.ceil((currentRound.value % 36) / 3) || 12)
const currentPeriod = computed(() => {
  const period = (currentRound.value - 1) % 3
  return ['上旬', '中旬', '下旬'][period]
})

function handleBreakup(choice: string) {
    switch (choice) {
      case '挽回':
        // 添加挽回成功的概率较低的逻辑
        if (Math.random() < 0.3) {
          store.commit('resetAccompanyCount')
          textBoxMessage.value = '经过努力，你成功挽回了你们的感情。'
        } else {
          store.commit('setGirlfriend', null)
          textBoxMessage.value = '尽管你努力挽回，但你们最终还是分手了。'
        }
        break
      case '沉默':
        // 添加随机选择是否挽回感情的逻辑
        if (Math.random() < 0.5) {
          store.commit('resetAccompanyCount')
          textBoxMessage.value = '你的沉默让你们的感情得以修复。'
        } else {
          store.commit('setGirlfriend', null)
          textBoxMessage.value = '你的沉默让你们之间的感情破裂。'
        }
        break
      case '拜拜就拜拜':
        store.commit('setGirlfriend', null)
        store.commit('resetAccompanyCount')
        textBoxMessage.value = '你放手了，选择了拜拜就拜拜。'
        break
    }
    showBreakupDialog.value = false
  }

  function restartGame() {
  store.commit('resetGameState')
}

</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  font-family: 'Arial', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.attributes {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
}

.attribute {
  flex: 0 0 calc(50% - 8px);
  margin-bottom: 8px;
}

.actions {
  margin-bottom: 16px;
}

.events,
.achievements {
  width: 100%;
}

.events ul,
.achievements ul {
  padding-left: 16px;
}

/* Styling for pop-ups */
.values-popup,
.achievements-popup {
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
</style>
