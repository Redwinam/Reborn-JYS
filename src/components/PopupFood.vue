<template>
  <div class="food-list">
    <div class="food-item" v-for="food in unlockedFoods" :key="food.id">
      <div class="item-info">
        <div class="food-meta">
          <p>{{ food.name }}</p>
          <span>¥{{ food.cost }}</span>
        </div>
        <span class="food-note">饱食度+{{food.energy}}</span>
      </div>
      <div class="select-buttons">
        <div class="buttons-container">
          <button class="round-button" @click="eatFood(food.name)">堂食</button>
          <button class="left-button" @click="packFood(food.name,1 )">打包</button>
          <button class="right-button" @click="foodToPack = food.name; showQuantityPopup = true">+</button>
        </div>
      </div>
    </div>
  </div>

  <PopupSub :visible="showQuantityPopup" @close="showQuantityPopup = false">
    <div class="quantity-popup">
      <div>{{ foodToPack }} <input v-model.number="quantityToBuy" type="number" min="1"> 份</div>
      <div>
        <button @click="confirmPurchase">打包</button>
        <button class="cancel-button" @click="showQuantityPopup = false">取消</button>
      </div>
    </div>
  </PopupSub>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import PopupSub from '../components/PopupSub.vue'

const store = useStore()

const unlockedFoods = computed(() => store.state.unlockedFoods);

const eatFood = async (food: string) => {
  await store.dispatch('eatFood', food);
}

const packFood = async (food: string, quantity: number) => {
  await store.dispatch('packFood', {food, quantity});
}

let showQuantityPopup = ref(false);
let foodToPack = ref('');
let quantityToBuy = ref(1);

const confirmPurchase = () => {
  packFood( foodToPack.value, quantityToBuy.value );
  showQuantityPopup.value = false;
  quantityToBuy.value = 1;
}

</script>

<style scoped>
.food-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: flex-start;
  width: 100%;
  max-height: 75vh;
  overflow-y: auto;
  gap: 10px;
}

.food-item {
  flex: 0 0 calc(50% - 30px);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f9f9f9;
}

.food-item .item-info {
  width: 100%;
  line-height: 1rem;
}

.food-item .item-info p {
  margin: 0;
  line-height: 1.2;
  font-size: 0.9rem;
  font-weight: bold;
}

.food-item .food-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.food-item .food-meta span {
  font-size: 1.2rem;
  line-height: 1;
}

.food-note {
  font-size: 0.76rem;
  line-height: 16px;

}

.food-item .select-buttons {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 6px;
}

.food-item .select-buttons button {
  padding: 2px 10px;
  font-size: 0.9rem;
}

.food-item .item-info {
  text-align: left;
}

.food-item .item-info .item-note {
  margin: 0;
  font-size: 0.7rem;
}

.food-item .select-buttons {
  display: flex;
  flex-direction: column;  /* stack price and buttons vertically */
  align-items: flex-end;  /* align price and buttons to the right */
  justify-content: space-between; /* distribute price and buttons vertically */
}

.food-item .select-buttons span {
  white-space: nowrap;
  font-size: 0.8rem;
  line-height: 1.2;
  font-weight: bold;
}

.food-item .select-buttons .buttons-container {
  display: flex;
}

.food-item .select-buttons .buttons-container button {
  padding: 0.1rem 0.4rem;
  font-size: 0.8rem;
  border: none;
  color: #d3c6c4;
  background-color: #1e2228;
  border-radius: 0;
}

.food-item .select-buttons .buttons-container .round-button {
  border-radius: 6px;
  white-space: nowrap;
  margin-right: 6px;
}

.food-item .select-buttons .buttons-container .left-button {
  padding: 0.1rem 0.3rem 0.1rem 0.4rem;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  white-space: nowrap;
  margin: 0;
}

.food-item .select-buttons .buttons-container .right-button {
  padding: 0.1rem 0.3rem;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  background-color: #d3c6c4;
  color: #1e2228;
  margin: 0;
}

.quantity-popup {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  gap: 10px;
}

.quantity-popup input {
  width: 50px;
  margin: 6px 0;
  padding: 6px;
  border: 2px solid #1e2228;
}

.quantity-popup button {
  padding: 5px 10px;
  border: none;
  border-radius: 6px;
  background-color: #1e2228;
  color: #d3c6c4;
  font-size: 0.8rem;
  white-space: nowrap;
}

.quantity-popup button.cancel-button {
  background-color: #d3c6c4;
  color: #1e2228;
  margin-left: 10px;
}
</style>