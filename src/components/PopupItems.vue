<template>
  <div>
    <ul class="inventory">
      <li class="item" v-for="(quantity, name) in inventory" :key="name">
        <div class="item-info">
          <h4>{{ name }}</h4>
          <p> {{ quantity }} 个</p>
        </div>
      </li>
    </ul>
    <p v-if="Object.keys(inventory).length === 0">物品栏里空空如也</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const inventory = computed(() => store.state.inventory)

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

.item:hover {
  transform: scale(1.05);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.item-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.item-info p {
  margin: 0;
  font-size: 14px;
}

</style>
