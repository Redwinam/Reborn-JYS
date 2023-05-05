import { Commit } from 'vuex';
import { store } from '../index';

import { isAtHome, isGoingOut, showBreakupDialog, showSongWritingDialog } from '../../components/composables/gameRefs';

export async function performAction(context: { commit: Commit, dispatch: Function }, action: string) {
  if (action === '外出') {
    if (store.state.attributes.energy >= 0) {
      context.commit('setIsGoingOut', true);
      await context.dispatch('typeWriter', '打算出发去……');
    } else {
      await context.dispatch('typeWriter', '体力小于零，无法外出。');
    }
  } else {
    context.commit('updateAttribute', { attribute: 'energy', value: -10 });
    context.commit('incrementRound');

    switch (action) {
      case '上课':
        context.commit('updateAttribute', { attribute: 'talent', value: 1 });
        await context.dispatch('typeWriter', '姜云升参加了一堂课，才华+1。');
        break;
      case '赚钱':
        context.commit('updateAttribute', { attribute: 'money', value: 100 });
        await context.dispatch('typeWriter', '姜云升努力工作，赚到了100金钱。');
        break;
      case '出去鬼混':
        if (!store.state.girlfriend) {
          context.commit('updateAttribute', { attribute: 'charm', value: 1 });
          const toMessage = [];
          if (store.state.flirtCount) {
            toMessage.push('姜云升又成功地搭讪了一个姑娘，魅力+1。');
          } else {
            toMessage.push('姜云升成功地搭讪了一个姑娘，魅力+1。');
          }

          context.commit('incrementFlirtCount');
          if (store.state.flirtCount >= 3) {
            const randomGirlfriend = store.state.girlfriendTypes[Math.floor(Math.random() * store.state.girlfriendTypes.length)];
            context.commit('setGirlfriend', randomGirlfriend);
            context.commit('resetFlirtCount');

            toMessage.push(`恭喜！姜云升交到了一个${randomGirlfriend.type}。`);
          }

          await context.dispatch('typeWriter', toMessage);
        } else {
          await context.dispatch('typeWriter', '姜云升已经有女朋友了，不能再出来鬼混把妹了。快去陪陪你的女朋友吧！');
        }
        break;
      case '回家':
        isAtHome.value = true;
        await context.dispatch('typeWriter', '姜云升回到了家。');
        break;
      case '睡觉休息':
        if (store.state.weak) {
          context.commit('updateAttribute', { attribute: 'energy', value: 60 - store.state.attributes.energy });
          await context.dispatch('typeWriter', ['姜云升睡了17个小时，体力+60。', '姜云升不虚弱啦！']);
        } else {
          context.commit('updateAttribute', { attribute: 'energy', value: 60 });
          await context.dispatch('typeWriter', '姜云升睡了17个小时，体力+60。');
        }
        break;
      case '写歌':
        context.commit('setShowSongWritingDialog', true);
        break;
        // 其他情况的代码
      default:
        await context.dispatch('typeWriter', '姜云升执行了未知操作：${action}。');
        break;
    } 

    if (store.state.attributes.energy <= -100) {
      context.commit('setGameEnded', { gameEnded: true, specialEndingAchievementId: 'jiangyunsheng-weak' });
      context.commit('unlockAchievement', 'jiangyunsheng-weak');
    }
  }
}  