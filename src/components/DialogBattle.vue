<template>
  <p class="desc" id="textboxPopup"></p>
  <div class="button-container">
    <button v-if="showOptions" v-for="battleOption in battleOptions" @click="battle(battleOption)">{{battleOption}}</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { BattleResult } from '../store/battle'
import { songLibrary, Song } from '../store/songs'
import { showBattleDialog } from '../components/composables/gameRefs'

const store = useStore()
const year = store.state.year

interface BattleCondition {
  year: number;
  condition_haixuan: { attribute: string; value: number }[];
  condition_baqiang: { attribute: string; value: number }[];
  condition_zongjuesai: { attribute: string; value: number }[];
  condition_note: string;
}

const battleConditions = [{ 
  year: 2012, 
  condition_haixuan: [{ attribute: 'talent', value: 25 }],
  condition_baqiang:[ { attribute: 'talent', value: 50 }],
  condition_zongjuesai: [{ attribute: 'talent', value: 100 }],
  condition_note: "【才华】属性"
}, { 
  year: 2013, 
  condition_haixuan: [{ attribute: 'popularity', value: 200 }],
  condition_baqiang:[ { attribute: 'popularity', value: 400 }],
  condition_zongjuesai: [{ attribute: 'popularity', value: 800 }],
  condition_note: "【人气】属性"
}, { 
  year: 2014, 
  condition_haixuan: [{ attribute: 'freestyle', value: 4 }],
  condition_baqiang:[ { attribute: 'freestyle', value: 8 }],
  condition_zongjuesai: [{ attribute: 'freestyle', value: 12 }],
  condition_note: "【Freestyle】技能"
}, { 
  year: 2015, 
  condition_haixuan: [{ attribute: 'talent', value: 100 }, { attribute: 'energy', value: 90 }],
  condition_baqiang:[ { attribute: 'talent', value: 200 }, { attribute: 'energy', value: 100 }],
  condition_zongjuesai: [{ attribute: 'talent', value: 400 }, { attribute: 'energy', value: 120 }],
  condition_note: "【才华】属性、【体力】属性"
}, { 
  year: 2016, 
  condition_haixuan: [{ attribute: 'talent', value: 150 }, { attribute: 'charm', value: 150 }],
  condition_baqiang:[ { attribute: 'talent', value: 250 }, { attribute: 'charm', value: 250 }],
  condition_zongjuesai: [{ attribute: 'talent', value: 500 }, { attribute: 'charm', value: 500 }],
  condition_note: "【才华】属性、【魅力】属性"
}, { 
  year: 2017, 
  condition_haixuan: [{ attribute: 'popularity', value: 1000 }],
  condition_baqiang:[ { attribute: 'popularity', value: 2000 }],
  condition_zongjuesai: [{ attribute: 'popularity', value: 5000 }],
  condition_note: "【人气】属性"
}, { 
  year: 2018, 
  condition_haixuan: [{ attribute: 'freestyle', value: 8 }],
  condition_baqiang:[ { attribute: 'freestyle', value: 12 }],
  condition_zongjuesai: [{ attribute: 'freestyle', value: 16 }],
  condition_note: "【Freestyle】技能"
}, { 
  year: 2019, 
  condition_haixuan: [{ attribute: 'song-release', value: 1 }],
  condition_baqiang:[ { attribute: 'song-release', value: 2 }],
  condition_zongjuesai: [{ attribute: 'song-release', value: 3 }],
  condition_note: "发布【歌曲】数量"
}, { 
  year: 2020, 
  condition_haixuan: [{ attribute: 'talent', value: 250 }, { attribute: 'charm', value: 250 }, { attribute: 'divine', value: 100 }],
  condition_baqiang:[ { attribute: 'talent', value: 500 }, { attribute: 'charm', value: 500 }, { attribute: 'divine', value: 180 }],
  condition_zongjuesai: [{ attribute: 'talent', value: 900 }, { attribute: 'charm', value: 900 }, { attribute: 'divine', value: 360 }],
  condition_note: "【才华】属性、【魅力】属性、【???】属性"
}, { 
  year: 2021, 
  condition_haixuan: [{ attribute: 'popularity', value: 5000 }],
  condition_baqiang:[ { attribute: 'popularity', value: 9000 }],
  condition_zongjuesai: [{ attribute: 'popularity', value: 18000 }],
  condition_note: "【人气】属性"
}, { 
  year: 2022, 
  condition_haixuan: [{ attribute: 'freestyle', value: 16 }],
  condition_baqiang:[ { attribute: 'freestyle', value: 20 }],
  condition_zongjuesai: [{ attribute: 'freestyle', value: 24 }],
  condition_note: "【Freestyle】技能"
}] as BattleCondition[]

