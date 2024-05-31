import { ref } from "vue";
import { Commit } from "vuex";
import { store } from "../index";

interface PurchaseItemPayload {
  itemName: string;
  quantity: number;
}

export interface Item {
  name: string;
  quantifier: string;
  price: number;
  isSpecial: boolean;
  desc: string;
}

export interface Inventory {
  [key: string]: { quantity: number; isFood: boolean };
}

export const itemsList = [
  //麦克风大锤 恶魔「S」之链 反穿之甲、虚无之裤、黄色卡车、巴黎之靴
  { name: "麦克风大锤", quantifier: "个", price: 1000, isSpecial: true, desc: "可以用来打人，也可以用来唱歌" }, // 物理攻击
  { name: "恶魔「S」之链", quantifier: "条", price: 5000, isSpecial: true, desc: "「S」是姜云升的「升」！" }, // 精神攻击
  { name: "反穿之甲", price: 10000, isSpecial: true, desc: "打个响指，你就会忘了这一切" }, // 物理防御
  { name: "虚无之裤", quantifier: "条", price: 0, isSpecial: true, desc: "该知道的都知道了，不知道的慢慢了解" }, // 精神防御
  { name: "巴黎之靴", quantifier: "双", price: 15000, isSpecial: true, desc: "穿上这双跳跳鞋，再也无法抵挡我在舞台上刷步数" }, // 敏捷度
  { name: "黄色卡车", quantifier: "辆", price: 2800000, isSpecial: true, desc: "黑夜中，看星空，飘着一个个的梦" }, // 治愈
  { name: "挂画", quantifier: "幅", price: 350, isSpecial: true, desc: "「不如姜云升」定制挂画" },
  { name: "跑步机", quantifier: "台", price: 5000, isSpecial: true, desc: "每天五分钟！" },

  { name: "玫瑰花", quantifier: "朵", price: 10, isSpecial: false, desc: "虽然她送了我玫瑰花！……" },
  { name: "皮卡丘玩偶", price: 15, isSpecial: false, desc: "黄皮耗子 + 1" },
  { name: "衣服", quantifier: "件", price: 10000, isSpecial: false, desc: "贵贵的丑衣服" },
  { name: "包包", quantifier: "个", price: 10000, isSpecial: false, desc: "很燃的包包" },
  // 发带、手铐、煊赫门、书、墨镜、自热米饭
  // { name: '发带', price: 20, isSpecial: false, desc: '姜云升的发带，可以用来打人，也可以用来扎马尾' },
  // { name: '手铐', price: 30, isSpecial: false, desc: '姜云升的手铐，可以用来打人，也可以用来扣人' },
  { name: "煊赫门", quantifier: "盒", price: 50, isSpecial: false, desc: "我总在抽烟，我知道伤肺" },
  { name: "书", quantifier: "本", price: 100, isSpecial: false, desc: "可以不上学，但不能不读书" },
  { name: "墨镜", quantifier: "副", price: 150, isSpecial: false, desc: "买了墨镜记得再去剪头发噢！" },
  { name: "自热米饭", quantifier: "盒", price: 20, isSpecial: false, desc: "再也不吃！" },

  // 西装、灰裤子
];

export async function purchaseItem(context: { commit: Commit; dispatch: Function }, payload: PurchaseItemPayload) {
  const { itemName, quantity } = payload;
  const item = itemsList.find((item) => item.name === itemName);

  if (!item) {
    await context.dispatch("typeWriterPopup", `物品"${itemName}"不存在。`);
    return;
  }

  if (store.state.attributes.money < item.price * quantity) {
    await context.dispatch("typeWriterPopup", `姜云升没有足够的钱购买${quantity}${item.quantifier ? item.quantifier : "件"}"${itemName}"`);
    return;
  }

  if (item.isSpecial && (store.state.inventory[itemName] || quantity > 1)) {
    await context.dispatch("typeWriterPopup", `特殊装备"${itemName}"只能购买1次.`);
    return;
  }

  context.commit("updateAttribute", { attribute: "money", value: -item.price * quantity });
  context.commit("updateItem", { itemName, quantity });

  const toMessage = ref("");

  if (itemName === "墨镜") {
    context.commit("updateAttribute", { attribute: "charm", value: -10 * quantity });
    toMessage.value = "😎，魅力-" + 10 * quantity + "。";
  }

  await context.dispatch("typeWriterPopup", `姜云升购买了${quantity}${item.quantifier ? item.quantifier : "件"}"${itemName}"${toMessage.value}`);
}

export const getQuantifier = (name: string) => {
  const item = itemsList.find((item) => item.name === name);
  if (!item) {
    switch (name) {
      case "大旗":
        return "面";
      case "《不会带团队，你就只能干到死》":
        return "本";
      case "粉丝的信":
        return "封";
      case "粉丝的画":
        return "幅";
      case "粉丝打磨的锤子":
        return "柄";
      case "皮卡丘化石":
        return "块";
      case "大戒指":
        return "枚";
      default:
        return "";
    }
  }
  if (!item.quantifier) return "件";
  return item.quantifier;
};
