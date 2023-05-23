<template>
  <div class="drink-list">
    <div class="drink-item" v-for="drink in unlockedDrinks" :key="drink.id">
      <p>{{ drink.name }}</p>
      <span>¥ {{ drink.cost }}</span>
      <span class="drink-note">能量+{{ drink.energy }}</span>
      <span class="drink-note">心情+{{ drink.mood }}</span>
      <div class="select-buttons">
        <button @click="selectDrink(drink.name, 1)">买一杯</button>
        <button @click="selectDrink(drink.name, 2)">第二杯半价</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const unlockedDrinks = computed(() => store.state.unlockedDrinks);

const selectDrink = (drink: string, amount: number) => {
  store.dispatch('selectDrink', {drink, amount});
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
}

.drink-item {
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
  justify-content: space-around;
  width: 100%;
  margin-top: 10px;
}

.drink-item .select-buttons button {
  padding: 2px 10px;
  font-size: 0.9rem;
}

</style>