const isWinning = (conditions: { attribute: string; value: number }[]) => {
  for (const condition of conditions) {
    if (condition.attribute === 'popularity') {
      if (store.state.attributes.popularity.red + store.state.attributes.popularity.black < condition.value) {
        return false
      }
    } else if (condition.attribute === 'freestyle') {
      console.log(store.state.attributes.skill.freestyle)
      if (store.state.attributes.skill.freestyle < condition.value) {
        return false
      }
    } else if (condition.attribute === 'song-release') {
      // count songStages[song.title].completedStage === 'release' 的数量
      const songReleased = songLibrary.filter((song: Song) => store.state.songStages[song.title].completedStage === 'release').length
      if (songReleased < condition.value) {
        return false
      }
    }
    else {
      if (store.state.attributes[condition.attribute] < condition.value) {
        return false
      }
    }
  }
  return true
}

const conditionText = (conditions: { attribute: string; value: number }[]) => {
  let text = []
  for (const condition of conditions) {
    if (condition.attribute === 'popularity') {
      text.push(`「人气」≥${condition.value} `)
    } else if (condition.attribute === 'freestyle') {
      text.push(`「Freestyle」技能≥${condition.value}`)
    } else if (condition.attribute === 'song-release') {
      text.push(`发布「歌曲」数量≥${condition.value}`)
    } else if (condition.attribute === 'divine') {
      text.push(`「???」属性≥${condition.value}`)
    } else if (condition.attribute === 'charm') {
      text.push(`「魅力」属性≥${condition.value}`)
    } else if (condition.attribute === 'talent') {
      text.push(`「才华」属性≥${condition.value}`)
    } else if (condition.attribute === 'energy') {
      text.push(`「体力」属性≥${condition.value}`)
    } else {
      text.push(`「${condition.attribute}」≥${condition.value}`)
    }
  }
  return text
}

const battleReward = async () => {
  const result = store.state.battleResults.find((battleResult: BattleResult) => battleResult.year === year).result
  const reward = [200, 300, 500, 800, 1200, 1600, 2000, 2500, 3000, 4000, 6000, 10000][year - 2012]
  if (result === '海选') {
    store.commit('updateAttribute', { attribute: 'red', value: reward * 0.5 })
    store.commit('updateAttribute', { attribute: 'money', value: reward * 10 * 0.5 })
    await store.dispatch('typeWriter', `本届Battle大赛告一段落，恭喜姜云升获得「海选」奖励${reward * 0.5}人气和${reward * 10 * 0.5}金钱！`)
  } else if (result === '八强') {
    store.commit('updateAttribute', { attribute: 'red', value: reward * 0.75 })
    store.commit('updateAttribute', { attribute: 'money', value: reward * 10 * 0.75 })
    await store.dispatch('typeWriter', `本届Battle大赛告一段落，恭喜姜云升获得「八强」奖励${reward * 0.75}人气和${reward * 10 * 0.75}金钱！`)
  } else if (result === '冠军') {
    store.commit('updateAttribute', { attribute: 'red', value: reward * 1 })
    store.commit('updateAttribute', { attribute: 'money', value: reward * 10 * 1})
    await store.dispatch('typeWriter', `本届Battle大赛圆满结束，恭喜姜云升获得「冠军」奖励${reward * 1}人气和${reward * 10 * 1}金钱！`)
  } else if (result === '落选') {
    store.commit('updateAttribute', { attribute: 'red', value: reward * 0.1 })
    await store.dispatch('typeWriter', `本届Battle大赛圆满结束，虽然姜云升这次大赛中没有获得名次，但是却让更多人听见了你的说唱，姜云升获得了${reward * 0.1}人气！`)
  }
}

