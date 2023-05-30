import { Commit } from 'vuex';
import { store } from '../index';

import { isAtHome, isGoingOut, showBreakupDialog, showSongWritingDialog } from '../../components/composables/gameRefs';
import { SkillLevelMapping } from './upgradeSkill';
import { vitaminLibrary } from '../vitamins';

export async function performAction(context: { commit: Commit, dispatch: Function }, action: string) {

  if (action === '外出') {
    if (store.state.attributes.energy >= 0) {
      isGoingOut.value = true;
      await context.dispatch('typeWriter', '打算出发去……');

      if (store.state.year > 2012 && store.state.girlfriend) {
        const existingAchievement = store.state.achievements.find(
          (ach) => ach.name === '放松，呼吸' && ach.unlocked
        );
        
        if (!existingAchievement && !store.state.happenedEvents.includes('放松，呼吸')) {
          const currentRoundInYear = store.state.round % 36;
          const isSpring = currentRoundInYear >= 3 && currentRoundInYear < 15; // 假设一年36轮，4-15轮为春天

          if (isSpring) {
            if (Math.random() < 0.3) {
              context.dispatch('specialEvent', '放松，呼吸');
            }
          }
        }
      }

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
        await context.dispatch('typeWriter', '姜云升参加了一堂课，才华+10。');
        break;

      case '赚钱':
        context.commit('updateAttribute', { attribute: 'energy', value: -10 });
        context.commit('updateAttribute', { attribute: 'money', value: 100 });
        await context.dispatch('typeWriter', '姜云升努力工作，赚到了100金钱。');
        break;

      case '出去鬼混':
        if (!store.state.girlfriend) {
          const toMessage = [];
          context.commit('updateAttribute', { attribute: 'energy', value: -10 });
          context.commit('updateAttribute', { attribute: 'charm', value: 10 });
          context.commit('updateAttribute', { attribute: 'mood', value: 10 });          
          if (store.state.flirtCount) {
            toMessage.push('姜云升又成功地搭讪了一个姑娘，魅力+10，心情+10。');
          } else {
            if (store.state.lastBreakupTerm && store.state.term - store.state.lastBreakupTerm < 2){
              context.commit('setSeamlessRelation', true);
              toMessage.push('姜云升可真有你的，刚分手就出来鬼混。');
            } else {
              context.commit('setSeamlessRelation', false);
            }
            toMessage.push('姜云升成功地搭讪了一个姑娘，魅力+10，心情+10。');
          }

          context.commit('incrementFlirtCount');
          if (store.state.flirtCount >= 3) {
            const randomGirlfriend = store.state.girlfriendTypes[Math.floor(Math.random() * store.state.girlfriendTypes.length)];
            context.commit('setGirlfriend', randomGirlfriend);
            context.commit('resetFlirtCount');
            context.commit('resetRelationRound');

            toMessage.push(`恭喜！姜云升交到了一个${randomGirlfriend.type}。`);
          }

          await context.dispatch('typeWriter', toMessage);
        } else {
          await context.dispatch('typeWriter', '姜云升已经有女朋友了，不能再出来鬼混把妹了。快去陪陪你的女朋友吧！');
          return;
        }
        break;

      case '睡觉休息':
        const addEnergy = Math.ceil(0.6 * store.state.attributes.maxEnergy) + Math.max(0, 0-store.state.attributes.energy);
        context.commit('addSleepHours', 17);
        if (store.state.weak) {
          context.commit('updateAttribute', { attribute: 'energy', value: addEnergy });
          await context.dispatch('typeWriter', ['姜云升睡了17个小时，体力+' + addEnergy +'。', '姜云升不虚弱啦！']);
        } else {
          context.commit('updateAttribute', { attribute: 'energy', value: addEnergy });
          await context.dispatch('typeWriter', '姜云升睡了17个小时，体力+' + addEnergy +'。');
        }

        if (store.state.sleepHours >= 500) {
          const hasAchievement = store.state.achievements.find(
            (ach) => ach.name === '时间很长' && ach.unlocked
          );
          if (!hasAchievement) {
            store.commit('unlockAchievement', '时间很长');
            await context.dispatch('typeWriter', ['姜云升解锁了第' + store.state.achievements.filter((ach: { unlocked: any; }) => ach.unlocked).length + '个成就【时间很长】，指的是姜云升的睡眠时间很长，在一轮游戏中累计睡眠时间达到500个小时！']);
          }
        }

        break;

      case '打游戏':
        const gamingIntros = [
          '姜云升一回家就开了一把《有间永劫》！',
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
        context.commit('updateAttribute', { attribute: 'mood', value: 20 });

        const skill = 'gaming';
        for (const level of SkillLevelMapping) {
          if (store.state.attributes.skill.gaming === level.max) {
            await context.dispatch('typeWriter', [randomGamingIntro, '姜云升的电竞技能进入了瓶颈期，需要通过考验才能升级！']);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await context.dispatch('upgradeSkill', { skill, level: level.level });
            break;
          } 
        }

        context.commit('updateAttribute', { attribute: 'gaming', value: 1 });
        await context.dispatch('typeWriter', [randomGamingIntro, '姜云升体力-10，心情+20，电竞技能值+1，当前电竞技能等级为【' + store.state.attributes.skill.gamingLevel + '】']);
        break;

      case '开直播':
        if (store.state.attributes.energy < 0) {
          await context.dispatch('typeWriter', '姜云升今天太累啦，没办法开直播了。');
          return;
        }
        const existingAchievement = store.state.achievements.find(
          (ach) => ach.name === '醉酒小姜' && ach.unlocked
        );
        
        if (store.state.drunk > 0 && !existingAchievement ) {
          context.commit('updateAttribute', { attribute: 'energy', value: -10 });
          context.commit('updateAttribute', { attribute: 'red', value: (300 + Math.floor(Math.random() * 0.12 * store.state.attributes.popularity.red)) });
          context.commit('updateAttribute', { attribute: 'divine', value: 9 });
          context.commit('unlockAchievement', '醉酒小姜');
          await context.dispatch('typeWriter', ['姜云升今天喝醉了，却还是开了直播，讲了好多平时不会讲的话。酒渐醒，拉开窗帘，窗外是日出。', '姜云升的人气增加了，一项神秘的属性增加了。', '解锁了第' + store.state.achievements.filter((ach) => ach.unlocked).length + '个成就【醉酒小姜】']);
          break;
        } else if (store.state.drunk > 0 && existingAchievement) {
          await context.dispatch('typeWriter', '姜云升今天喝醉了，就不开直播了。');
          break;
        }

        const liveStreamingIntros = [
          '姜云升今天开直播啦！',
          '姜云升今天要在练刀房暴虐粉丝，开直播啦！',
          '姜云升今天要给粉丝们讲讲前任们的故事，开直播啦！',
          '姜云升今天蟒爷上身，开直播啦！',
          '姜云升刚刚下班，开直播啦！',
          '姜云升今天受伤了，要和粉丝说说，开直播啦！',
          '姜云升今天要补直播时长，开直播啦！',
          '姜云升今天在等开饭，顺便开直播啦！',
        ];
        const randomLiveStreamingIntro = liveStreamingIntros[Math.floor(Math.random() * liveStreamingIntros.length)];
        context.commit('updateAttribute', { attribute: 'energy', value: -10 });
        const redValue = 5 + Math.floor(Math.random() * 0.12 * store.state.attributes.popularity.red);
        const blackValue = 2 + Math.floor(Math.random() * 0.08 * store.state.attributes.popularity.black);
        context.commit('updateAttribute', { attribute: 'red', value: redValue });
        context.commit('updateAttribute', { attribute: 'black', value: blackValue });

        // 人气高是开直播获得金钱奖励
        if (store.state.attributes.popularity.red > 1000) {
          const money = 1000 + Math.floor(Math.random() * 0.666 * store.state.attributes.popularity.red);
          context.commit('updateAttribute', { attribute: 'money', value: money });
          await context.dispatch('typeWriter', [randomLiveStreamingIntro, '姜云升的人气红值+' + redValue + '，黑值+' + blackValue + '，姜云升直播间人气爆棚，获得了' + money + '元礼物。']);
        } else {
          await context.dispatch('typeWriter', [randomLiveStreamingIntro, '姜云升的人气红值+' + redValue + '，黑值+' + blackValue]);
        }

        const unlockedVitamins = store.state.unlockedVitamins;
        const lockedVitamins = vitaminLibrary.filter((vitamin: { type: any; }) => !unlockedVitamins.find((uv: { type: any; }) => uv.type === vitamin.type));

        if (Math.random() < 0.5) {
          if (lockedVitamins.length > 0) {
            let vitamin = lockedVitamins[Math.floor(Math.random() * lockedVitamins.length)];
            store.commit('unlockVitamin', vitamin);

            context.commit('updateAttribute', { attribute: 'maxEnergy', value: 10 });
            await context.dispatch('typeWriter', ['粉丝们提醒姜姜要吃维生素片噢，【' + vitamin.type + '】' + vitamin.benefits + '。', '姜云升的体力上限+10！']);

            if (lockedVitamins.length === 1) {
              const hasAchievement = store.state.achievements.find(
                (ach) => ach.name === '谢谢你们提醒我吃维生素' && ach.unlocked
              );
              if (!hasAchievement) {
                store.commit('unlockAchievement', '谢谢你们提醒我吃维生素');
                await context.dispatch('typeWriter', ['姜云升集齐了所有维生素片，解锁了第' + store.state.achievements.filter((ach: { unlocked: any; }) => ach.unlocked).length + '个成就【谢谢你们提醒我吃维生素】！']);
              }
            }
          } else {
            await context.dispatch('typeWriter', '粉丝们提醒姜姜要吃维生素ABCDEK噢。');
          }
        }

        break;
        
      default:
        await context.dispatch('typeWriter', `姜云升执行了未知操作：${action}。`);
        break;
    } 
    context.dispatch('incrementRound');
  }
}  