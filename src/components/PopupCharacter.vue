

  <template>
    <div class="attributes-container">
      <div><span class="attribute-name">姓名</span>姜云升</div>
      <div><span class="attribute-name">国籍</span>中国</div>
      <div><span class="attribute-name">生日</span>1996年6月1日 / 四月十六</div>
      <div><span class="attribute-name">星座</span>双子座</div>
      <div><span class="attribute-name">年龄</span>{{ Math.floor((store.state.round - 16) / 36) + 16 }}岁</div>
      <div><span class="attribute-name">身高</span> 182cm</div>

      <div><span class="attribute-name">{{ attributeNames['talent'] }}</span> {{ attributes['talent'] }}</div>
      <div><span class="attribute-name">{{ attributeNames['charm'] }}</span> {{ attributes['charm'] }}</div>

      <div><span class="attribute-name">{{ attributeNames['popularity'] }}</span> 红 {{ attributes['popularity']['red'] }} / 黑 {{ attributes['popularity']['black'] }}</div>
      <div>
        <span class="attribute-name">{{ attributeNames['money'] }}</span> 
        <span>￥{{ attributes['money'] }}  | {{ attributes['gold'] }}枚金子
          <button class="button_buyGold" @click="showBuyGoldPopup = true">买金子！</button> 
        </span>
      </div>
      <div v-if="attributes['energy'] >= 0"><span class="attribute-name"> {{ attributeNames['energy'] }}</span> {{ attributes['energy'] }}<template v-if="weak">（虚弱！）</template></div>
      <div v-else><span class="weak attribute-name">体力透支</span> {{ attributes['energy'] }} <template v-if="weak">（虚弱！）</template> </div>
      <div><span class="attribute-name">{{ attributeNames['mood'] }}</span> {{ attributes['mood'] }}</div>

    </div>

      <!-- <h3 class="title">数值说明：</h3>
  <ul>
    <li><strong>才华：</strong>决定你的学习能力和创造力。</li>
    <li><strong>魅力：</strong>决定你的人缘和交际能力。</li>
    <li><strong>人气：</strong>决定你的知名度和影响力，分为红色人气和黑色人气。</li>
    <li><strong>金钱：</strong>决定你的经济实力。</li>
    <li><strong>Freestyle：</strong>决定你的说唱Freestyle实力。</li>
    <li><strong>电竞：</strong>决定你的电竞实力。</li>
    <li><strong>体力：</strong>决定你的身体素质和耐力。</li>
    <li><strong>心情：</strong>决定你的情绪和心态。</li>
    <li><strong>神性：</strong>决定你的神秘能力和超自然力量。</li>
  </ul> -->

<PopupSub title="买金子！" :visible="showBuyGoldPopup" @close="showBuyGoldPopup = false">
  <div class="buy-gold">
    <div class="gold-amount">
      <label for="gold-amount">购买数量</label>
      <input type="number" id="gold-amount" min="1" max="10000" v-model="goldAmount" /> 克
      <div class="gold-price">/ 总价：￥{{ goldAmount * 360 }}</div>
    </div>
    <p v-if="goldAmount * 360 > attributes.money" class="error-message">金钱不足，买不起金子</p>
    <div class="button-group">
      <button class="button_buyGold" :disabled="goldAmount * 360 > attributes.money" @click="buyGold">购买</button>
      <button class="button_cancel" @click="showBuyGoldPopup = false">取消</button>
    </div>
    <p class="note-message">1枚金子 = 360金钱，金子每轮次享有固定的6%利息收益。金价与现实无关，仅代表游戏效果，不构成投资建议。</p>
  </div>
</PopupSub>

</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";

import { attributeNames } from "../store/attributes";
import PopupSub from '../components/PopupSub.vue'

const store = useStore();

const attributes = computed(() => store.state.attributes);
const weak = computed(() => store.state.weak)

const showBuyGoldPopup = ref(false)

const goldAmount = ref(1)
const buyGold = () => {
  if (goldAmount.value * 360 <= attributes.value.money) {
    store.commit('buyGold', goldAmount.value)
    showBuyGoldPopup.value = false
  }
}

</script>

<style scoped>
.attributes-container {
  display: flex;
  flex-direction: column;
  gap: 0;
  font-family: "Arial", sans-serif;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.attributes-container > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px;
  border-bottom: 1px solid #ddd;
}

.attributes-container > div:last-child {
  border-bottom: none;
}

.attribute-name {
  font-weight: bold;
  color:#1e2228;
}

.button_buyGold {
  background-color: #964742;
  border: none;
  color: #fff;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.8em;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s ease;
}

.button_buyGold:hover {
  background-color: #752730;
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
}

.gold-amount input {
  width: 50px;
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

.weak {
  color: #964742;
  font-weight: bold;
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
  font-size: 0.9em;
  margin: 0 0 20px 0;
}
</style>