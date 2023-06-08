<template>
<div class="exchange">
  <button class="btn-exchange north" @click="goToBank">交易所北市·钱庄</button>
  <button class="btn-exchange west" @click="goToInvestment">交易所西市·投资</button>
  <button class="btn-exchange center" @click="goToMarketplace">交易所大厅·摆摊</button>
  <button class="btn-exchange east" @click="goToStockMarket">交易所东市·股市</button>
  <button class="btn-exchange south" @click="goToRealEstate">交易所南市·地产</button>
</div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { showBankPopup, showRealEstatePopup, showStockMarketPopup, showInvestmentPopup, showExchangePopup, isTyping } from './composables/gameRefs';

const store = useStore();

const goToRealEstate = async () => {
  // showRealEstatePopup.value = true;
  // showExchangePopup.value = false;
  await store.dispatch('typeWriterPopup', '【系统】这里是本游戏的不动产交易中心（暂未开放），姜云升可以在这里买房买地，达成【重生之地产大亨】DLC成就，实现啥也不干尽收房租的理想生活！')
};

const goToStockMarket = async () => {
  // showStockMarketPopup.value = true;
  // showExchangePopup.value = false;
  await store.dispatch('typeWriterPopup', '【系统】这里是本游戏的证券交易所（暂未开放），姜云升可以在这里当韭菜（啊不是），姜云升可以在这里运用智慧达成【重生之绝对股神】DLC成就！')
};

const goToInvestment = async () => {
  await store.dispatch('typeWriterPopup', '【系统】正在前往交易所西市·投资中心……')
  showInvestmentPopup.value = true;
  showExchangePopup.value = false;
};

const goToBank = async () => {
  await store.dispatch('typeWriterPopup', '【系统】正在前往交易所北市·地下钱庄之暴富金铺')
  showBankPopup.value = true;
  showExchangePopup.value = false;
};

const goToMarketplace = async () => {
  await store.dispatch('typeWriterPopup', '【系统】这里是交易所大厅（暂未开放），姜云升可以在这里摆摊算命，达成【重生之大预言家】DLC成就！')
};

</script>

<style scoped>
.exchange {
  display: flex;
  flex-direction: column;
  /* flex-wrap: wrap; */
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 0.5rem;
  border-bottom: 1px dashed #4c4d55;
  padding-bottom: 1.2rem;
}

.btn-exchange {
  padding: 0.4rem 1rem;
  border: 2px solid #1e2228;
  background-color: #9d4842;
  color: #fff;
}
/* 
.north {
  position: absolute;
  top: 20px;
/* } */

.south {
  background-color: #35292d;
}

.west {
  background-color: #86413d;
  margin-left: -6rem;
}

.east {
  background-color: #4c3031;
  margin-right: -6rem;
}

.center {
  background-color: #633736;
} 
</style>
