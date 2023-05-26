import { Commit } from 'vuex';
import { Food, allFoods } from '../eats';
import { showFoodPopup, showDrinkPopup, showShopPopup } from '../../components/composables/gameRefs';
import { Achievement } from '../achievements';

export async function goToLocation(context: {
  state: any; commit: Commit, dispatch: Function 
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
        await context.dispatch('typeWriter', [randomIntro,'解锁新食物：【' + newFood.name + '】', '姜云升的体力上限增加啦！']);
      } else {
        const hasAchievement = context.state.achievements.find(
          (ach: Achievement) => ach.name === '小姜的餐厅' && ach.unlockTerm === context.state.term
        );
        if (!hasAchievement) {
          context.commit('unlockAchievement', '小姜的餐厅');
          await context.dispatch('typeWriter', '姜云升已经解锁了所有的食物，解锁了第' + context.state.achievements.filter((ach: Achievement) => ach.unlocked).length + '个成就【小姜的餐厅】。');
        }
      }
      // 等待1秒钟
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 显示已解锁食物的列表，让玩家选择
      showFoodPopup.value = true;
      break;

    case '去喝点东西':
      // 椰奶咖啡
      // await context.dispatch('typeWriter', '姜云升去了酒吧，喝了一顿酒。')
      // context.commit('updateAttribute', { attribute: 'energy', value: 10 })
      showDrinkPopup.value = true;
      break;

    case 'Underground':
      switch (context.state.undergroundCount) {
        case 0 :
          await context.dispatch('typeWriter', '这是姜云升第一次来到这个世界，他在这里感受到了不一样的力量，彼时的他是否已经在这里看到了自己的未来了呢？')
          // 黑红属性各增加1
          context.commit('updateAttribute', { attribute: 'red', value: 1 })
          context.commit('updateAttribute', { attribute: 'black', value: 1 })
          break;

        case 1 :
          await context.dispatch('typeWriter', '咦？又走到了这里。姜云升再次被这里的力量吸引，忽然……')
          await new Promise(resolve => setTimeout(resolve, 1000));
          context.dispatch('specialEvent', '上去看看');

      }
      context.commit('incrementUndergroundCount');
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
        const hasAchievement = context.state.achievements.find(
          (ach: Achievement) => ach.name === '小学升戴墨镜' && ach.unlockTerm === context.state.term
        );
      
        if (hasSunglasses && !hasAchievement) {
          context.commit('updateAttribute', { attribute: 'charm', value: -100 })
          context.commit('unlockAchievement', '小学升戴墨镜');
          await context.dispatch('typeWriter', '姜云升戴着墨镜去剪了个新发型，花费100元，魅力-100。解锁了第' + context.state.achievements.filter((ach: Achievement) => ach.unlocked).length + '个成就【小学升戴墨镜】（不建议戴）。')
        } else if (hasSunglasses && hasAchievement) {
          await context.dispatch('typeWriter', '姜云升再次戴着墨镜去剪了个新发型，花费100元，魅力-20。')
          context.commit('updateAttribute', { attribute: 'charm', value: -20 })
        } else {
          await context.dispatch('typeWriter', '姜云升出门去剪了个新发型，花费100元，魅力-10。')
          context.commit('updateAttribute', { attribute: 'charm', value: -10 })
        }
      
        context.dispatch('incrementRound');
        break;
      
      
    case '买东西':
      showShopPopup.value = true;
      break;


    case '上山修行':
      // 姜云升用麦克风大锤敲了敲，对敌人造成了巨大的物理攻击。
      // 姜云升用麦克风大锤唱了一首歌，对敌人造成了巨大的精神攻击。
      
      
  }
}  


// const handleOptionChosen = (option: string) => {
//   if (specialEventDetails.value.title === '选择食物') {
//     const selectedFood = store.state.unlockedFoods.find(food => food.name === option);
//     if (selectedFood) {
//       if (store.state.money >= selectedFood.cost) {
//         store.commit('updateAttribute', { attribute: 'money', value: -selectedFood.cost });
//         store.commit('updateAttribute', { attribute: 'energy', value: selectedFood.energy });
//       } else {
//         // 玩家没有足够的金钱购买食物
//         store.dispatch('typeWriter', '抱歉，你没有足够的金钱购买' + selectedFood.name);
//       }
//     }
//   } else if (eventDetails.value.title === '姜哥，玩挺好') {
//     specialEvent({ event: eventDetails.value.title, option });
//   }
// };