<template>
  <div class="game-container">
    <div class="header">
      <h1>重生之我是姜云升</h1>
      <div class="round-info">
        轮次: {{ currentRound }} / {{ totalRounds }}
      </div>
    </div>

    <div class="attributes">
      <div class="attribute" v-for="(value, attribute) in attributes" :key="attribute">
        {{ attributeNames[attribute] }}: {{ value }}
      </div>
    </div>

    <!-- Separate pop-up for values -->
    <div class="values-popup" v-if="showValuesPopup">
      <h2>数值</h2>
      <div class="attribute" v-for="(value, attribute) in attributes" :key="attribute">
        {{ attribute }}: {{ value }}
      </div>
      <button @click="showValuesPopup = false">关闭</button>
    </div>

    <!-- Separate pop-up for achievements -->
    <div class="achievements-popup" v-if="showAchievementsPopup">
      <h2>成就</h2>
      <ul>
        <li v-for="achievement in achievements" :key="achievement">{{ achievement }}</li>
      </ul>
      <button @click="showAchievementsPopup = false">关闭</button>
    </div>

    <div class="actions">
      <h2>选择行动</h2>
      <button v-for="action in actions" :key="action" @click="performAction(action)">
        {{ action }}
      </button>
    </div>

    <!-- Button to show values pop-up -->
    <button class="show-values-button" @click="showValuesPopup = true">显示数值</button>

    <div class="achievements">
      <h2>成就</h2>
      <ul>
        <li v-for="achievement in achievements" :key="achievement">{{ achievement }}</li>
      </ul>
    </div>

    <!-- Button to show achievements pop-up -->
    <button class="show-achievements-button" @click="showAchievementsPopup = true">显示成就</button>

    <div class="events">
      <h2>特殊事件</h2>
      <ul>
        <li v-for="event in specialEvents" :key="event">{{ event }}</li>
      </ul>
    </div>
  </div>

  <div class="values">
        <button class="button" @click="showValuesPopup = true">数值说明</button>
        <transition name="fade">
          <div class="popup" v-if="showValuesPopup" @click.self="showValuesPopup = false">
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
          </div>
        </transition>
      </div>

      <footer class="footer">
      <p>制作人：xxx</p>
    </footer>

</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()

    const currentRound = computed(() => store.state.round)
    const totalRounds = computed(() => store.state.totalRounds)
    const attributes = computed(() => store.state.attributes)
    const achievements = computed(() => store.state.achievements)
    const specialEvents = computed(() => store.state.specialEvents)

    const actions = ['行动1', '行动2', '行动3', '行动4']

    const attributeNames = {
      talent: '才华',
      charm: '魅力',
      popularity: '人气',
      money: '金钱',
      freestyleskill: 'Freestyle',
      gamingSkill: '电竞',
      energy: '体力',
      mood: '心情',
      divine: '神性',
    }

    function performAction(action: string) {
      store.dispatch('performAction', { action })
    }

    // Use refs to control pop-up visibility
    const showValuesPopup = ref(false)
    const showAchievementsPopup = ref(false)

    return {
      currentRound,
      totalRounds,
      attributes,
      achievements,
      specialEvents,
      actions,
      performAction,
      attributeNames,
      showValuesPopup,
      showAchievementsPopup,
    }
  },
})
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
