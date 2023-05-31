<template>
  <p>{{ battleText }}</p>
  <div class="button-container">
    <button v-for="battleOption in battleOptions" @click="battle(battleOption)">{{battleOption}}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { BattleResult } from '../store/battle'
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
  condition_note: "才华属性"
}, { 
  year: 2013, 
  condition_haixuan: [{ attribute: 'popularity', value: 200 }],
  condition_baqiang:[ { attribute: 'popularity', value: 400 }],
  condition_zongjuesai: [{ attribute: 'popularity', value: 800 }],
  condition_note: "人气属性"
}, 

] as BattleCondition[]

const isWinning = (conditions: { attribute: string; value: number }[]) => {
  for (const condition of conditions) {
    if (condition.attribute === 'popularity') {
      if (store.state.attributes.popularity.red + store.state.attributes.popularity.black < condition.value) {
        return false
      }
    } else {
      if (store.state.attributes[condition.attribute] < condition.value) {
        return false
      }
    }
  }
  return true
}

const battleReward = async () => {
  const result = store.state.battleResults.find((battleResult: BattleResult) => battleResult.year === year).result
  const reward = [200, 300, 500, 800, 1200, 1600, 2000, 2500, 3000, 4000, 6000, 10000][year - 2012]
  if (result === '海选') {
    store.commit('updateAttribute', { attribute: 'popularity', value: reward * 0.5 })
    store.commit('updateAttribute', { attribute: 'money', value: reward * 10 * 0.5 })
    await store.dispatch('typeWriter', `本届Battle大赛告一段落，恭喜姜云升获得「海选」奖励${reward * 0.5}人气和${reward * 10 * 0.5}金钱！`)
  } else if (result === '八强') {
    store.commit('updateAttribute', { attribute: 'popularity', value: reward * 0.75 })
    store.commit('updateAttribute', { attribute: 'money', value: reward * 10 * 0.75 })
    await store.dispatch('typeWriter', `本届Battle大赛告一段落，恭喜姜云升获得「八强」奖励${reward * 0.75}人气和${reward * 10 * 0.75}金钱！`)
  } else if (result === '冠军') {
    store.commit('updateAttribute', { attribute: 'popularity', value: reward * 1 })
    store.commit('updateAttribute', { attribute: 'money', value: reward * 10 * 1})
    await store.dispatch('typeWriter', `本届Battle大赛圆满结束，恭喜姜云升获得「冠军」奖励${reward * 1}人气和${reward * 10 * 1}金钱！`)
  }
}

const currentBattleCondition = battleConditions.find(battleCondition => battleCondition.year === year)

const battleText = ref(`欢迎姜云升来到${year}届Battle大赛的现场🎙，给我你的声音🎉和手🤘！这是《重生之我是姜云升》游戏里的第${year-2012+1}场Battle大赛，比赛分为「海选」、「八强之争」和「总决赛」三个阶段，在本年度的九到十二月随时可以报名参加，本届比赛考验选手的${ currentBattleCondition?.condition_note }。请问姜云升要现在就报名参加吗？`)
const battleOptions = ref(["报名参加！", "再准备准备", "放弃本次比赛"])

const battle = async (battleOption: string) => {
  if (currentBattleCondition) {
    if (battleOption === "报名参加！") {
      // 检查条件
      if (isWinning(currentBattleCondition.condition_haixuan)) {
        // updateBattleResult
        store.commit('updateBattleResult', { year: year, result: '海选'})
        // 根据battleResult统计历史
        const countHistoryHaixuan = store.state.battleResults.filter((battleResult: BattleResult) => battleResult.result === '海选').length
        battleText.value = `恭喜姜云升成功晋级「八强之争」！这是姜云升第${countHistoryHaixuan}次晋级「八强之争」，是否已经准备好迎接观众们热情的呼声与投票了？请问姜云升要现在就继续参加下一轮的比赛吗？`
        battleOptions.value = ["继续参赛！", "再准备准备"]
      } else {
        // 落选
        store.commit('updateBattleResult', { year: year, result: '落选'})
        battleText.value = `很遗憾，姜云升没有通过「海选」，不得不提前离开这个舞台。但你的生命就是这场Battle，继续你的人生吧！`
        battleOptions.value = ["离开比赛"]
      }
      
    } else if (battleOption === "继续参赛！") {
      if (isWinning(currentBattleCondition.condition_baqiang)) {
        // updateBattleResult
        store.commit('updateBattleResult', { year: year, result: '八强'})
        // 根据battleResult统计历史
        const countHistoryBaqiang = store.state.battleResults.filter((battleResult: BattleResult) => battleResult.result === '八强').length
        battleText.value = `恭喜姜云升成功晋级「总决赛」！这是姜云升第${countHistoryBaqiang}次晋级「总决赛」，你的心情是激动还是紧张？请问姜云升要现在就继续参加下一轮的比赛吗？`
        battleOptions.value = ["进入决赛！", "再准备准备"]
      } else {
        battleText.value = `很遗憾，姜云升没有通过「八强之争」，不得不提前离开这个舞台。但你的生命就是这场Battle，继续你的人生吧！`
        battleOptions.value = ["离开比赛"]
      }

    } else if (battleOption === "进入决赛！") {
      if (isWinning(currentBattleCondition.condition_zongjuesai)) {
        // updateBattleResult
        store.commit('updateBattleResult', { year: year, result: '冠军'})
        // 根据battleResult统计历史
        const countHistoryZongjuesai = store.state.battleResults.filter((battleResult: BattleResult) => battleResult.result === '冠军').length
        battleText.value = `恭喜姜云升获得了本届Battle大赛的「总冠军」！这是姜云升第${countHistoryZongjuesai}次获得「总冠军」，他的手被主理人高高举起，台下的欢呼声与喝彩声久久不止。也许时隔多年之后，姜云升会再次回想起这一年、这一刻、这一幕，那时的他会是怎样的心情呢？`
        battleOptions.value = ["结束比赛"]
      } else {
        battleText.value = `经过激烈的角逐，姜云升虽然没有获得本届Battle大赛的冠军，但是，姜云升的生命就是这场Battle，继续你的人生吧！`
        battleOptions.value = ["结束比赛"]
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
      store.dispatch('typeWriter', `胜利是留给有准备的人的！记得留意本届Battle大赛的结束时间是在本年度的十二月，如未完成比赛，将无法获得比赛名次奖励。`)
      store.dispatch('incrementRound');

    } else if (battleOption === "放弃本次比赛") {
      store.commit('updateBattleEnd', { year: year, end: true })
      showBattleDialog.value = false
      store.dispatch('typeWriter', `姜云升放弃了本次Battle大赛。无妨，生命是一场更宏大的Battle，继续你的人生吧！`)
    }
  }
}
</script>