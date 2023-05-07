<template>
  <div class="food-list">
    <div class="food-item" v-for="food in unlockedFoods" :key="food.id">
      <p>{{ food.name }} <span>¥ {{ food.cost }}</span></p>
      <span class="food-note">饱食度：{{ food.energy }}</span>
      <button @click="selectFood(food.name)">点菜</button>
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

.food-item button {
  width: 100%;
  height: 30%;
  border-radius: 10px;
  background-color: #f0f0f0;
  border: 1px solid black;
  cursor: pointer;
  padding: 5px;
}

</style>