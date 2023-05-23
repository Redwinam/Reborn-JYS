<template>
  <div class="shop-list">
    <h2>特殊装备</h2>
    <div class="shop-item" v-for="item in specialItems" :key="item.name">
      <p>{{ item.name }}</p>
      <span>¥ {{ item.price }}</span>
      <span class="item-note">{{ item.desc }}</span>
      <button @click="purchaseItem(item.name, 1)" :disabled="inventory[item.name]">{{ inventory[item.name] ? '已拥有' : '购买' }}</button>
    </div>
    <h2>普通物品</h2>
    <div class="shop-item" v-for="item in normalItems" :key="item.name">
      <p>{{ item.name }}</p>
      <span>¥ {{ item.price }}</span>
      <span class="item-note">效果: {{ item.desc }}</span>
      <button @click="purchaseItem(item.name, 1)">购买</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { itemsList } from '../store/actions/purchaseItem'

const store = useStore()

const specialItems = computed(() => itemsList.filter(item => item.isSpecial));
const normalItems = computed(() => itemsList.filter(item => !item.isSpecial));
const inventory = computed(() => store.state.inventory);

const purchaseItem = (itemName: string, quantity: number) => {
  store.dispatch('purchaseItem', { itemName, quantity });
}
</script>


<style scoped>
.shop-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}

.shop-item {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 30%;
  border: 1px solid black;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
}

.shop-item p {
  margin: 0;
}

.shop-item p span {
  font-size: 0.8rem;
}

.item-note {
  font-size: 0.8rem;
}

.shop-item button {
  padding: 2px 10px;
  font-size: 0.9rem;
}

</style>
