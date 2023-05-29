<template>
  <div class="shop-container">
    <h3>特殊装备</h3>
    <div class="shop-lists">
      <div class="shop-list" v-for="list in [specialItemsLeft, specialItemsRight]" :key="list[0]?.name">
        <div class="shop-item" v-for="item in list" :key="item.name">
          <div class="item-info">
            <p>{{ item.name }}</p>
            <span class="item-note">{{ item.desc }}</span>
          </div>
          <div class="purchase-options">
            <span>¥ {{ item.price }}</span>
            <div class="buttons-container">
              <button class="only-button" @click="purchaseItem(item.name, 1)" :disabled="inventory[item.name]">{{ inventory[item.name] ? '已拥有' : '购买' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h3>普通物品</h3>
    <div class="shop-lists">
      <div class="shop-list" v-for="list in [normalItemsLeft, normalItemsRight]" :key="list[0]?.name">
        <div class="shop-item" v-for="item in list" :key="item.name">
          <div class="item-info">
            <p>{{ item.name }}</p>
            <span class="item-note">{{ item.desc }}</span>
          </div>
          <div class="purchase-options">
            <span>¥ {{ item.price }}</span>
            <div class="buttons-container">
              <button class="left-button" @click="purchaseItem(item.name, 1)">购买</button>
              <button class="right-button" @click="itemToBuy = item.name; showQuantityPopup = true">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <PopupSub :visible="showQuantityPopup" @close="showQuantityPopup = false">
    <div class="quantity-popup">
      {{ itemToBuy }} <input v-model.number="quantityToBuy" type="number" min="1"> {{ getQuantifier(itemToBuy) }}
      <button @click="confirmPurchase">确认购买</button>
      <button class="cancel-button" @click="showQuantityPopup = false">取消</button>
    </div>
  </PopupSub>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { itemsList, getQuantifier } from '../store/actions/purchaseItem'
import PopupSub from './PopupSub.vue'

const store = useStore()

const specialItems = computed(() => itemsList.filter(item => item.isSpecial));
const normalItems = computed(() => itemsList.filter(item => !item.isSpecial));

const splitArrayInHalf = (arr: Array<any>) => {
  const mid = Math.ceil(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  return [left, right];
};

const [specialItemsLeft, specialItemsRight] = splitArrayInHalf(specialItems.value);
const [normalItemsLeft, normalItemsRight] = splitArrayInHalf(normalItems.value);

const inventory = computed(() => store.state.inventory);

const purchaseItem = (itemName: string, quantity: number) => {
  store.dispatch('purchaseItem', { itemName, quantity });
}

let showQuantityPopup = ref(false);
let itemToBuy = ref('');
let quantityToBuy = ref(1);

const confirmPurchase = () => {
  store.dispatch('purchaseItem', { itemName: itemToBuy.value, quantity: quantityToBuy.value });
  showQuantityPopup.value = false;
  quantityToBuy.value = 1;
}

</script>

<style scoped>
.shop-container {
  max-height: 75vh;
  overflow-y: auto;
}

.shop-lists {
  display: flex;
  justify-content: space-between;
}

.shop-list {
  width: 49%;
  display: flex;
  flex-direction: column;
  gap: 0px;
  padding: 0;
  line-height: 1;
}

.shop-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #ddd;
}

.shop-list .shop-item:last-child {
  border-bottom: none;
}

.shop-item .item-info {
  text-align: left;
}

.shop-item .item-info p {
  margin: 0;
  line-height: 1.2;
  font-size: 0.8rem;
  font-weight: bold;
}

.shop-item .item-info .item-note {
  margin: 0;
  font-size: 0.7rem;
}

.shop-item .purchase-options {
  display: flex;
  flex-direction: column;  /* stack price and buttons vertically */
  align-items: flex-end;  /* align price and buttons to the right */
  justify-content: space-between; /* distribute price and buttons vertically */
}

.shop-item .purchase-options span {
  white-space: nowrap;
  font-size: 0.8rem;
  line-height: 1.2;
  font-weight: bold;
}

.shop-item .purchase-options .buttons-container {
  display: flex;
}

.shop-item .purchase-options .buttons-container button {
  padding: 2px 8px;
  font-size: 0.8rem;
  border: none;
  color: #d3c6c4;
  background-color: #1e2228;
  border-radius: 0;
}

.shop-item .purchase-options .buttons-container .only-button {
  border-radius: 6px;
  white-space: nowrap;
}

.shop-item .purchase-options .buttons-container .only-button:disabled {
  background-color: #d3c6c4;
  color: #1e2228
}

.shop-item .purchase-options .buttons-container .left-button {
  padding: 2px 6px 2px 8px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  white-space: nowrap;
  margin: 0;
}

.shop-item .purchase-options .buttons-container .right-button {
  padding: 2px 6px 2px 6px;
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
}

.quantity-popup input {
  width: 50px;
  margin: 10px;
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
  margin-left: 12px;
}

.quantity-popup button.cancel-button {
  background-color: #d3c6c4;
  color: #1e2228;
  margin-left: 10px;
}
</style>
