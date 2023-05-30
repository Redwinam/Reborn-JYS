<template>
<div class="achievement-container">
  <div v-for="(achievementGroup, key) in classifiedAchievements" :key="key">
    <h3>{{ key }}</h3>
    <ul class="achievements">
      <li class="achievement" v-for="achievement in achievementGroup" :key="achievement.name" :class="achievement.unlocked ? 'achievement-unlocked' : ''" @click="showAchievementCondition(achievement)" >
        <div class="achievement-info">
          <h4 v-if="achievement.unlocked || term > 1">{{ achievement.name }}</h4>
          <h4 v-else>?</h4>
          <p v-if="achievement.unlocked">{{ achievement.desc }}</p>
          <p v-else class="grey-out">（未解锁）</p>
          <p v-if="achievement.unlocked && achievement.unlockTerm && term > 1" class="grey-out" >（解锁于第{{ achievement.unlockTerm }}周目）</p>
        </div>
      </li>
    </ul>
  </div>

  <p style="display: none;">制作人：@千啾略</p>
</div>

<Popup :visible = "showAchievementNotePopup" @close = "showAchievementNotePopup = false" class="achievement-note">
  <p class="desc">点击成就可以查看成就提示。一周目后每周目游戏结束后可以点击查看+1条未解锁的成就🏆的具体达成条件提示，当前剩余可解锁成就提示数量：{{ term - store.state.unlockedAchievementConditions.length -1 }}。</p>
  <div class="achievement-note-buttons">
    <button class="confirm-button" @click="showAchievementNotePopup = false">了解！</button>
  </div>
</Popup>

<Popup :visible = "showUnlockAchievementConditionConfirmPopup" @close = "showUnlockAchievementConditionConfirmPopup = false" class="achievement-note">
  <p class="desc" v-if="term > 1">每周目游戏结束后可以查看+1条未解锁的成就🏆的具体达成条件提示，当前剩余可解锁成就提示数量：{{ term - store.state.unlockedAchievementConditions.length - 1 }}。<template v-if="term - store.state.unlockedAchievementConditions.length - 1">请问要查看【{{currentUnlockConditionAchievement.name}}】的成就提示吗？</template></p>
  <p class="desc" v-else>一周目后每周目游戏结束后可以点击查看+1条未解锁的成就🏆的具体达成条件提示，当前可以先继续游玩随机体验噢！</p>
  <div class="achievement-note-buttons" v-if="term - store.state.unlockedAchievementConditions.length > 1">
    <button class="confirm-button" @click="unlockAchievementCondition(currentUnlockConditionAchievement)">确认</button>
    <button class="cancel-button" @click="showUnlockAchievementConditionConfirmPopup = false">取消</button>
  </div>
  <div class="achievement-note-buttons" v-else>
    <button class="confirm-button" @click="showUnlockAchievementConditionConfirmPopup = false">了解！</button>
  </div>
</Popup>

<Popup :visible = "showAchievementConditionPopup" @close = "showAchievementConditionPopup = false" class="achievement-note">
  <p class="desc">提示：{{ currentUnlockConditionAchievement.condition }}。</p>
  <div class="achievement-note-buttons">
    <button class="confirm-button" @click="showAchievementConditionPopup = false">了解！</button>
  </div>
</Popup>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import Popup from '../components/Popup.vue'
import { Achievement } from '../store/achievements'
import { showAchievementNotePopup } from '../components/composables/gameRefs'

const store = useStore()
const achievements = computed(() => store.state.achievements)
const term = computed(() => store.state.term)

const classifiedAchievements = computed(() => {
  const groups = {
    '结局成就': [],
    '事件成就': [],
    '其他成就': []
  } as Record<string, Achievement[]>
  achievements.value.forEach((achievement: Achievement) => {
    if (achievement.ending) {
      groups['结局成就'].push(achievement)
    } else if (achievement.event) {
      groups['事件成就'].push(achievement)
    } else {
      groups['其他成就'].push(achievement)
    }
  })
  return groups
})

const showUnlockAchievementConditionConfirmPopup = ref(false)
const showAchievementConditionPopup = ref(false)
const currentUnlockConditionAchievement = ref({} as Achievement)
const showAchievementCondition = (achievement: Achievement) => {
  currentUnlockConditionAchievement.value = achievement
  if (achievement.unlocked || store.state.unlockedAchievementConditions.includes(achievement.name)) {
    showAchievementConditionPopup.value = true
  } else {
    showUnlockAchievementConditionConfirmPopup.value = true
  }
}

const unlockAchievementCondition = (achievement: Achievement) => {
  store.commit('unlockAchievementCondition', achievement.name)
  showUnlockAchievementConditionConfirmPopup.value = false
  showAchievementConditionPopup.value = true
}

</script>

<style scoped>

.achievement-container {
  max-height: 75vh;
  overflow-y: auto;
}

.achievement-container h3 {
  margin: 0;
}

.achievements {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0;
}

.achievement {
  flex: 0 0 calc(50% - 30px);
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 12px;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.achievement-badge {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.achievement-badge img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  margin: 0;
  font-size: 0.96rem;
  font-weight: bold;
}

.achievement-info p {
  margin: 0;
  font-size: 0.8rem;
}

.grey-out {
  color: #ccc;
}

.achievement-note .desc {
  font-size: 0.9rem;
  margin: 2rem auto 1rem;
  width: 90%;
  color: #4c4d55;
}

.achievement-note button {
  padding: 0.4rem 1rem;
  border: 2px solid #1e2228;
  margin-bottom: 1rem;
}

.achievement-note button.confirm-button {
  background-color: #9d4842;
  color: #fff;
}

.achievement-note button.cancel-button {
  margin-left: 0.75rem;
}
</style>
