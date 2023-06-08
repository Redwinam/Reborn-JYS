<template>
<PopupSub title="地下·世界" :visible="showUndergroundPopup" @close="showUndergroundPopup = false">
<div class="underground-tour">
  
  <p class="tour-message">第九百步，昏黄之光点此刻已如太阳。</p>

  <div class="tour-group">
    <button class="button-tour" :disabled="finishTour(0).value" @click="tour(0)">巡演「第九百步」</button>
    <button v-if="finishTour(0).value" class="button-tour" :disabled="finishTour(1).value" @click="tour(1)">巡演「命運ONLINE」</button>
    <hr>
    <button class="button-activity"  @click="activity('上节目')">上节目（1个月）</button>
    <button class="button-activity"  @click="activity('上音乐节')">上音乐节</button>
    <hr>
    <p class="note-message">姜云升可以选择<span>开启巡演 / 参加节目 / 参加音乐节</span>了</p>
    <button class="button_cancel" @click="showUndergroundPopup = false">返回</button>
  </div>
</div>

</PopupSub>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import PopupSub from '../components/PopupSub.vue'
import { showUndergroundPopup, showShardPopup, shardName } from './composables/gameRefs';

const store = useStore()

const tourStation = [
  { name: '第九百步', station: ['西安', '长沙', '武汉', '成都', '南京', '北京', '杭州', '上海', '郑州', '济南', '厦门', '深圳', '广州', ], intro: '第九百步，感谢有你。' },
  { name: '命運ONLINE', station: ['广州', '成都', '杭州', '长沙', '沈阳', '福州', '厦门', '武汉', '宁波', '郑州', '北京', '上海', '深圳', ], intro: '槐序之己，透丙露癸。一生狂放，何必钱塘潮信。我必是我。' }
]

// store.state.tourCount[index] 是否等于13
const finishTour = (index: number) => computed(() => store.state.tourCount[index] === 13);
async function tour(index: number) {
  showUndergroundPopup.value = false

  store.commit('incrementTourCount', index)
  const currentTourCount = computed(() => store.state.tourCount[index])

  store.commit('updateAttribute', { attribute: 'money', value: + (index === 0 ? 10000 : 100000) })
  store.commit('updateAttribute', { attribute: 'red', value: + (index === 0 ? 1000 : 3000) })

  let gift = []
  // 获得随机数量的粉丝的信
  const fansLetter = Math.floor(Math.random() * 10) + 1
  store.commit('updateItem', { itemName: '粉丝的信', quantity: fansLetter })
  if (fansLetter > 0) gift.push(`粉丝的信×${fansLetter}`)

  // 玫瑰花
  const rose = Math.floor(Math.random() * 10) + 1
  store.commit('updateItem', { itemName: '玫瑰花', quantity: rose })
  if (rose > 0) gift.push(`玫瑰花×${rose}`)

  // 皮卡丘玩偶
  const pikachuDoll = Math.floor(Math.random() * 5) + 1
  store.commit('updateItem', { itemName: '皮卡丘玩偶', quantity: pikachuDoll })
  if (pikachuDoll > 0) gift.push(`皮卡丘玩偶×${pikachuDoll}`)

  // 再index=0最后一次巡演获得 皮卡丘化石×1、大戒指×1、
  if (index === 0 && currentTourCount.value === 13) {
    store.commit('updateItem', { itemName: '皮卡丘化石', quantity: 1 })
    store.commit('updateItem', { itemName: '大戒指', quantity: 1 })
    gift.push('皮卡丘化石×1', '大戒指×1')
  }
  
  // index=1粉丝的画、粉丝打磨的锤子
  if (index === 1 && currentTourCount.value === 13) {
    store.commit('updateItem', { itemName: '粉丝的画', quantity: 1 })
    store.commit('updateItem', { itemName: '粉丝打磨的锤子', quantity: 1 })
    store.commit('updateItem', { itemName: '黄色卡车', quantity: 1 })    
    gift.push('粉丝的画×1', '粉丝打磨的锤子×1', '黄色卡车×1')
  }

  await store.dispatch('typeWriter', 
    `姜云升开启了巡演「${tourStation[index].name}」的${currentTourCount.value !== 13 ? `第${currentTourCount.value}站` : '最后一站'}·${tourStation[index].station[currentTourCount.value - 1]}站。${tourStation[index].intro}<small>姜云升金钱+${index === 0 ? 10000 : 100000}，人气+${index === 0 ? 1000 : 3000}，收到了${gift.join('、')}。</small>`
  )

  if (index === 0 && currentTourCount.value === 13) {
    await store.dispatch('typeWriter', 
      `这是姜云升「${tourStation[index].name}」巡演的最后一站，现实也许总达不到游戏里这么圆满，太多句「不见不散」最终敌不过明天的意外和「不可抗力」，但正是意外才让我们更加感动于每一次相遇和「好久不见」。第九百步之后的是「命運ONLINE」。`
    )
    store.commit('updateAttribute', { attribute: 'popularity', value: + 1 })

  } else if (index === 1 && currentTourCount.value === 13) {
    await store.dispatch('typeWriter', 
      `这是姜云升「${tourStation[index].name}」巡演的最后一站，被命运刺痛或戏弄、冲动和梦，这是姜云升「迄今为止的生命」里，是从今而后的再启程的未来。`
    )
    store.commit('updateAttribute', { attribute: 'popularity', value: + 1 })
  }

  await store.dispatch('incrementRound');
}

