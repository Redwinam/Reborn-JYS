import { Commit } from 'vuex';
import { showEventDialog } from '../../components/composables/gameRefs';
import { Achievement } from '../achievements';

export async function specialEvent(context: { rootState: any; commit: Commit, dispatch: Function }, event: string) {
  context.commit('addHappenEvent', event);

  if (event === '姜哥，玩挺好') {
    const specialEventDetails = {
      title: '姜哥，玩挺好',
      intro: '这天，姜云升在家陪女朋友，心情很好，忽然想玩点不一样的。决定外卖买个黑丝，外卖订单留哪一个名字呢？',
      options: [
        '【就叫姜云升！】',
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

  else if (event === '上去看看') {
    const specialEventDetails = {
      title: '上去看看',
      intro: '忽然姜云升听见远处一阵热闹，姜云升决定……”',
      options: [
        '【上去看看】',
        '【不感兴趣】',
      ]
    };
    context.commit('setSpecialEventDetails', specialEventDetails);
    showEventDialog.value = true;
  }

  else if (event === '放松，呼吸') {
    const specialEventDetails = {
      title: '放松，呼吸',
      intro: '春暖花开，万物复苏，你的好朋友约你出门旅游，要去散散心吗？',
      options: [
        '【去丽江旅游】',
        '【打死不去】',
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
    if (context.rootState.round === 16 && context.rootState.term === 1) {
      context.commit('unlockAchievement', payload.event);
      await context.dispatch('typeWriter', ['姜云升的生日过得很开心，恭喜，姜云升解锁了第' + context.rootState.achievements.filter((ach: Achievement) => ach.unlocked).length + '个成就【' + payload.event + '】。']);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      await context.dispatch('typeWriter', ['姜云升的生日过得很开心。']);
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
    context.commit('updateAttribute', { attribute: 'mood', value: 100 - context.rootState.attributes.mood });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await context.dispatch('typeWriter', ['祝姜云升生日快乐！']);
  }

  else if (payload.event === '上去看看') {
    if (payload.option === '【上去看看】') {
      await context.dispatch('typeWriter', ['明明是几个人在那互骂，姜云升却越听越觉得有意思，开心极了，甚至还想加入他们！', '这是他第一次在现场看到什么叫说唱Battle。', '你选择的路，和他一样吗？']);
      context.commit('updateAttribute', { attribute: 'mood', value: 100 });
      context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      await context.dispatch('typeWriter', ['姜云升的freestyle技能值+1，当前freestyle技能等级为【' + context.rootState.attributes.skill.freestyleLevel + '】']);
    } else {
      await context.dispatch('typeWriter', ['姜云升对此不感兴趣，错过了一次说唱Battle，但是也没有什么大不了的。']);
    }
  }

  else if (payload.event === '放松，呼吸') {
    if (payload.option === '【去丽江旅游】') {
      await context.dispatch('typeWriter', ['姜云升开心地出门去玩啦！但在旅游的时候，你忽然有一种奇怪的预感，于是你给女朋友打了许多电话，她都没有接。果不其然，姜云升被绿了。在姜云升和女朋友分手之后，没想到，你女朋友还找人打了你一顿。']);
      // 和女朋友和平分手
      context.rootState.hasGirlfriend = false;
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 她女朋友还找人打他，姜云升体力-60，心情-99
      context.commit('updateAttribute', { attribute: 'energy', value: Math.max(context.rootState.attributes.energy - 60, -90) });
      context.commit('updateAttribute', { attribute: 'mood', value: Math.max(context.rootState.attributes.mood - 99, -99) });
      await context.dispatch('typeWriter', ['姜云升体力-60，心情-99。']);

      await new Promise(resolve => setTimeout(resolve, 1000));
      context.commit('unlockAchievement', payload.event);
      await context.dispatch('typeWriter', ['姜云升解锁了第' + context.rootState.achievements.filter((ach: Achievement) => ach.unlocked).length + '个成就【放松，呼吸】。']);
    } else {
      await context.dispatch('typeWriter', ['姜云升选择了不去丽江旅游，避免了一次巨大的伤害。']);
    }
  }
}