<template>
  <div class="food-list">
    <div class="food-item" v-for="food in unlockedFoods" :key="food.id">
      <p>{{ food.name }}</p>
      <span>¥ {{ food.cost }}</span>
      <span class="food-note">饱食度：{{ food.energy }}</span>
      <div class="select-buttons">
        <button @click="selectFood(food.name)">堂食</button>
        <button @click="packFood(food.name)">打包</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const unlockedFoods = computed(() => store.state.unlockedFoods);

const selectFood = (food: string) => {
  store.dispatch('selectFood', food);
}

const packFood = (food: string) => {
  store.dispatch('selectFood', food);
}
</script>

<style scoped>
.food-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}

.food-item {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 30%;
  height: 30%;
  border: 1px solid black;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
}

.food-item p {
  margin: 0;
}

.food-item p span {
  font-size: 0.8rem;
}

.food-note {
  font-size: 0.8rem;
}

.food-item .select-buttons {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 10px;
}

.food-item .select-buttons button {
  padding: 2px 10px;
  font-size: 0.9rem;
}

</style>