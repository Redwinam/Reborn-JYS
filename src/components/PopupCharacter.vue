

  <template>
    <div class="attributes-container">
      <div><span>姓名</span>姜云升</div>
      <div><span>国籍</span>中国</div>
      <div><span>生日</span>1996年6月1日 / 四月十六</div>
      <div><span>年龄</span>{{ Math.floor((store.state.round - 16) / 36) + 16 }}岁</div>
      <div><span>身高</span> 182cm</div>

      <div><span>{{ attributeNames['talent'] }}</span> {{ attributes['talent'] }}</div>
      <div><span>{{ attributeNames['charm'] }}</span> {{ attributes['charm'] }}</div>

      <div><span>{{ attributeNames['popularity'] }}</span> 红 {{ attributes['popularity']['red'] }} / 黑 {{ attributes['popularity']['black'] }}</div>
      <div>
        <span>{{ attributeNames['money'] }}</span> {{ attributes['money'] }}  | {{ attributes['gold'] }}枚金子
        <button class="button_buyGold" @click="showBuyGoldPopup = true">买金子！</button> 
      </div>
      <div v-if="attributes['energy'] >= 0"><span> {{ attributeNames['energy'] }}</span> {{ attributes['energy'] }}<template v-if="weak">（虚弱！）</template></div>
      <div v-else><span class="weak">体力透支</span> {{ attributes['energy'] }} <template v-if="weak">（虚弱！）</template> </div>
      <div><span>{{ attributeNames['mood'] }}</span> {{ attributes['mood'] }}</div>

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

  <Popup title="买金子！" :visible="showBuyGoldPopup" @close="showBuyGoldPopup = false">
  <div class="buy-gold">
    <div class="gold-amount">
      <label for="gold-amount">购买数量：</label>
      <input type="number" id="gold-amount" min="1" max="10000" v-model="goldAmount" />
    </div>
    <div class="gold-price">
      <label for="gold-price">总价：</label>
      <input type="number" id="gold-price" :value="goldAmount * 360" disabled />
    </div>
    <button class="button_buyGold" :disabled="goldAmount * 360 > attributes.money" @click="buyGold">购买</button>
    <p v-if="goldAmount * 360 > attributes.money" class="error-message">金钱不足，买不起金子</p>
    <p class="note-message">1枚金子 = 360金钱，金子每轮次享有固定的6%利息收益。金价与现实无关，仅代表游戏效果，不构成投资建议。</p>
  </div>
</Popup>

</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";

import { attributeNames } from "../store/attributes";
import Popup from '../components/Popup.vue'

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
  /* display: flex; */
  flex-wrap: wrap;
  gap: 16px;
  font-family: "Arial", sans-serif;
}

.attribute {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  /* background-color: #333; */
  /* color: #fff; */
  border-radius: 8px;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); */
}

.attribute-name {
  font-weight: bold;
  margin-right: 4px;
}

.attribute-value {
  font-size: 1.2em;
}

.button_buyGold {
  background-color: #964742;
  border: 2px solid #200504;
  color: #fff;
  border-radius: 4px;
  padding: 0.2rem 0.4rem;
  font-size: 0.8em;
  cursor: pointer;
  margin: 0.5rem 0;
}

.note-message {
  font-size: 0.8em;
  color: #666;
}
.error-message {
  color: #964742;
  font-weight: bold;
  font-size: 0.9em;
}
</style>