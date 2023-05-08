import { Commit } from 'vuex';
import { store } from '../index';

import { isAtHome, isGoingOut, showBreakupDialog, showSongWritingDialog } from '../../components/composables/gameRefs';

export async function performAction(context: { commit: Commit, dispatch: Function }, action: string) {
  if (action === '外出') {
    if (store.state.attributes.energy >= 0) {
      isGoingOut.value = true;
      await context.dispatch('typeWriter', '打算出发去……');
    } else {
      await context.dispatch('typeWriter', '体力小于零，无法外出。');
    }
  } else if (action === '回家') {
    isAtHome.value = true;
    await context.dispatch('typeWriter', '姜云升回到了家。');
  } else if (action === '写歌') {
    showSongWritingDialog.value = true;
  } else {
    switch (action) {
      case '上课':
        context.commit('updateAttribute', { attribute: 'energy', value: -10 });
        context.commit('updateAttribute', { attribute: 'talent', value: 1 });
        await context.dispatch('typeWriter', '姜云升参加了一堂课，才华+1。');
        break;
      case '赚钱':
        context.commit('updateAttribute', { attribute: 'energy', value: -10 });
        context.commit('updateAttribute', { attribute: 'money', value: 100 });
        await context.dispatch('typeWriter', '姜云升努力工作，赚到了100金钱。');
        break;
      case '出去鬼混':
        if (!store.state.girlfriend) {
          context.commit('updateAttribute', { attribute: 'energy', value: -10 });
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
          return;
        }
        break;
      case '睡觉休息':
        if (store.state.weak) {
          context.commit('updateAttribute', { attribute: 'energy', value: Math.ceil(0.6 * store.state.attributes.maxEnergy) + Math.max(0, 0-store.state.attributes.energy) });
          await context.dispatch('typeWriter', ['姜云升睡了17个小时，体力+60。', '姜云升不虚弱啦！']);
        } else {
          context.commit('updateAttribute', { attribute: 'energy', value: Math.ceil(0.6 * store.state.attributes.maxEnergy) + Math.max(0, 0-store.state.attributes.energy) });
          await context.dispatch('typeWriter', '姜云升睡了17个小时，体力+60。');
        }
        break;
      case '打游戏':
        const gamingIntros = [
          '姜云升一回家就开了一把《永劫有间》！',
          '姜云升今天在游戏里被一个人干翻了，那人昵称叫“不如姜云升”！',
          '姜云升在家，内心忽然有个声音和他说，“打会儿游戏吧”！',
          '工作太累了，来把游戏吧！',
          '姜云升今天想和粉丝一起玩，在游戏里开了个房间。',
          '姜云升今天要让粉丝见识见识自己的游戏水平，开了个房间。',
          '今天游戏版本更新啦，姜云升要去看看。',
          '姜云升今天单排赢了游戏，但他总感觉自己输了人生。',
        ];
        
        const randomGamingIntro = gamingIntros[Math.floor(Math.random() * gamingIntros.length)];
        context.commit('updateAttribute', { attribute: 'energy', value: -10 });
        context.commit('updateAttribute', { attribute: 'game', value: 1 });
        await context.dispatch('typeWriter', [randomGamingIntro, '姜云升打了一局游戏，游戏技术+1。']);
        break;
      default:
        await context.dispatch('typeWriter', '姜云升执行了未知操作：${action}。');
        break;
    } 

    if (store.state.attributes.energy <= -100) {
      context.commit('setGameEnded', { gameEnded: true, specialEndingAchievementName: '姜云升虚弱' });
      context.commit('unlockAchievement', '姜云升虚弱');
    }

    context.commit('incrementRound');
  }
}  