const currentBattleCondition = battleConditions.find(battleCondition => battleCondition.year === year)
const showOptions = ref(false)

const battleToText = ref(`欢迎姜云升来到${year}届Battle大赛的现场🎙，给我你的声音🎉和手🤘！这是《重生之我是姜云升》游戏里的第${year-2012+1}场Battle大赛，比赛分为「海选」、「八强之争」和「总决赛」三个阶段，在本年度的九到十二月随时可以报名参加，本届比赛考验选手的${ currentBattleCondition?.condition_note }。请问姜云升要现在就报名参加吗？`)
const battleOptions = ref(["报名参加！", "再准备准备", "放弃本次比赛"])

onMounted(async () => {
  if (document.getElementById('textboxPopup')) {
    await store.dispatch('typeWriterPopup', battleToText.value);
    await new Promise(resolve => setTimeout(resolve, 200))
    showOptions.value = true
  }
});

async function typeWriterPopup (text: string, options: string[]) {
  const textboxPopup = document.getElementById('textboxPopup')
  if (textboxPopup) {
    textboxPopup.innerHTML = ""
    showOptions.value = false
    await store.dispatch('typeWriterPopup', text);
    await new Promise(resolve => setTimeout(resolve, 600))
    battleOptions.value = options
    showOptions.value = true
  }
}

