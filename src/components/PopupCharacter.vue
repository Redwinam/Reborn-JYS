

  <template>
  <div class="attributes-container">
    <div><span class="attribute-name">姓名</span>姜云升</div>
    <div><span class="attribute-name">国籍</span>中国</div>
    <div><span class="attribute-name">生日</span>1996年6月1日 / 四月十六</div>
    <div><span class="attribute-name">年龄 / 星座</span><span>{{ Math.floor((store.state.round - 16) / 36) + 16 }}岁 / <span @click="gemini()">双子座</span></span></div>
    <div><span class="attribute-name">身高 / 体重</span> 182cm / 60kg</div>

    <div><span class="attribute-name">{{ attributeNames['talent'] }}</span> {{ attributes['talent'] }}</div>
    <div><span class="attribute-name">{{ attributeNames['charm'] }}</span> {{ attributes['charm'] }}</div>
    <div><span class="attribute-name">{{ attributeNames['divine'] }}<small>/ 封建迷信</small></span> <span>{{ attributes['divine'] }}<small> / {{ attributes['superstition'] }}</small></span></div>

    <div><span class="attribute-name">{{ attributeNames['popularity'] }}</span> 红 {{ attributes['popularity']['red'] }} / 黑 {{ attributes['popularity']['black'] }}</div>
    <div>
      <span class="attribute-name">{{ attributeNames['money'] }}</span> 
      <span>￥{{ attributes['money'] }}  | {{ attributes['gold'] }}枚金条
        <button class="button_buyGold" @click="showBuyGoldPopup = true">买</button> / <button class="button_sellGold" @click="showSellGoldPopup = true">卖</button>
      </span>
    </div>
    <div v-if="attributes['energy'] >= 0"><span class="attribute-name"> {{ attributeNames['energy'] }}</span> {{ attributes['energy'] }}<template v-if="weak">（虚弱！）</template></div>
    <div v-else><span class="weak attribute-name">体力透支</span> {{ attributes['energy'] }} <template v-if="weak">（虚弱！）</template> </div>
    <div><span class="attribute-name">{{ attributeNames['mood'] }}</span> {{ attributes['mood'] }} <template v-if="drunk>0">（醉酒 × {{drunk}}）</template></div>

  </div>

      <!-- <h3 class="title">数值说明：</h3>
  <ul>
    <li><strong>才华：</strong>决定你的学习能力和创造力。</li>
    <li><strong>魅力：</strong>决定你的人缘和交际能力。</li>
    <li><strong>人气：</strong>决定你的知名度和影响力，分为红色人气和黑色人气。</li>
    <li><strong>金钱：</strong>决定你的经济实力。</li>
    <li><strong>Freestyle：</strong>决定你的说唱Freestyle实力。</li>
    <li><strong>游戏：</strong>决定你的游戏实力。</li>
    <li><strong>体力：</strong>决定你的身体素质和耐力。</li>
    <li><strong>心情：</strong>决定你的情绪和心态。</li>
    <li><strong>神性：</strong>决定你的神秘能力和超自然力量。</li>
  </ul> -->

</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";

import { attributeNames } from "../store/attributes";
import { showBuyGoldPopup, showSellGoldPopup } from './composables/gameRefs';
const store = useStore();

const attributes = computed(() => store.state.attributes);
const weak = computed(() => store.state.weak)
const drunk = computed(() => store.state.drunk)


const gemini = () => {
  console.log('gemini')
  // setagency
  // store.commit('setSignedAgency', true)
  // 才华 + 100
  // store.commit('updateAttribute', { attribute: "talent", value: + 1200 })
  store.commit('updateAttribute', { attribute: "charm", value: + 1200 })
  store.commit('updateAttribute', { attribute: "divine", value: + 1200 })
  store.commit('updateAttribute', { attribute: "money", value: + 1000000000000000000000 })

  store.commit('incrementUndergroundCount');
  store.commit('incrementUndergroundCount');
  store.commit('incrementUndergroundCount');
  store.commit('incrementUndergroundCount');

  store.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
  store.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
  store.commit('updateAttribute', { attribute: 'freestyle', value: 1 });

  store.commit('upgradeSkillLevel', 'freestyle');
  store.commit('updateAttribute', { attribute: 'freestyle', value: 1 });

  for (let i = 0; i < 10; i++) {
    store.commit('incrementRound');
  }


  // 体力-200
  // store.commit('updateAttribute', { attribute: "energy", value: - 200 })
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
  max-height: 75vh;
  overflow-y: auto;
}

.attributes-container > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.5rem;
  border-bottom: 1px solid #ddd;
}

.attributes-container > div:last-child {
  border-bottom: none;
}

.attribute-name {
  font-weight: bold;
  color:#1e2228;
}

.weak {
  color: #964742;
  font-weight: bold;
}

.button_buyGold, .button_sellGold {
  background-color: #964742;
  border: none;
  color: #fff;
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 0.8em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button_sellGold {
  background-color: #302824;
}

</style>