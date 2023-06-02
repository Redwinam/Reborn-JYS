<template>

<PopupSub title="买金条！" :visible="showBuyGoldPopup" @close="showBuyGoldPopup = false">
  <div class="buy-gold">
    <div class="gold-amount">
      <label for="gold-amount">购买数量</label>
      <input type="number" id="gold-amount" min="1" max="10000" v-model="goldAmount" /> 克
      <div class="gold-price">/ 总价：￥{{ goldAmount * 360 }}</div>
    </div>
    <p v-if="goldAmount * 360 > attributes.money" class="error-message">金钱不足，买不起这么多金条</p>
    <div class="button-group">
      <button class="button_buyGold" :disabled="goldAmount * 360 > attributes.money" @click="buyGold">购买</button>
      <button class="button_cancel" @click="showBuyGoldPopup = false">取消</button>
    </div>
    <p class="note-message">1枚金条 = 360金钱，金条每轮次享有固定的6%利息收益。金价与现实无关，仅代表游戏效果，不构成投资建议。</p>
  </div>
</PopupSub>

<PopupSub title="出售金条" :visible="showSellGoldPopup" @close="showSellGoldPopup = false">
  <div class="buy-gold">
    <div class="gold-amount">
      <label for="gold-amount">出售数量</label>
      <input type="number" id="gold-amount" min="1" max="10000" v-model="goldAmount" /> 克
      <div class="gold-price">/ 获得：¥{{ goldAmount * 360 }}</div>
    </div>
    <p v-if="goldAmount > attributes.gold" class="error-message">没有这么多金条可供卖出</p>
    <div class="button-group">
      <button class="button_sellGold" :disabled="goldAmount > attributes.gold" @click="sellGold">出售</button>
      <button class="button_cancel" @click="showSellGoldPopup = false">取消</button>
    </div>
    <p class="note-message">1枚金条 = 360金钱，金条每轮次享有固定的6%利息收益。金价与现实无关，仅代表游戏效果，不构成投资建议。</p>
  </div>
</PopupSub>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import PopupSub from '../components/PopupSub.vue'
import { showBankPopup, showBuyGoldPopup, showSellGoldPopup } from './composables/gameRefs';

const store = useStore()
const attributes = computed(() => store.state.attributes);

const goldAmount = ref(1)
async function buyGold() {
  if (goldAmount.value * 360 <= attributes.value.money) {
    store.commit('buyGold', goldAmount.value)
    showBuyGoldPopup.value = false
    if (showBankPopup.value) {
      await store.dispatch('typeWriterPopup', '姜云升花了' + goldAmount.value * 360 + '金钱，购买了' + goldAmount.value + '克金条。')
    }
  }
}

async function sellGold() {
  if (goldAmount.value <= attributes.value.gold) {
    store.commit('buyGold', -goldAmount.value)
    showSellGoldPopup.value = false
    if (showBankPopup.value) {
      await store.dispatch('typeWriterPopup', '姜云升卖出了' + goldAmount.value + '克金条，获得了' + goldAmount.value * 360 + '金钱。')
    }
  }
}

</script>

<style scoped>


.button_buyGold {
  background-color: #964742;
  border: none;
  color: #fff;
  border-radius: 4px;
  padding: 5px 7px;
  font-size: 0.8em;
  cursor: pointer;
  /* margin-left: 10px; */
  transition: background-color 0.3s ease;
}

.button_sellGold {
  background-color: #1e2228;
  border: none;
  color: #fff;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.8em;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s ease;
}

.span_sellGold {
  font-size: 0.8rem;
  cursor: pointer;
  margin-right: 6px;
}

.popup-sub .button_buyGold, .popup-sub .button_sellGold {
  padding: 5px 10px;
}

.bug-gold {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 auto;
}

.gold-amount {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin: 10px 0;
  white-space: nowrap;
}

.gold-amount input {
  width: 2.5rem;
  margin: 2px;
  padding: 6px;
  border: 2px solid #1e2228;
}


.gold-price {
  font-size: 0.8em;
  color: #666;
}


.button_cancel {
  background-color: #ddd;
  border: none;
  color: #333;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.8em;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s ease;
}

.note-message {
  font-size: 0.7em;
  color: #666;
  border-top: 1px dashed #666;
  padding: 12px 0 0;
  margin-top: 30px;
}
.error-message {
  color: #964742;
  font-weight: bold;
  font-size: 0.8rem;
  margin: 0 0 20px 0;
}

</style>
