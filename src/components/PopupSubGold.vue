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

<Popup title="交易所南市·地产" :visible="showRealEstatePopup" @close="showRealEstatePopup = false">
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
</Popup>

<Popup title="交易所东市·股票" :visible="showStockMarketPopup" @close="showStockMarketPopup = false">
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
</Popup>

<Popup title="交易所西市·投资" :visible="showInvestmentPopup" @close="showInvestmentPopup = false">
  <div class="invest-project">

    <div class="project" v-for="project in InvestmentProjects">
      <div class="project-name">{{ project.name }}</div>
      <div class="project-price">{{ store.state.investedProjects.includes(project.name) ? '成功投资' : '起投金额' }} <button class="button_invest" :class="store.state.investedProjects.includes(project.name) ? 'button_invested' : ''"  @click="!isTyping && invest(project.name)">￥{{ project.cost/10000 }}万元</button></div>
      
    </div>
    <p id="textboxPopup"></p>
    <p class="note-message">请挑选你想要投资的项目，每年初会获得对应的项目收益。投资有风险，入市须谨慎！项目与现实无关，仅代表游戏效果，不构成投资建议。</p>
  </div>
</Popup>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import Popup from '../components/Popup.vue'
import PopupSub from '../components/PopupSub.vue'
import { showBankPopup, showBuyGoldPopup, showSellGoldPopup, showRealEstatePopup, showStockMarketPopup, showInvestmentPopup, isTyping } from './composables/gameRefs';

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

const InvestmentProjects = [
  { name: '给长城贴瓷砖', cost: 25000000, income: 250 },
  { name: '给珠穆朗玛峰修电梯', cost: 12000000, income: 250 },
  { name: '给吐鲁番盆地装遮阳棚', cost: 6000000, income: 250 },
  { name: '给天安门换门把手', cost: 20000000, income: 250 },
  { name: '给黄河修护栏', cost: 9000000, income: 250 },
  { name: '给渤海镶金边', cost: 30000000, income: 250 },
  { name: '给东海装海底隧道', cost: 70000000, income: 250 },
  { name: '在三北种防护林', cost: 30000000, income: 6000000 },
  { name: '在长江修水坝', cost: 50000000, income: 15000000 },
  { name: '在钓鱼岛升国旗', cost: 60000000, income: 60000000 },
]

async function invest(projectName: string) {
  if (store.state.investedProjects.includes(projectName)) {
    await store.dispatch('typeWriterPopup', '【系统】姜云升已经投资过这个项目啦，本项目不支持复投！')
  } else {
    const project = InvestmentProjects.find(project => project.name === projectName)
    if (project) {
      if (project.cost <= attributes.value.money) {
        if (showInvestmentPopup.value) {
          store.commit('investProject', { name: project.name, income: project.income, cost: project.cost })

          if (project.income > 10000) {
            await store.dispatch('typeWriterPopup', '【系统】姜云升支出了' + project.cost/10000 + '万金钱💸，投资了【' + project.name + '】项目，不愧是投资奇才！预计该项目在接下来每年投资回报整整' + project.income/10000 + '万元。')
          } else {
            await store.dispatch('typeWriterPopup', '【系统】姜云升支出了' + project.cost/10000 + '万金钱💸，投资了【' + project.name + '】项目，不愧是投资奇才！预计该项目在接下来每年投资回报整整' + project.income + '元。')
          }

          if (store.state.investedProjects.length === InvestmentProjects.length) {
            const isAchUnlocked = store.getters.unlockedAchievement('重生之投资奇才');
            if (!isAchUnlocked) {
              store.commit('unlockAchievement', '重生之投资奇才');
              await store.dispatch('typeWriterPopup', ['恭喜姜云升已经投资了交易所的所有投资项目，解锁了第' + store.getters.UnlockedAchievementCount + '个成就【重生之投资奇才】（DLC）！感谢重生的姜云升为祖国大江南北的建设做出的卓越贡献！']);
            }
          }
        }
      } else {
        await store.dispatch('typeWriterPopup', '【系统】姜云升还不够有钱💴，投资不起这个项目。')
      }
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

#textboxPopup {
  font-size: 0.9em;
  color: #1e2228;
  padding: 0;
  margin-top: 25px;
  margin-bottom: -20px;
  font-weight: bold;
}

.invest-project .project {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  margin: 10px 0;
  white-space: nowrap;
}

.invest-project .project-name {
  font-size: 1rem;
  color: #1e2228;
  font-weight: bold;
}

.invest-project .project-price {
  color: #666;
  font-size: 0.8rem;
}

.invest-project .button_invest {
  background-color: #964742;
  border: none;
  color: #fff;
  border-radius: 4px;
  padding: 4px 9px;
  font-size: 0.8em;
  cursor: pointer;
  margin-left: 4px;
  transition: background-color 0.3s ease;
}

.invest-project .button_invest.button_invested {
  background-color: #1e2228;
}



</style>
