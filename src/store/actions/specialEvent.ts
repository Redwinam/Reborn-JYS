import { Commit } from 'vuex';
import { showEventDialog } from '../../components/composables/gameRefs';
import { Achievement } from '../achievements';

export async function specialEvent(context: { rootState: any; commit: Commit, dispatch: Function }, event: string) {

  if (event === '姜哥，玩挺好') {
    const specialEventDetails = {
      title: '姜哥，玩挺好',
      intro: '这天，姜云升在家陪女朋友，心情很好，忽然想玩点不一样的。决定外卖买个黑丝，外卖订单留哪一个名字呢？',
      options: [
        '【就叫姜云升！】',
        '【叫姜挣钱】',
        '【叫姜云升要谦虚】',
        '【叫姜云升很行】',
        '【叫不如姜云升】',
        '【除了姜云升，叫什么都行】',
      ],
    };
    context.commit('setSpecialEventDetails', specialEventDetails);
    showEventDialog.value = true;
  }  
  else if (event === '生日快乐') {
    const age = Math.floor((context.rootState.round - 16) / 36) + 16
    const specialEventDetails = {
      title: '生日快乐',
      intro: '今天是姜云升的' + age + '岁生日……',
      options: [
        '【祝他生日快乐！！】',
      ],
    };
    context.commit('setSpecialEventDetails', specialEventDetails);
    showEventDialog.value = true;
  }
}  

export async function specialEventOptionChosen(context: {
  rootState: any; commit: Commit, dispatch: Function 
}, payload: { event: string; option: string }) {
  if (payload.event === '姜哥，玩挺好') {
    if (payload.option !== '【除了姜云升，叫什么都行】') {
      context.commit('unlockAchievement', payload.event);
      await context.dispatch('typeWriter', ['片刻后，外卖小哥咚咚咚敲了敲门，送了外卖，看到你开门就笑了，留下了一句“姜哥，玩挺好”。','恭喜，姜云升解锁了第' + context.rootState.achievements.filter((ach: Achievement) => ach.unlocked).length + '个成就【' + payload.event + '】。']);
    }
  }
  else if (payload.event === '生日快乐') {
    if (context.rootState.round === 16) {
      context.commit('unlockAchievement', payload.event);
      await context.dispatch('typeWriter', ['姜云升的生日过得很开心，恭喜，姜云升解锁了第' + context.rootState.achievements.filter((ach: Achievement) => ach.unlocked).length + '个成就【' + payload.event + '】。']);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    await context.dispatch('typeWriter', ['姜云升收到了长辈的1000元生日红包！']);
    await new Promise(resolve => setTimeout(resolve, 1000));
    context.commit('updateAttribute', { attribute: 'money', value: 1000 });
    await context.dispatch('typeWriter', ['长大一岁了，这一年姜云升又学到了许多，才华+10！', '又长帅了许多，魅力+10！']);
    context.commit('updateAttribute', { attribute: 'talent', value: 10 });
    context.commit('updateAttribute', { attribute: 'charm', value: 10 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await context.dispatch('typeWriter', ['又强壮了许多，最大体力值+10！', '体力恢复满格！', '心情恢复满格！']);
    context.commit('updateAttribute', { attribute: 'maxEnergy', value: 10 });
    context.commit('updateAttribute', { attribute: 'energy', value: context.rootState.attributes.maxEnergy });
    context.commit('updateAttribute', { attribute: 'mood', value: 100 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await context.dispatch('typeWriter', ['祝姜云升生日快乐！']);
  }
}