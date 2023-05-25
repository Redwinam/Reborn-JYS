import { Commit } from 'vuex';

export const allFoods: Food[] = [
  { name: '猪肝面', cost: 30, energy: 70, taste: 'spicy' },
  { name: '重庆小面', cost: 40, energy: 80, taste: 'spicy' },
  { name: '水煮肉片', cost: 45, energy: 85, taste: 'spicy' },
  { name: '烤匠烤鱼', cost: 50, energy: 90, taste: 'spicy' },
  { name: '铁板炒饭', cost: 35, energy: 75, taste: 'savory' },
  { name: '豆花', cost: 25, energy: 65, taste: 'sweet' },
  { name: '江团', cost: 20, energy: 60, taste: 'sweet' },
  { name: '大盘鸡', cost: 55, energy: 95, taste: 'spicy' },
  { name: '火锅', cost: 60, energy: 100, taste: 'spicy' },
  { name: '铁锅炖', cost: 50, energy: 90, taste: 'savory' },
  { name: '黄油拌饭', cost: 40, energy: 80, taste: 'savory' },
  { name: '锅边洋芋', cost: 30, energy: 70, taste: 'savory' },
  { name: '龙虾麻婆豆腐饭', cost: 65, energy: 105, taste: 'spicy' },
  { name: '尖椒兔', cost: 50, energy: 90, taste: 'spicy' },
  { name: '热干面', cost: 35, energy: 75, taste: 'savory' },
  { name: '醉蟹', cost: 60, energy: 100, taste: 'savory' },
  { name: '涮羊肉', cost: 45, energy: 85, taste: 'savory' },
  { name: '猪肚鸡', cost: 55, energy: 95, taste: 'savory' },
];

// Food类型
export interface Food {
  name: string;
  cost: number;
  energy: number;
  taste: 'spicy' | 'savory' | 'sweet';
}

export async function eatFood(context: {
  state: any; commit: Commit, dispatch: Function 
}, food: string) {
  const selectedFood = context.state.unlockedFoods.find((unlockedFood: Food) => unlockedFood.name === food);
  if (selectedFood) {
    if (context.state.attributes.money >= selectedFood.cost) {
      context.commit('updateAttribute', { attribute: 'money', value: -selectedFood.cost });
      context.commit('updateAttribute', { attribute: 'energy', value: selectedFood.energy });
      await context.dispatch('typeWriterPopup', '姜云升吃了一顿' + selectedFood.name + '，摸了摸腹肌。');
    } else {
      await context.dispatch('typeWriterPopup', '抱歉，姜云升的钱不够，吃不起' + selectedFood.name + '。');
    }
  }
}

export async function packFood(context: {
  state: any; commit: Commit, dispatch: Function 
}, payload: {food: string, quantity: number}) {
  const { food, quantity } = payload;
  const selectedFood = context.state.unlockedFoods.find((unlockedFood: Food) => unlockedFood.name === food);
  if (selectedFood) {
    if (context.state.attributes.money >= selectedFood.cost * quantity) {
      context.commit('updateAttribute', { attribute: 'money', value: -selectedFood.cost * quantity });
      context.commit('packFood', { food, quantity });
      await context.dispatch('typeWriterPopup', '姜云升打包了' + quantity + '份' + selectedFood.name + '，真能吃啊。');
    } else {
      await context.dispatch('typeWriterPopup', '抱歉，姜云升的钱不够，买不起' + quantity + '份' + selectedFood.name + '。');
    }
  } else {
    await context.dispatch('typeWriterPopup', '无法找到指定的食物。');
  }
}

export async function eatPackedFood(context: {
  state: any; commit: Commit, dispatch: Function
}, payload: {food: string, quantity: number}) {
  const { food, quantity } = payload;
  const selectedFood = context.state.unlockedFoods.find((unlockedFood: Food) => unlockedFood.name === food);
    if (selectedFood) {
      context.commit('updateAttribute', { attribute: 'energy', value: selectedFood.energy * quantity });
      context.commit('decreaseInventory', { food, quantity } );
      await context.dispatch('typeWriterPopup', `姜云升吃掉了${quantity}份打包的${food}，摸了摸腹肌。`);
    } else {
      await context.dispatch('typeWriterPopup', '无法在物品栏中找到这份食物。');
    }
}

export const allDrinks: Drink[] = [
  { name: '生椰拿铁', cost: 20, energy: 50, mood: 20, taste: 'sweet' },
  { name: '可乐', cost: 5, energy: 12, mood:10, taste: 'sweet' },
  { name: '啤酒', cost: 15, energy: 30, mood:-10, taste: 'sweet' },

];

// Food类型
export interface Drink {
  name: string;
  cost: number;
  energy: number;
  mood: number;
  taste: 'spicy' | 'savory' | 'sweet';
}

export async function drinkDrink(context: {
  state: any; commit: Commit, dispatch: Function 
}, payload: {drink: string, amount: number}) {
  const {drink, amount} = payload;
  const selectedDrink = allDrinks.find((drinkItem: Drink) => drinkItem.name === drink);
  if (selectedDrink) {
    let totalCost = selectedDrink.cost * amount;
    if (amount == 2) {
      totalCost -= selectedDrink.cost / 2; // 第二杯半价
    }
    
    if (context.state.attributes.money >= totalCost) {
      context.commit('updateAttribute', { attribute: 'money', value: -totalCost });
      context.commit('updateAttribute', { attribute: 'energy', value: selectedDrink.energy * amount });
      context.commit('updateAttribute', { attribute: 'mood', value: selectedDrink.mood * amount });
      
      let message = '姜云升喝了' + amount + '杯' + selectedDrink.name;
      if (amount == 2) {
        message += '，享受了第二杯半价的优惠';
      }
      message += '，摸了摸腹肌。';
      await context.dispatch('typeWriterPopup', message);
    } else {
      await context.dispatch('typeWriterPopup', '抱歉，姜云升的钱不够，喝不起' + amount + '杯' + selectedDrink.name + '。');
    }
  }
}