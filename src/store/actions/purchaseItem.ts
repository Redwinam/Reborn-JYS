import { Commit } from 'vuex';
import { store } from '../index';

interface PurchaseItemPayload {
  itemName: string;
  quantity: number;
}

export interface Item {
    name: string;
    price: number;
    isSpecial: boolean;
    desc: string;
}

export interface Inventory {
    [key: string]: number;
}

export const itemsList = [
  { name: '麦克风大锤', price: 200, isSpecial: true, desc: '麦克风大锤，可以用来打人，也可以用来唱歌' },
  { name: '恶魔「S」之链', price: 300, isSpecial: true, desc: '恶魔「S」之链，「S」是姜云升的「升」' },
  // Add more special items...
  { name: '玫瑰花', price: 10, isSpecial: false, desc: '虽然她送了我玫瑰花！……' },
  { name: '皮卡丘玩偶', price: 15, isSpecial: false, desc: '黄皮耗子 + 1' },
  // Add more normal items...
];

export async function purchaseItem(context: { commit: Commit, dispatch: Function }, payload: PurchaseItemPayload) {
  const { itemName, quantity } = payload;
  const item = itemsList.find((item) => item.name === itemName);

  if (!item) {
    await context.dispatch('typeWriterPopup', `物品"${itemName}"不存在.`);
    return;
  }

  if (store.state.attributes.money < item.price * quantity) {
    await context.dispatch('typeWriterPopup', `姜云升没有足够的钱购买${quantity}个"${itemName}"`);
    return;
  }

  if (item.isSpecial && (store.state.inventory[itemName] || quantity > 1)) {
    await context.dispatch('typeWriterPopup', `特殊装备"${itemName}"只能购买1次.`);
    return;
  }

  context.commit('updateAttribute', { attribute: 'money', value: -item.price * quantity });
  store.state.inventory[itemName] = (store.state.inventory[itemName] || 0) + quantity;

  await context.dispatch('typeWriterPopup', `姜云升购买了${quantity}个"${itemName}"`);
};