const activity = async (activityName: string) => {
  switch (activityName) {
    case '上节目':
      showUndergroundPopup.value = false
      // 才华 +30 魅力 + 30
      store.commit('updateAttribute', { attribute: 'talent', value: + 30 })
      store.commit('updateAttribute', { attribute: 'charm', value: + 30 })
      store.commit('updateAttribute', { attribute: 'money', value: + 20000 })
      store.commit('updateAttribute', { attribute: 'red', value: + 1000 })
      if (store.state.attributes.skill.freestyleLevel !== "SSS") {
        store.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
        await store.dispatch('typeWriter', ['姜云升用1个月的时间参加了一档说唱类综艺节目，又是一个不一样的他。<small>姜云升才华+30，魅力+30，金钱+20000，人气+1000freestyle技能值+1，当前freestyle技能等级为【' + store.state.attributes.skill.freestyleLevel + '】</small>']);
      } else {
        await store.dispatch('typeWriter', ['姜云升用1个月的时间参加了一档说唱类综艺节目，又是一个不一样的他。<small>姜云升才华+30，魅力+30，金钱+20000，人气+1000</small>']);
      }
      await store.dispatch('incrementRound');
      await store.dispatch('incrementRound');
      await store.dispatch('incrementRound');
      break;

    case '上音乐节':
      showUndergroundPopup.value = false
      const musicFestivals = ['星巢秘境音乐节', '仙人掌音乐节', 'Heloy音乐节', '迷笛音乐节', '太湖湾音乐节', '奇幻音乐节', '海潮宇宙音乐节', 'AYO!音乐节', '麦田音乐节', '星空音乐节', '楠溪江音乐节', '长江潮音乐节', '星动音乐节', '绿野音乐节', '禧都音乐节', '二次元音乐节', 'MDSK音乐节', '麦浪音乐节', '龙宫音乐节', 'LHC音乐节']
      const musicFestival = musicFestivals[Math.floor(Math.random() * musicFestivals.length)]
      // 才华 +10 魅力 + 10
      store.commit('updateAttribute', { attribute: 'talent', value: + 10 })
      store.commit('updateAttribute', { attribute: 'charm', value: + 10 })
      store.commit('updateAttribute', { attribute: 'money', value: + 100000 })
      store.commit('updateAttribute', { attribute: 'red', value: + 200 })

      await store.dispatch('typeWriter', [
        `姜云升来到了${musicFestival}的舞台上，为现场的观众们带来了一场印象深刻的演出。<small>姜云升才华+10，魅力+10，金钱+100000，人气+200。</small>`
      ])

      const allShards = ['晚霞和云', '秋天的第一片晚霞', '晚霞分享艺术家'];
      const unCollectedShards = allShards.filter(shard => !store.state.shards.includes(shard));
    
      if (unCollectedShards.length > 0 && Math.random() < 0.2) {
        const randomIndex = Math.floor(Math.random() * unCollectedShards.length);
      // store.commit  collectShard(state: State, shard: string) {
        store.commit('collectShard', unCollectedShards[randomIndex]);
        shardName.value = unCollectedShards[randomIndex];
        await store.dispatch('typeWriter', `你在音乐节演出的旅途中发现了一片晚霞碎片……`);
        await store.dispatch('waitAndType', 600);
        showShardPopup.value = true;
        
      }

      await store.dispatch('incrementRound');
      break;
  }
}

</script>

<style scoped>


.button-tour{
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

.button-tour:disabled {
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
