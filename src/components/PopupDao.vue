<template>
<PopupSub title="上山·修行" :visible="showDaoPopup" @close="showDaoPopup = false">
<div class="underground-dao">
  
  <!-- <p class="dao-message">如月</p> -->

  <div class="dao-group">
    <button v-if="finishdao(0).value" class="button-dao" :disabled="finishdao(1).value" @click="dao('诵读经书')">诵读经书</button>
    <button class="button-dao" :disabled="finishdao(0).value" @click="dao('学习法术')">学习法术</button>
    <button class="button-dao" :disabled="finishdao(0).value" @click="dao('潜心修行')">潜心修行</button>
    <hr>
    <button class="button-dao" :disabled="finishdao(0).value" @click="dao('上山打怪')">上山打怪</button>
    <span class="note-fight">当前在第{{ currentFightLevel.level }}层</span>
    <hr>
    <p class="note-message">如月之恒，如日之升</p>
    <button class="button_cancel" @click="showDaoPopup = false">返回</button>
  </div>
</div>

</PopupSub>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import PopupSub from '../components/PopupSub.vue'
import { showDaoPopup } from './composables/gameRefs';

export const FightLevelMapping = [
  { level: '一', min: 26, max: 27 },
  { level: '二', min: 28, max: 36 },
  { level: '三', min: 37, max: 45 },
  { level: '四', min: 46, max: 54 },
  { level: '五', min: 55, max: 63 },
  { level: '六', min: 64, max: 72 },
  { level: '七', min: 73, max: 81 }
];

const fight = computed(() => store.state.fight)

// 根据fight.level 获取当前层数
const currentFightLevel = computed(() => {
  const level = FightLevelMapping.find(item => fight.value.level >= item.min && fight.value.level <= item.max)
  return level ? level : FightLevelMapping[0]
})

      // 姜云升 等级 26
    // 攻击力19 防御力 9 
      // 生命值6 法力值61
    // 每一层有敌人，第一层是小怪 
    // 敌人：山林小怪 姜云升消灭了一些他打得动的山林小怪，
    // 一项神秘的属性增加了1点。

      // 姜云升用麦克风大锤敲了敲，对敌人造成了巨大的物理攻击。
      // 姜云升用麦克风大锤唱了一首歌，对敌人造成了巨大的精神攻击。

  // { name: '麦克风大锤', quantifier:'个', price: 1000, isSpecial: true, desc: '麦克风大锤，可以用来打人，也可以用来唱歌' }, // 物理攻击
  // { name: '恶魔「S」之链', quantifier:'条', price: 5000, isSpecial: true, desc: '恶魔「S」之链，「S」是姜云升的「升」' }, // 精神攻击
  // { name: '反穿之甲', price: 10000, isSpecial: true, desc: '打个响指，你就会忘了这一切' }, // 物理防御
  // { name: '虚无之裤', quantifier:'条', price: 0, isSpecial: true, desc: '该知道的都知道了，不知道的慢慢了解' }, // 精神防御
  // { name: '巴黎之靴', quantifier:'双', price: 15000, isSpecial: true, desc: '穿上这双跳跳鞋，再也无法抵挡我在舞台上刷步数' }, // 敏捷度
  // { name: '黄色卡车', quantifier:'辆', price: 2800000, isSpecial: true, desc: '黑夜中，看星空，飘着一个个的梦' }, // 治愈

      // 姜云升当前拥有x件特殊道具，可以进到山中的第X层修行



const store = useStore()

// store.state.daoCount[index] 是否等于13
const finishdao = (index: number) => computed(() => store.state.daoCount[index] === 13);
async function dao(action: string) {

  // 没有道具 26 | 27| 36 | 45 | 54 |63 72 | 81

// tore.commit('appendLog', '玩家：你选择了去上山当道士！')
//   await sleep(1000)
//   store.commit('appendLog', '系统：今天你选择了潜心修行。道行+10')
//   store.commit('appendLog', '系统：今天你选择了诵读经书。道行+10，文化+10')
//   store.commit('appendLog', '系统：今天你师父抽背你经文，你没背出来，被训了一顿。道行+10，文化+10')
//   store.commit('appendLog', '系统：今天你选择了学习法术。道行+10，封建迷信+10') -->
  switch (action) {
    case '诵读经书':
      store.commit('appendLog', '系统：今天你选择了诵读经书。才华+10，???+10')
      store.commit('updateAttribute', { attribute: 'talent', value: 10 })
      store.commit('updateAttribute', { attribute: 'divine', value: 10 })
      break;

    case '学习法术':
      store.commit('appendLog', '系统：今天你选择了学习法术。才华+10，封建迷信+10')
      store.commit('updateAttribute', { attribute: 'talent', value: 10 })
      store.commit('updateAttribute', { attribute: 'divine', value: 12 })
      store.commit('updateAttribute', { attribute: 'superstition', value: 10 })
      break;

  }


  store.dispatch('incrementRound');
}


</script>

<style scoped>
.button-dao{
  display: block;
  background-color: #3a3c43;
  border: none;
  color: #fff;
  border-radius: 4px;
  padding: 5px 7px;
  font-size: 0.9rem;
  cursor: pointer;
  margin: 0.5rem auto;
  /* margin-left: 10px; */
  transition: background-color 0.3s ease;
}

.button-dao:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.button-activity {
  background-color: #964742;
  border: none;
  color: #fff;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s ease;
}


.button_cancel {
  background-color: #ddd;
  border: none;
  color: #333;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
}

.note-message {
  font-size: 0.7rem;
  color: #666;
  margin-top: 0.5rem;
}

</style>
