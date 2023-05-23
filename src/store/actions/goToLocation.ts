import { Commit } from 'vuex';
import { Food, allFoods } from '../eats';
import { showFoodPopup, showDrinkPopup, showShopPopup } from '../../components/composables/gameRefs';

export async function goToLocation(context: {
  state: any; commit: Commit, dispatch: Function 
}, location: string) {
  await context.dispatch('typeWriter', '正在前往：' + location)
  switch (location) {
    case '去吃点东西':
      const unlockedFoods = context.state.unlockedFoods;
      const lockedFoods = allFoods.filter((food: { name: any; }) => !unlockedFoods.find((uf: { name: any; }) => uf.name === food.name));

      if ((lockedFoods.length > 0 && Math.random() < 0.5) || unlockedFoods.length === 0) {
        // 50%的概率解锁一个新的食物
        const newFood = lockedFoods[Math.floor(Math.random() * lockedFoods.length)];
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
      await context.dispatch('typeWriter', '姜云升出门去剪了个新发型，魅力-10。')
      context.commit('updateAttribute', { attribute: 'charm', value: -10 })
      context.commit('incrementRound');
      break;
      
    case '买东西':
      showShopPopup.value = true;
      break;
      
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