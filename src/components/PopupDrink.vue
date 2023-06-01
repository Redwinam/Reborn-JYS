<template>
  <div class="drink-list">
    <div class="drink-item" v-for="drink in allDrinks" :key="drink.name">
      <p>{{ drink.name }} <span>¥ {{ drink.cost }}</span></p>
      <span class="drink-note">能量 {{ drink.energy }} | 心情 {{ drink.mood }}</span>
      <div class="select-buttons">
        <button @click="drinkDrink(drink.name, 1)" class="one-button">买一杯</button>
        <button @click="drinkDrink(drink.name, 2)" class="two-button">第二杯半价</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

import { allDrinks } from '../store/eats'

const store = useStore()

const drinkDrink = (drink: string, amount: number) => {
  store.dispatch('drinkDrink', {drink, amount});
}
</script>

<style scoped>
.drink-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 10px;
}

.drink-item {
  flex-direction: column;
  justify-content: space-around;
  padding: 10px;
  flex: 0 0 calc(50% - 30px);
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  transition: all 0.3s ease-in-out;
}

.drink-item p {
  margin: 0;
}

.drink-item p span {
  font-size: 0.8rem;
}

.drink-note {
  font-size: 0.8rem;
}

.drink-item .select-buttons {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
  flex-wrap: wrap;
  gap: 5px;
}

.drink-item .select-buttons button {
  padding: 0.1rem 0.4rem;
  font-size: 0.8rem;
  white-space: nowrap;
}

.drink-item .select-buttons .one-button {
  border-radius: 6px;
  margin: 0;
  color: #d3c6c4;
  background-color: #1e2228;
}

.drink-item .select-buttons .two-button {
  border-radius: 6px;
  background-color: #d3c6c4;
  color: #1e2228;
  margin: 0;
}

</style>