async function typeWriterFenwei() {
  const textboxPopup = document.getElementById('textboxPopup')
  if (textboxPopup) {
    textboxPopup.innerHTML = ""
    showOptions.value = false
    await store.dispatch('typeWriterPopup', "（比赛现场）");
    await store.dispatch('typeWriterPopup', "「yoyo~切克闹！」");
    await store.dispatch('typeWriterPopup', "「🙌！！」");
    await store.dispatch('typeWriterPopup', "「Motherf**ker!」…「WTF!」……「不好意思』…🎉！");
    await store.dispatch('typeWriterPopup', "Wow~~！今天晚上获胜的选手是——🏆");
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

async function battle(battleOption: string) {
  if (currentBattleCondition) {
    if (battleOption === "报名参加！") {
      // 检查条件
      await typeWriterFenwei();
      if (isWinning(currentBattleCondition.condition_haixuan)) {
        // updateBattleResult
        store.commit('updateBattleResult', { year: year, result: '海选'})
        // 根据battleResult统计历史
        const countHistoryHaixuan = store.state.battleResults.filter((battleResult: BattleResult) => battleResult.result === '海选').length
        typeWriterPopup(`恭喜姜云升成功晋级「八强之争」！这是姜云升第${countHistoryHaixuan}次晋级「八强之争」，是否已经准备好迎接观众们热情的呼声与投票了？请问姜云升要现在就继续参加下一轮的比赛吗？`,
        ["继续参赛！", "再准备准备"])

      } else {
        // 落选
        store.commit('updateBattleResult', { year: year, result: '落选'})
        typeWriterPopup(`很遗憾，姜云升没有通过「海选」——你的对手的实力居然达到了惊人的${conditionText(currentBattleCondition.condition_haixuan)}，你的${currentBattleCondition.condition_note}不足以击败对手。你不得不提前离开这个舞台。但你的生命就是这场Battle，继续你的人生吧！`,
        ["离开比赛"])
      }
      
    } else if (battleOption === "继续参赛！") {
      await store.dispatch('typeWriterPopup', "Wow~~！今天晚上决胜出的八强是——🏆");
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (isWinning(currentBattleCondition.condition_baqiang)) {
        // updateBattleResult
        store.commit('updateBattleResult', { year: year, result: '八强'})
        // 根据battleResult统计历史
        const countHistoryBaqiang = store.state.battleResults.filter((battleResult: BattleResult) => battleResult.result === '八强').length
        typeWriterPopup(`恭喜姜云升成功晋级「总决赛」！这是姜云升第${countHistoryBaqiang}次晋级「总决赛」，激动或紧张，请问姜云升要现在就继续参加下一轮的比赛吗？`,
        ["进入决赛！", "再准备准备"])
      } else {
        typeWriterPopup(`很遗憾，姜云升没有通过「八强之争」——你的对手的实力居然达到了惊人的${conditionText(currentBattleCondition.condition_baqiang)}，你的${currentBattleCondition.condition_note}不足以击败对手。你不得不提前离开这个舞台。但你的生命就是这场Battle，继续你的人生吧！`,
        ["离开比赛"])
      }

    } else if (battleOption === "进入决赛！") {
      await store.dispatch('typeWriterPopup', "Wow~~！今天晚上获胜的冠军选手是——🏆");
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (isWinning(currentBattleCondition.condition_zongjuesai)) {
        // updateBattleResult
        store.commit('updateBattleResult', { year: year, result: '冠军'})
        // 根据battleResult统计历史
        const countHistoryZongjuesai = store.state.battleResults.filter((battleResult: BattleResult) => battleResult.result === '冠军').length
        typeWriterPopup(`恭喜姜云升获得了本届Battle大赛的「总冠军」！这是姜云升第${countHistoryZongjuesai}次获得「总冠军」，他的手被主理人高高举起，台下的欢呼声与喝彩声久久不止。也许时隔多年之后，姜云升会再次回想起这一年、这一刻、这一切，那时的他会是怎样的心情呢？`,
        ["结束比赛"])

      } else {
        typeWriterPopup(`很遗憾，姜云升没有获得本届Battle大赛的「总冠军」——你的对手的实力居然达到了惊人的${conditionText(currentBattleCondition.condition_zongjuesai)}，你的${currentBattleCondition.condition_note}不足以击败对手，但是，姜云升的生命就是这场Battle，继续你的人生吧！`,
        ["结束比赛"])
      }

    } else if (battleOption === "离开比赛") {
      // updateBattleEnd
      store.commit('updateBattleEnd', { year: year, end: true })
      showBattleDialog.value = false
      await battleReward()
      store.dispatch('incrementRound');

    } else if (battleOption === "结束比赛") {
      store.commit('updateBattleEnd', { year: year, end: true })
      showBattleDialog.value = false
      await battleReward()
      if (store.state.battleResults.filter((battleResult: BattleResult) => battleResult.result === '冠军').length >= 3) {
        store.commit('updateAchievements', 'Battle King')
        await store.dispatch('typeWriter', `恭喜姜云升累计在Battle大赛中拿下3次冠军奖杯，解锁成就【Battle King】！`)
      }
      store.dispatch('incrementRound');

    } else if (battleOption === "再准备准备") {
      showBattleDialog.value = false
      store.dispatch('typeWriter', `胜利是留给有准备的人的！记得留意本届Battle大赛的结束时间是在本年度的12月，如未完成比赛，将无法获得比赛名次奖励。`)
      store.dispatch('incrementRound');

    } else if (battleOption === "放弃本次比赛") {
      store.commit('updateBattleEnd', { year: year, end: true })
      showBattleDialog.value = false
      store.dispatch('typeWriter', `姜云升放弃了本次Battle大赛。无妨，生命是一场更宏大的Battle，继续你的人生吧！`)
    }
  }
}
</script>

<style scoped>
.button-container {
  margin: 0.25rem auto;
  gap: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-container button {
  padding: 0.5rem 1rem;
  background-color: #f3f3f3;
  color: #1e2228;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}
</style>
