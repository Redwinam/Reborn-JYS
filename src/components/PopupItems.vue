<template>
  <div>
    <ul class="inventory">
      <li class="item" v-for="(quantity, name) in inventory" :key="name">
        <div class="item-info">
          <div>
            <h4>{{ name }} <span> × {{ quantity.quantity }} {{ quantity.isFood? "份" : getQuantifier(String(name)) }}</span></h4>
          </div>
          <button v-if="quantity.isFood" @click="eatPackedFood(String(name))">吃掉</button>
        </div>
      </li>
    </ul>
    <p v-if="Object.keys(inventory).length === 0">（物品栏里空空如也）</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { getQuantifier } from '../store/actions/purchaseItem'

const store = useStore()
const inventory = computed(() => store.state.inventory)

const eatPackedFood = (food: string) => {
  store.dispatch('eatPackedFood', {food, quantity: 1});
}

</script>


<style scoped>
.inventory {
  padding: 0;
}

.item {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  transition: all 0.3s ease-in-out;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.item-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.item-info h4 span {
  margin: 0;
  font-size: 14px;
  font-weight: normal;
}

</style>
