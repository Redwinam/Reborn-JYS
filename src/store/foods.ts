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

export async function selectFood(context: {
  state: any; commit: Commit, dispatch: Function 
}, food: string) {
  const selectedFood = context.state.unlockedFoods.find((unlockedFood: Food) => unlockedFood.name === food);
  if (selectedFood) {
    if (context.state.attributes.money >= selectedFood.cost) {
      context.commit('updateAttribute', { attribute: 'money', value: -selectedFood.cost });
      context.commit('updateAttribute', { attribute: 'energy', value: selectedFood.energy });
      await context.dispatch('typeWriterPopup', '姜云升吃了一顿' + selectedFood.name + '，拍了拍肚子。');
    } else {
      await context.dispatch('typeWriterPopup', '抱歉，姜云升的钱不够，吃不起' + selectedFood.name + '。');
    }
  }
}