<template>
<PopupSub title="上山·修行" :visible="showDaoPopup" @close="showDaoPopup = false">
<div class="underground-dao">
  
  <!-- <p class="dao-message">如月</p> -->

  <div class="dao-group">
    <button class="button-dao" @click="dao('诵读经书')">诵读经书</button>
    <button class="button-dao" @click="dao('学习法术')">学习法术</button>
    <button class="button-dao" @click="dao('潜心修行')">潜心修行</button>
    <hr>
    <button class="button-dao" :disabled="lastFight().value" @click="dao('上山打怪')">上山打怪</button>
    <span class="note-fight">当前在第{{ FightLevelMapping[currentFightLevelIndex].level }}层 | 等级：{{ fight.level }}级</span>
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

const FightLevelMapping = [
  { level: '一', min: 26, max: 27 },
  { level: '二', min: 28, max: 36 },
  { level: '三', min: 37, max: 45 },
  { level: '四', min: 46, max: 54 },
  { level: '五', min: 55, max: 63 },
  { level: '六', min: 64, max: 72 },
  { level: '七', min: 73, max: 81 },
];

const store = useStore()
const fight = computed(() => store.state.attributes.fight)

// 根据fight.level 
const currentFightLevelIndex = computed(() => {
  // 获取当前层数的index
  const index = FightLevelMapping.findIndex(item => fight.value.level >= item.min && fight.value.level <= item.max)
  return index === -1 ? 0 : index
})

interface SpecialItem {
  name: string;
  effect: string[];
}

const specialItems = [
  {
    name: '麦克风大锤',
    effect: [
      "姜云升用麦克风大锤重锤敌人，对敌人造成了巨大的物理攻击",
      "姜云升用麦克风大锤唱了一首歌，对敌人造成了巨大的精神攻击",
      "姜云升用麦克风大锤重锤地面，强烈的冲击波，将前方的敌人通通击飞",
      "姜云升将麦克风大锤凌空轻甩，敌人看得愣了神，毫无防备地迎接即将降临的毁灭打击",
    ]
  }, {
    name: '恶魔「S」之链',
    effect: [
      "恶魔「S」之链召唤出了恶魔的力量，姜云升冷酷地凝视着敌人的意志被邪恶的力量侵蚀",
      "姜云升佩戴恶魔「S」之链，化身为恶魔使者，凌厉的气势让面前的敌人跪下",
      "恶魔「S」之链带着一团黑雾将敌人紧紧束缚缠绕，无论敌人如何挣扎，都无法逃脱姜云升的掌控",
      "姜云升无情地操控着恶魔「S」之链的诅咒，他感受到恶魔力量的黑暗和邪恶，但他并不畏惧，而将这股力量化为自己的武器",
    ]
  }, {
    name: '反穿之甲',
    effect: [
      "姜云升穿上反穿之甲，打了一个响指，敌人就忘掉了一切，失去了战斗能力",
      "姜云升甚至没有亲自出手，反穿之甲反弹了来自敌人全部的伤害，敌人直接自我暴毙",
      "反穿之甲散发出无敌的光芒，姜云升纵容着面前敌人，因为他知道这是他们最后的机会",
      "姜云升将反穿之甲正过来穿，逆转一切的力量让姜云升无坚不摧",
    ]
  }, {
    name: '虚无之裤',
    effect: [
      "姜云升发挥了虚无之裤的威力，山林鬼怪避之不及。姜云升如入无人之境，大杀四方",
      "虚无之裤赋予姜云升隐身的能力，让他在战场上如刺客般穿梭，片叶不沾身",
      "穿上虚无之裤的姜云升，敌人的目光穿透姜云升，却只看到无尽的虚空与绝望",
    ]
  }, {
    name: '巴黎之靴',
    effect: [
      "姜云升踏上巴黎之靴，风行千里，在战场上快速穿梭，敌人根本追不上",
      "姜云升穿上巴黎之靴，他的速度立刻变得很快，姜云升很快，快到敌人都反应不过来",
      "巴黎之靴承载着姜云升对自由的追求，姜云升穿着这双鞋走的每一步都散发着自信与勇气的气息",
      "姜云升穿上巴黎之靴，跳跃能力大幅增强，直接跳过了战斗剧情",
    ]
  }, {
    name: '黄色卡车',
    effect: [
      "姜云升率领黄色卡车，车轮碾过战场，将敌人碾得片甲不留",
      "姜云升站在黄色卡车的最前方，带领着这支弱小的车队奋勇前行",
      "姜云升亲手拼装的黄色卡车们咆哮着向敌人冲锋，虽然车身简朴，但他们的内心燃烧着勇敢的意志",
      "姜云升率领的黄色卡车队，用他们朴素而无畏的勇气，为了心中的正义，冲破敌人的防线",
      '黄色卡车队忠诚地执行姜云升的指令，彼此间的信任和默契配合，没有任何敌人挡得住',
    ]
  }
] as SpecialItem[]

// 通过(store.state.inventory[itemName] 判断上面的装备有几项
const specialItemCount = () => {
  let count = 0
  for (let i = 0; i < specialItems.length; i++) {
    if (store.state.inventory[specialItems[i].name]) {
      count++
    }
  }
  return count
}

