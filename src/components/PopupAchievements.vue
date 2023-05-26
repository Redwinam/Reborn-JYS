<template>
    <div v-for="(achievementGroup, key) in classifiedAchievements" :key="key">
      <h3>{{ key }}</h3>
      <ul class="achievements">
        <li class="achievement" v-for="achievement in achievementGroup" :key="achievement.name">
          <!-- <div class="achievement-badge">
            <img :src="getAchievementBadge(achievement)" alt="" />
          </div> -->
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

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

import { Achievement } from '../store/achievements'

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

const getAchievementBadge = (achievement: Achievement) => {
  // 根据成就返回相应的徽章图片
  return `./assets/badges/${achievement.name}.png`
}

</script>

<style scoped>
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
  font-size: 16px;
  font-weight: bold;
}

.achievement-info p {
  margin: 0;
  font-size: 14px;
}

.grey-out {
  color: #ccc;
}
</style>
