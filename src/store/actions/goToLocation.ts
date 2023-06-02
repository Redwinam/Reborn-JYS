import { Commit } from 'vuex';
import { allFoods } from '../eats';
import { Achievement } from '../achievements';
import { SkillLevelMapping } from './upgradeSkill';
import { showFoodPopup, showDrinkPopup, showShopPopup, showBankPopup, showUnsignAgencyDialog, showBattleDialog, showUndergroundPopup, showDaoPopup } from '../../components/composables/gameRefs';
import store from '..';

export async function goToLocation(context: {
  state: any; commit: Commit, dispatch: Function, getters: any
}, location: string) {
  await context.dispatch('typeWriter', '正在前往：' + location)
  switch (location) {
    case '去吃点东西':
      const unlockedFoods = context.state.unlockedFoods;
      const lockedFoods = allFoods.filter((food: { name: any; }) => !unlockedFoods.find((uf: { name: any; }) => uf.name === food.name));
      if (lockedFoods.length > 0) {
        let newFood = lockedFoods[Math.floor(Math.random() * lockedFoods.length)];
        if (unlockedFoods.length === 0) {
          newFood = lockedFoods[0];
        }
        context.commit('unlockFood', newFood);
        const foodIntros = [
          '姜云升出门去找好吃的，无意间发现了一家看起来很不错的餐馆，点了一份' + newFood.name + '，太好吃了。',
          '今天，姜云升和朋友去聚餐，吃到了超好吃的' + newFood.name + '。',
          '「后来我又去过和你相遇的那家店」……姜云升想起了曾经一起吃过的' + newFood.name + '。',
          '姜云升走在路边看到一家店的招牌菜' + newFood.name + '，噔噔噔地跑了过去……',
          '姜云升出门旅游，发现了一家当地的特色餐馆，他兴致勃勃地尝了一口' + newFood.name + '，真不错。',
          '小姜有什么坏心思呢，小姜只是想吃饭而已，外卖点了一份' + newFood.name + '。',
        ];
        
        const randomIntro = foodIntros[Math.floor(Math.random() * foodIntros.length)];
        await context.dispatch('typeWriter', [randomIntro,'解锁新食物：【' + newFood.name + '】', '<small>姜云升的体力上限增加啦！</small>']);

        if (unlockedFoods.length === 18) {
          const isAchUnlocked = context.getters.unlockedAchievement('小姜的餐厅');
          if (!isAchUnlocked) {
            context.commit('unlockAchievement', '小姜的餐厅');
            await context.dispatch('typeWriter', '姜云升已经解锁了所有的食物，解锁了第' + context.getters.UnlockedAchievementCount + '个成就【小姜的餐厅】。');
          }
        }
      }
      // 等待1秒钟
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 显示已解锁食物的列表，让玩家选择
      showFoodPopup.value = true;
      break;

    case '去喝点东西':
      await new Promise(resolve => setTimeout(resolve, 200));
      // 椰奶咖啡
      // await context.dispatch('typeWriter', '姜云升去了酒吧，喝了一顿酒。')
      // context.commit('updateAttribute', { attribute: 'energy', value: 10 })
      showDrinkPopup.value = true;
      break;

    case 'Underground':
      const skill = 'freestyle';
      for (const level of SkillLevelMapping) {
        if (context.state.attributes.skill.freestyle === level.max && level.max !== 24) {
          await new Promise(resolve => setTimeout(resolve, 200));
          await context.dispatch('typeWriter', ['姜云升的freestyle技能进入了瓶颈期，考验你会不会freestyle的时候到了，需要答对所有歌词才能升级！']);
          await new Promise(resolve => setTimeout(resolve, 600));
          await context.dispatch('upgradeSkill', { skill, level: level.level });
          return;

        } else if ((context.state.attributes.skill.freestyle >= level.min && context.state.attributes.skill.freestyle < level.max) || (context.state.attributes.skill.freestyle === level.max && level.max === 24)) {
          context.commit('updateAttribute', { attribute: 'energy', value: -25 })
          switch (context.state.undergroundCount) {
            case 0:
              await context.dispatch('typeWriter', '这是姜云升第一次来到这个世界，他在这里感受到了不一样的力量，彼时的他是否已经在这里看到了自己的未来了呢？')
              context.commit('updateAttribute', { attribute: 'red', value: 1 })
              context.commit('updateAttribute', { attribute: 'black', value: 1 })
              break;
    
            case 1:
              await context.dispatch('typeWriter', '咦？又走到了这里。姜云升再次被这里的力量吸引，忽然……')
              await new Promise(resolve => setTimeout(resolve, 1000));
              context.dispatch('specialEvent', '去看热闹');
              break;
    
            case 2:
              context.commit('updateAttribute', { attribute: 'mood', value: 10 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              await context.dispatch('typeWriter', '第三次来到这里，姜云升开始学着和一些MC们一起Freestyle Battle，真是，学好不容易，学坏一出溜。出于公序良俗和青少年优良学风引导的考虑，Battle内容过于低俗，这里不便展开。<small>姜云升心情+10，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;
    
            case 3:
              context.commit('updateAttribute', { attribute: 'mood', value: 10 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              await context.dispatch('typeWriter', '第四次来到这里，姜云升决心把所有的心血都投入到音乐和说唱里。<small>姜云升心情+10，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;
            
            case 4:
              context.commit('updateAttribute', { attribute: 'mood', value: -10 });
              context.commit('updateAttribute', { attribute: 'black', value: 100 });
              await context.dispatch('typeWriter', '第五次来到这里，悲伤的故事发生了！也不知道怎么做到的，姜云升被这里所有的圈子给封杀了。<small>姜云升心情-10，黑人气+100！</small>');
              break;

            case 5:
              context.commit('updateAttribute', { attribute: 'talent', value: 10 });
              context.commit('updateAttribute', { attribute: 'charm', value: 10 });
              context.commit('updateAttribute', { attribute: 'red', value: 200 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              await context.dispatch('typeWriter', '第六次来到这里，姜云升决定用心参加各类比赛和选秀，想要出头。<small>才华+10，魅力+10，人气+200，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;

            case 6:
              context.commit('updateAttribute', { attribute: 'mood', value: -10 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              await context.dispatch('typeWriter', '第七次来到这里，姜云升参加了一档综艺节目，可晋级后主办方却没了消息。<small>姜云升心情-10，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;

            case 7:
              context.commit('updateAttribute', { attribute: 'mood', value: -10 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              await context.dispatch('typeWriter', '第八次来到这里，姜云升参加了一场说唱比赛，结果告负。<small>姜云升心情-10，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;

            case 8:
              context.commit('updateAttribute', { attribute: 'mood', value: -10 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              await context.dispatch('typeWriter', '第九次来到这里，姜云升又参加了一场说唱比赛，结果依然告负。<small>姜云升心情-10，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;

            case 9:
              context.commit('updateAttribute', { attribute: 'mood', value: -30 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              await context.dispatch('typeWriter', '第十次来到这里，姜云升坚持参加了很多很多比赛，全部告负。<small>姜云升心情-30，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;

            case 10:
              context.commit('updateAttribute', { attribute: 'mood', value: 60 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              context.commit('updateAttribute', { attribute: 'red', value: 200 });
              await context.dispatch('typeWriter', '第十一次来到这里，姜云升参加了第五届K.O.B，终于拿到了冠军。他开始有了朋友，以为生活开始变好。<small>姜云升心情+60，人气+200，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;

            case 11:
              context.commit('updateAttribute', { attribute: 'mood', value: 10 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              context.commit('updateAttribute', { attribute: 'red', value: 600 });
              await context.dispatch('typeWriter', '第十二次来到这里，两年时间，姜云升拿了Iron Mic、地下8英里、干一票、三寸不烂之舌昆明站的冠军。<small>姜云升心情+10，人气+600，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;

            case 12:
              context.commit('updateAttribute', { attribute: 'mood', value: -10 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              await context.dispatch('typeWriter', '第十三次来到这里，姜云升依旧害怕输和失败，“其实就算是那些获胜的比赛，你看不见的地方，我的手臂也在颤抖着，我畏惧失败”。<small>姜云升心情-10，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;

            case 13:
              context.commit('updateAttribute', { attribute: 'mood', value: 9 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              context.commit('updateAttribute', { attribute: 'red', value: 1000 });
              await context.dispatch('typeWriter', '第十四次来到这里，姜云升代表家乡云南昆明来西安参加「干一票」总决赛，在这里他找到了自信和前进下去的动力。<small>姜云升心情+9，人气+1000，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;

            case 14:
              context.commit('updateAttribute', { attribute: 'mood', value: 10 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              context.commit('updateAttribute', { attribute: 'red', value: 600 });
              await context.dispatch('typeWriter', '第十五次来到这里，姜云升和朋友组建了自己的说唱团队，拿下了一个又一个冠军。<small>姜云升心情+10，人气+600，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;

            case 15:
              context.commit('updateAttribute', { attribute: 'mood', value: 10 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              context.commit('updateAttribute', { attribute: 'red', value: 1000 });
              context.commit('updateAttribute', { attribute: 'money', value: 5000 });
              await context.dispatch('typeWriter', '第十六次来到这里，姜云升的说唱团队举办了演出专场，破了昆明的票房纪录。<small>姜云升心情+10，人气+1000，金钱+5000，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;

            case 16:
              context.commit('updateAttribute', { attribute: 'mood', value: -10 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              await context.dispatch('typeWriter', '第十七次来到这里，姜云升的厂牌宣告分裂。<small>姜云升心情-10，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;
              
            case 17:
              context.dispatch('specialEvent', '二八分');
              break;

            case 18:
              context.commit('updateAttribute', { attribute: 'mood', value: -90 });
              context.dispatch('typeWriter', '第十九次来到这里，姜云升和徒弟前往深圳参加铁麦决赛，惨遭淘汰。他觉得自己看明白了许多事情，意冷心灰，决定放弃说唱。<small>姜云升心情-90。</small>');
              break;

            case 19:
              context.commit('updateAttribute', { attribute: 'mood', value: 10 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              await context.dispatch('typeWriter', '第二十次来到这里，姜云升重新点开了电脑上的伴奏，唱了一夜。<small>姜云升心情+10，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;

            case 20:
              context.commit('updateAttribute', { attribute: 'mood', value: 10 });
              context.commit('updateAttribute', { attribute: 'freestyle', value: 1 });
              context.commit('updateAttribute', { attribute: 'red', value: 2000 });
              await context.dispatch('typeWriter', '第二十一次来到这里，姜云升一个人收拾好行李，前往重庆参加「地下8英里」，在那他收获了第一批因为他的音乐而支持他的人，他有了自己的粉丝。<small>姜云升心情+10，人气+2000，freestyle技能值+1，当前freestyle技能等级为【' + context.state.attributes.skill.freestyleLevel + '】</small>');
              break;

            case 21:
              await context.dispatch('typeWriter', '行李箱滚轮和布满碎石子的路面摩擦，咯哒咯哒的声音传出老远。');
              await context.dispatch('typeWriter', '第一百步，接到母亲的电话，她怕我跌在黑暗里头破血流，更怕我一去不返。');
              await context.dispatch('typeWriter', '第二百步，听到背后的揶揄，傲睨自若，视我如草芥。');
              await context.dispatch('typeWriter', '第三百步，飘来颓坏的腐气，唯见木然的瞳孔。');
              await context.dispatch('typeWriter', '第四百步，同行者或三五结伴，或形单影只。快或慢，远或近，大多消失在岔路口。');
              await context.dispatch('typeWriter', '第五百步，你弃我如敝履。');
              await context.dispatch('typeWriter', '第六百步，我走不动了。');
              await context.dispatch('typeWriter', '第七百步，于绝望中看到北辰，强撑着爬起来，丢掉行李再启程。');
              await context.dispatch('typeWriter', '第八百步，狂笑声从头顶传来，探头一瞥，镶嵌金边的窗内人影憧憧，美酒，美食，美人，主人开门请我入座。');
              await context.dispatch('typeWriter', '第九百步，昏黄之光点此刻已如太阳。<br><small>——习作《深巷》 / 姜云升</small>');
              break;

            default:
              showUndergroundPopup.value = true;
              return;
          }
        }
      }

      if (context.state.term > 1 && context.state.skills.freestyle >= 15 && !context.state.happenedEvents.includes('二八分')) {
        context.dispatch('specialEvent', '二八分');
      }

      context.commit('incrementUndergroundCount');
      context.dispatch('incrementRound');
      break;

    case '去剪头发':
      const haircutCost = 100; // 剪头发的花费
      
      // 检查用户是否有足够的金钱进行剪头发
      if (context.state.attributes.money < haircutCost) {
        await context.dispatch('typeWriter', '剪发费用需要100元。幸好，姜云升没有足够的钱来剪头发。');
        break; // 如果没有足够的金钱，就结束这个 case
      }
    
      // 扣除剪头发的花费
      context.commit('updateAttribute', { attribute: 'money', value: - haircutCost });
      
      const hasSunglasses = context.state.inventory['墨镜'];
      const isAchUnlocked = context.getters.unlockedAchievement('小学升戴墨镜');
      if (hasSunglasses && !isAchUnlocked) {
        context.commit('updateAttribute', { attribute: 'charm', value: -100 })
        context.commit('unlockAchievement', '小学升戴墨镜');
        await context.dispatch('typeWriter', '姜云升戴着墨镜去剪了个新发型，花费100元，魅力-100。解锁了第' + context.getters.UnlockedAchievementCount + '个成就【小学升戴墨镜】（不建议戴）。')
      } else if (hasSunglasses && isAchUnlocked) {
        await context.dispatch('typeWriter', '姜云升再次戴着墨镜去剪了个新发型，花费100元，魅力-20。')
        context.commit('updateAttribute', { attribute: 'charm', value: -20 })
      } else {
        await context.dispatch('typeWriter', '姜云升出门去剪了个新发型，花费100元，魅力-10。')
        context.commit('updateAttribute', { attribute: 'charm', value: -10 })
      }
    
      context.dispatch('incrementRound');
      break;
      
      
    case '买东西':
      await new Promise(resolve => setTimeout(resolve, 200));
      showShopPopup.value = true;
      break;

    case '地下钱庄之暴富金铺':
      await new Promise(resolve => setTimeout(resolve, 600));
      showBankPopup.value = true;
      break;

    case '公司':
      if (store.state.attributes.energy < 0) {
        await context.dispatch('typeWriter', "姜云升体力<0，就别去公司上班啦！");
        return
      }
      const leftUnsignAgencyMonth = Math.max(Math.ceil((36 - (context.state.round - context.state.signedAgencyRound)) / 3), 0 )
      if (leftUnsignAgencyMonth <= 0) {
        showUnsignAgencyDialog.value = true;
      } else {
        const agencyIntros = [
          '姜云升今天在公司通宵写了一晚上的歌词，收入金钱+20',
          '姜云升今天在公司上公司安排的课程，支出金钱-200，才华+3',
          '姜云升今天发现公司在你不知情的情况下向粉丝贩卖你的周边，心情-20，人气+5',
          '今天公司安排你去夜店演出，收入金钱+20',
          '你写出了一首爆火的歌，公司用100元买下了它的版权',
          '今天公司安排你接一个商演，收入金钱+20',
          '今天公司终于安排你去参加了一个综艺节目，人气+10',
          '今天公司安排你接一条商业广告，收入金钱+20',
        ];
        let randomAgency = Math.floor(Math.random() * agencyIntros.length);
        if (context.state.goToAgencyTimes === 0) { randomAgency = 0; }

        context.commit('updateAttribute', { attribute: 'energy', value: -80 });
        switch (randomAgency){
          case 0:
            context.commit('updateAttribute', { attribute: 'money', value: 20 * 5 });
            break;
          case 1:
            context.commit('updateAttribute', { attribute: 'money', value: -200 });
            context.commit('updateAttribute', { attribute: 'talent', value: 3 });
            break;
          case 2:
            context.commit('updateAttribute', { attribute: 'mood', value: -20 });
            context.commit('updateAttribute', { attribute: 'red', value: 5 });
            break;
          case 3:
            context.commit('updateAttribute', { attribute: 'money', value: 20 * 5 });
            break;
          case 4:
            context.commit('updateAttribute', { attribute: 'money', value: 100 * 5});
            break;
          case 5:
            context.commit('updateAttribute', { attribute: 'money', value: 20 * 5 });
            break;
          case 6:
            context.commit('updateAttribute', { attribute: 'red', value: 10 });
            break;
          case 7:
            context.commit('updateAttribute', { attribute: 'money', value: 20 * 5 });
            break;
        }

        await context.dispatch('typeWriter', agencyIntros[randomAgency] + "，体力-80。");

        context.commit('incrementGoToAgencyTimes');
        context.dispatch('incrementRound');
      }
      break;

    case '上山修行':
      // 体力<0
      if (store.state.attributes.energy < 0) {
        await context.dispatch('typeWriter', "姜云升体力<0，上不动山啦！");
        return
      }
      await new Promise(resolve => setTimeout(resolve, 200));
      showDaoPopup.value = true;
      break;

    case 'Battle大赛':
      await new Promise(resolve => setTimeout(resolve, 200));
      showBattleDialog.value = true;
      break;
  }
}