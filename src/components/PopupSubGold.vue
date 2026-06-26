<template>
  <PopupSub title="买金条！" :visible="showBuyGoldPopup" @close="showBuyGoldPopup = false">
    <div class="buy-gold">
      <div class="gold-amount">
        <label for="gold-amount">购买数量</label>
        <input type="number" id="gold-amount" min="1" max="10000" v-model="goldAmount" /> 克
        <div class="gold-price">/ 总价：￥{{ goldAmount * goldPrice }}</div>
      </div>
      <p v-if="goldAmount * goldPrice > attributes.money" class="error-message">金钱不足，买不起这么多金条</p>
      <div class="button-group">
        <button class="button_buyGold" :disabled="goldAmount * goldPrice > attributes.money" @click="buyGold">购买</button>
        <button class="button_cancel" @click="showBuyGoldPopup = false">取消</button>
      </div>
      <p class="note-message">1根金条 = {{ goldPrice }}金钱，金条每轮次享有固定的6%利息收益。金价与现实无关，仅代表游戏效果，不构成投资建议。</p>
    </div>
  </PopupSub>

  <PopupSub title="出售金条" :visible="showSellGoldPopup" @close="showSellGoldPopup = false">
    <div class="buy-gold">
      <div class="gold-amount">
        <label for="gold-amount">出售数量</label>
        <input type="number" id="gold-amount" min="1" max="10000" v-model="goldAmount" /> 克
        <div class="gold-price">/ 获得：¥{{ goldAmount * goldPrice }}</div>
      </div>
      <p v-if="goldAmount > attributes.gold" class="error-message">没有这么多金条可供卖出</p>
      <div class="button-group">
        <button class="button_sellGold" :disabled="goldAmount > attributes.gold" @click="sellGold">出售</button>
        <button class="button_cancel" @click="showSellGoldPopup = false">取消</button>
      </div>
      <p class="note-message">1根金条 = {{ goldPrice }}金钱，金条每轮次享有固定的6%利息收益。金价与现实无关，仅代表游戏效果，不构成投资建议。</p>
    </div>
  </PopupSub>

  <Popup title="交易所南市·地产" :visible="showRealEstatePopup" @close="showRealEstatePopup = false">
    <div class="buy-gold">
      <div class="gold-amount">
        <label for="gold-amount">购买数量</label>
        <input type="number" id="gold-amount" min="1" max="10000" v-model="goldAmount" /> 克
        <div class="gold-price">/ 总价：￥{{ goldAmount * goldPrice }}</div>
      </div>
      <p v-if="goldAmount * goldPrice > attributes.money" class="error-message">金钱不足，买不起这么多金条</p>
      <div class="button-group">
        <button class="button_buyGold" :disabled="goldAmount * goldPrice > attributes.money" @click="buyGold">购买</button>
        <button class="button_cancel" @click="showBuyGoldPopup = false">取消</button>
      </div>
      <p class="note-message">1根金条 = {{ goldPrice }}金钱，金条每轮次享有固定的6%利息收益。金价与现实无关，仅代表游戏效果，不构成投资建议。</p>
    </div>
  </Popup>

  <Popup title="交易所东市·股市" :visible="showStockMarketPopup" @close="showStockMarketPopup = false">
    <div class="buy-gold">
      <!-- 显示历年的股指 -->
      <div v-for="stockIndex in StockIndex" class="stock-index">
        <template v-if="year > stockIndex.year">
          <label :for="'stock-index' + year">{{ stockIndex.year }}年收盘股指</label>
          <!-- 根据 const StockIndex = [ { year: 2011, index: 2199.42 }, 显示index-->
          <span :key="stockIndex.year" class="stock-index-year" :id="'stock-index' + stockIndex.year">{{ stockIndex.index }}</span>
        </template>
      </div>
      <div class="gold-amount">
        <label for="gold-amount">预测今年 {{ year }} 年度股指</label>
      </div>
      <div class="button-group">
        <button class="button_buyGold" :disabled="goldAmount * goldPrice > attributes.money" @click="buyGold">看多</button>
        <button class="button_cancel" @click="showBuyGoldPopup = false">看空</button>
      </div>
      <p id="textboxPopup">重生·姜云升来到了股市的交易大厅！姜云升本年的操作选项将决定本年度的收益率。姜云升的的股市投资总收益率决定了重生·姜云升究竟有没有资格获得「绝对股神」的称号！</p>
      <p class="note-message">作为大亨，入场交易所股市要求验资5000万。当前金钱数值小于5千万时，将无法完成股市交易。</p>
    </div>
  </Popup>

  <Popup title="交易所西市·投资" :visible="showInvestmentPopup" @close="showInvestmentPopup = false">
    <div class="invest-project">
      <div class="project" v-for="project in InvestmentProjects">
        <div class="project-name">{{ project.name }}</div>
        <div class="project-price">
          {{ store.state.investedProjects.includes(project.name) ? "成功投资" : "起投金额" }}
          <button class="button_invest" :class="store.state.investedProjects.includes(project.name) ? 'button_invested' : ''" @click="!isTyping && invest(project.name)">￥{{ project.cost / 10000 }}万元</button>
        </div>
      </div>
      <p id="textboxPopup">欢迎姜云升先生来到交易所·投资中心！</p>
      <p class="note-message">请挑选你想要投资的项目，每年初会获得对应的项目收益。投资有风险，入市须谨慎！项目与现实无关，仅代表游戏效果，不构成投资建议。</p>
    </div>
  </Popup>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";

import Popup from "../components/Popup.vue";
import PopupSub from "../components/PopupSub.vue";
import { showBankPopup, showBuyGoldPopup, showSellGoldPopup, showRealEstatePopup, showStockMarketPopup, showInvestmentPopup, isTyping } from "./composables/gameRefs";
import { GOLD_PRICE } from "../store/constants";

const store = useStore();
const attributes = computed(() => store.state.attributes);

const goldPrice = GOLD_PRICE;
const goldAmount = ref(1);
async function buyGold() {
  if (goldAmount.value * goldPrice <= attributes.value.money) {
    store.commit("buyGold", goldAmount.value);
    showBuyGoldPopup.value = false;
    if (showBankPopup.value) {
      await store.dispatch("typeWriterPopup", "姜云升花了" + goldAmount.value * goldPrice + "金钱，购买了" + goldAmount.value + "克金条。");
    }
  }
}

async function sellGold() {
  if (goldAmount.value <= attributes.value.gold) {
    store.commit("buyGold", -goldAmount.value);
    showSellGoldPopup.value = false;
    if (showBankPopup.value) {
      await store.dispatch("typeWriterPopup", "姜云升卖出了" + goldAmount.value + "克金条，获得了" + goldAmount.value * goldPrice + "金钱。");
    }
  }
}

const StockIndex = [
  { year: 2011, index: 2199.42 },
  { year: 2012, index: 2269.13 },
  { year: 2013, index: 2115.98 },
  { year: 2014, index: 3234.68 },
  { year: 2015, index: 3539.18 },
  { year: 2016, index: 3103.64 },
  { year: 2017, index: 3373.96 },
  { year: 2018, index: 2493.9 },
  { year: 2019, index: 3050.12 },
  { year: 2020, index: 3473.07 },
  { year: 2021, index: 3639.78 },
  { year: 2022, index: 3089.26 },
  { year: 2023, index: 3204.63 },
];

const year = computed(() => store.state.year);

const InvestmentProjects = [
  { name: "给长城贴瓷砖", cost: 25000000, income: 250 },
  { name: "给珠穆朗玛峰修电梯", cost: 12000000, income: 250 },
  { name: "给吐鲁番盆地装遮阳棚", cost: 6000000, income: 250 },
  { name: "给天安门换门把手", cost: 20000000, income: 250 },
  { name: "给黄河修护栏", cost: 9000000, income: 250 },
  { name: "给渤海镶金边", cost: 30000000, income: 250 },
  { name: "给东海装海底隧道", cost: 70000000, income: 250 },
  { name: "在三北种防护林", cost: 30000000, income: 6000000 },
  { name: "在长江修水坝", cost: 50000000, income: 15000000 },
  { name: "在钓鱼岛升国旗", cost: 60000000, income: 60000000 },
];

async function invest(projectName: string) {
  if (store.state.investedProjects.includes(projectName)) {
    await store.dispatch("typeWriterPopup", "【系统】姜云升已经投资过【" + projectName + "】项目啦，本项目不支持复投！");
  } else {
    const project = InvestmentProjects.find((project) => project.name === projectName);
    if (project) {
      if (project.cost <= attributes.value.money) {
        if (showInvestmentPopup.value) {
          store.commit("investProject", { name: project.name, income: project.income, cost: project.cost });

          if (project.income > 10000) {
            await store.dispatch(
              "typeWriterPopup",
              "【系统】姜云升支出了" + project.cost / 10000 + "万金钱💸，投资了【" + project.name + "】项目，不愧是投资奇才！预计该项目在接下来每年投资回报整整" + project.income / 10000 + "万元。"
            );
          } else {
            await store.dispatch(
              "typeWriterPopup",
              "【系统】姜云升支出了" + project.cost / 10000 + "万金钱💸，投资了【" + project.name + "】项目，不愧是投资奇才！预计该项目在接下来每年投资回报整整" + project.income + "元。"
            );
          }

          if (store.state.investedProjects.length === InvestmentProjects.length) {
            const isAchUnlocked = store.getters.unlockedAchievement("重生之投资奇才");
            if (!isAchUnlocked) {
              store.commit("unlockAchievement", "重生之投资奇才");
              await store.dispatch("typeWriterPopup", [
                "恭喜姜云升已经投资了交易所的所有投资项目，解锁了第" + store.getters.UnlockedAchievementCount + "个成就【重生之投资奇才】（DLC）！感谢姜云升先生为祖国大江南北的建设做出的贡献！",
              ]);
            }
          }
        }
      } else {
        await store.dispatch("typeWriterPopup", "【系统】姜云升还不够有钱💴，投资不起这个项目。");
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

.popup-sub .button_buyGold,
.popup-sub .button_sellGold {
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
  padding: 10px;
  margin-top: 25px;
  font-weight: bold;
  border: 1px dashed #4c4d55;
  border-radius: 0.5rem;
}

.invest-project .project {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  margin: 10px;
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

.invest-project .note-message {
  border-top: none;
  margin-top: 0.2rem;
  padding-top: 0.2rem;
}
</style>
