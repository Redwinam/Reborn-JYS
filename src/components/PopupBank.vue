<template>
<button class="button_buyGold" @click="showBuyGoldPopup = true">买金子！</button> / <button class="button_sellGold" @click="showSellGoldPopup = true">出售</button>
<p class="bank-note">当前拥有：￥{{ attributes['money'] }}  | {{ attributes['gold'] }}枚金条</p>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { showBuyGoldPopup, showSellGoldPopup } from './composables/gameRefs';

const store = useStore();
const attributes = computed(() => store.state.attributes);
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

.bank-note {
  color: #1e2228;
  margin-top: 0.5rem;
  margin-bottom: 0;
  padding-bottom: 1rem;
  border-bottom: 1px dashed #666;
}

</style>