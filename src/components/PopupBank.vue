<template>
<button class="button_buyGold" @click="showBuyGoldPopup = true">买金子！</button> / <button class="button_sellGold" @click="showSellGoldPopup = true">出售</button>
</template>

<script setup lang="ts">
import { showBuyGoldPopup, showSellGoldPopup } from './composables/gameRefs';
</script>

<style scoped>
.button_buyGold {
  /* background-color: #f1c40f;
  border: 1px solid #f1c40f; */
  background-color: #964742;
  border: 2px solid #1e2228;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.button_sellGold {
  background-color: #1e2228;
  border: 2px solid #1e2228;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

</style>