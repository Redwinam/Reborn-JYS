import { ref } from 'vue';
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
  //麦克风大锤 恶魔「S」之链 反穿之甲、虚无之裤、黄色卡车、巴黎之靴
  { name: '麦克风大锤', price: 1000, isSpecial: true, desc: '麦克风大锤，可以用来打人，也可以用来唱歌' }, // 物理攻击
  { name: '恶魔「S」之链', price: 5000, isSpecial: true, desc: '恶魔「S」之链，「S」是姜云升的「升」' }, // 精神攻击
  { name: '反穿之甲', price: 10000, isSpecial: true, desc: '打个响指，你就会忘了这一切' }, // 物理防御
  { name: '虚无之裤', price: 0, isSpecial: true, desc: '该知道的都知道了，不知道的慢慢了解' }, // 精神防御
  { name: '巴黎之靴', price: 15000, isSpecial: true, desc: '穿上这双跳跳鞋，再也无法抵挡我在舞台上刷步数' }, // 敏捷度
  { name: '黄色卡车', price: 2800000, isSpecial: true, desc: '黑夜中，看星空，飘着一个个的梦' }, // 治愈

  { name: '玫瑰花', price: 10, isSpecial: false, desc: '虽然她送了我玫瑰花！……' },
  { name: '皮卡丘玩偶', price: 15, isSpecial: false, desc: '黄皮耗子 + 1' },
  // 发带、手铐、煊赫门、书、墨镜、自热米饭
  // { name: '发带', price: 20, isSpecial: false, desc: '姜云升的发带，可以用来打人，也可以用来扎马尾' },
  // { name: '手铐', price: 30, isSpecial: false, desc: '姜云升的手铐，可以用来打人，也可以用来扣人' },
  { name: '煊赫门', price: 50, isSpecial: false, desc: '我总在抽烟，我知道伤肺' },
  { name: '书', price: 100, isSpecial: false, desc: '可以不上学，但不能不读书' },
  { name: '墨镜', price: 150, isSpecial: false, desc: '买了墨镜记得再去剪头发噢！' },
  { name: '自热米饭', price: 20, isSpecial: false, desc: '再也不吃！' },

  // 西装、灰裤子
];

export async function purchaseItem(context: { commit: Commit, dispatch: Function }, payload: PurchaseItemPayload) {
  const { itemName, quantity } = payload;
  const item = itemsList.find((item) => item.name === itemName);

  if (!item) {
    await context.dispatch('typeWriterPopup', `物品"${itemName}"不存在。`);
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

  const toMessage = ref("")

  if (itemName === '墨镜') {
    context.commit('updateAttribute', { attribute: 'charm', value: -10  * quantity });
    toMessage.value = "，魅力-"+10 * quantity+"。"
  }

  await context.dispatch('typeWriterPopup', `姜云升购买了${quantity}个"${itemName}"${toMessage.value}`);

};