const allSpecialItemEffects = computed(() => {
  const effects: string[] = []
  for (let i = 0; i < specialItems.length; i++) {
    if (store.state.inventory[specialItems[i].name]) {
      effects.push(...specialItems[i].effect)
    }
  }
  return effects
})
// 从store.state.lastSpecialItem 即为 ItemName
const lastSpecialItem = computed(() => store.state.lastSpecialItem)



      

// store.state.daoCount[index] 是否等于13
const lastFight = () => computed(() => store.state.attributes.fight.level === 81);
async function dao(action: string) {
  showDaoPopup.value = false

  // 没有道具 26 | 27| 36 | 45 | 54 |63 72 | 81

// tore.commit('typeWriter', '玩家：你选择了去上山当道士！')
//   await sleep(1000)
//   await store.dispatch('typeWriter', '系统：今天你选择了潜心修行。道行+10')
//   await store.dispatch('typeWriter', '系统：今天你选择了诵读经书。道行+10，文化+10')
//   await store.dispatch('typeWriter', '系统：今天你师父抽背你经文，你没背出来，被训了一顿。道行+10，文化+10')
//   await store.dispatch('typeWriter', '系统：今天你选择了学习法术。道行+10，封建迷信+10') -->
  switch (action) {

    case '诵读经书':
      store.commit('updateAttribute', { attribute: 'talent', value: 10 })
      store.commit('updateAttribute', { attribute: 'divine', value: 10 })
      await store.dispatch('typeWriter', '姜云升今天诵读经书。才华+10，神秘属性+10')
      store.dispatch('incrementRound')
      break;

    case '学习法术':
      await store.dispatch('typeWriter', '姜云升今天学习法术。才华+10，封建迷信+10')
      store.commit('updateAttribute', { attribute: 'talent', value: 10 })
      store.commit('updateAttribute', { attribute: 'divine', value: 12 })
      store.commit('updateAttribute', { attribute: 'superstition', value: 10 })
      store.dispatch('incrementRound')
      break;

    case '潜心修行':
      await store.dispatch('typeWriter', '姜云升今天潜心修行。一项神秘的属性+10')
      store.commit('updateAttribute', { attribute: 'divine', value: 20 })
      store.dispatch('incrementRound')
      break;

    // case '抽背经文':
    //   await store.dispatch('typeWriter', '系统：今天你师父抽背你经文，你没背出来，被训了一顿。才华+10，???+10')
    //   store.commit('updateAttribute', { attribute: 'talent', value: 10 })
    //   store.commit('updateAttribute', { attribute: 'divine', value: 10 })
    //   break;
    case '上山打怪':
      if (fight.value.level=== 26) {
        store.commit('updateAttribute', { attribute: 'fightLevel', value: 1 })
        store.commit('updateAttribute', { attribute: 'energy', value: -60 })
        store.commit('updateAttribute', { attribute: 'divine', value: 1 })
        await store.dispatch('typeWriter', `这是姜云升第一次来到这座山里，一项神秘的属性值增加了。<small>姜云升的等级+1，当前等级为${store.state.attributes.fight.level}级</small>`)
        store.dispatch('incrementRound');

        return;
      } 

      if ( fight.value.level != FightLevelMapping[currentFightLevelIndex.value].max) {
        let randomEffect= allSpecialItemEffects.value[Math.floor(Math.random() * allSpecialItemEffects.value.length)];
        if (specialItemCount() > currentFightLevelIndex.value -1 ) {
          store.commit('updateAttribute', { attribute: 'fightLevel', value: 1 })
          store.commit('updateAttribute', { attribute: 'energy', value: -60 })
          store.commit('updateAttribute', { attribute: 'divine', value: 5 * specialItemCount() })
            await store.dispatch('typeWriter', `${randomEffect}。<small>姜云升的神秘属性+${5 * specialItemCount()}，等级+1，当前等级为${store.state.attributes.fight.level}级</small>`)
            
        } else {
          await store.dispatch('typeWriter', `好奇心驱使姜云升想再进山里看看，可是前方敌人过于强大，生命值为6的姜云升只有收集更多的装备才能前行啦！`)
          return;
        }
      


      } else {
        if (specialItemCount() > currentFightLevelIndex.value ) {
          store.commit('updateAttribute', { attribute: 'fightLevel', value: 5 })

          const lastSpecialItemEffect = specialItems.find(item => item.name === lastSpecialItem.value)?.effect ;
          if (lastSpecialItemEffect) {
              let randomEffect = lastSpecialItemEffect[Math.floor(Math.random() * lastSpecialItemEffect.length)];
              
            store.commit('updateAttribute', { attribute: 'divine', value: 90 })
            await store.dispatch('typeWriter', `姜云升获得了新的道具${lastSpecialItem.value}——${randomEffect}。姜云升探索到了山的第${FightLevelMapping[currentFightLevelIndex.value].level}层。<small>姜云升的神秘属性+90，等级+5，当前等级为${store.state.attributes.fight.level}级</small>`)
          }
            
        } else {
          await store.dispatch('typeWriter', `好奇心驱使姜云升想再进山里看看，可是前方敌人过于强大，生命值为6的姜云升只有收集更多的装备才能前行啦！`)
          return;
        }

      }

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
