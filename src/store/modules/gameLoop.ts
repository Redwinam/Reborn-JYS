import type { Module } from "vuex";
import { START_YEAR } from "../constants";
import type { RootState } from "../index";

// 天空树歌词（incrementLyricIndex 轮播）。原先定义在 index.ts，迁到 gameLoop 归口，
// 并由 index.ts re-export 以兼容 `import { skyTreeLyrics } from "../store"`。
export const skyTreeLyrics = [
  "替我飞到东京去看天空树✈️🌆",
  "搭坐涩谷电梯吻夕阳与地平线🌇🚉",
  "赶在日落那片黑暗到来前🌅⏳",
  "告诉他们我经历的这一切🗣️💬",
  "替我去看法国阿尔卑斯山🏔️🇫🇷",
  "时间定在圣诞节的12月🎄❄️",
  "毕竟我算是个土生土长的南方人🌴🌞",
  "别笑我这一辈子都没有见过几次雪☃️😅",
  "替我吃遍城市里的美食街🍣🍜",
  "我要点没蔬菜全是肉的那一种🥩🍗",
  "最好再去看秋田叔的演唱会🎤🎶",
  "听听回忆里最感动我的那一首💖🎵",
  "替我走在夜幕下的沙滩边🏖️🌙",
  "看星空与海模糊了的分界线🌌🌊",
  "张开双手风会替我抱紧你🌬️🤗",
  "我就活在你生命的倒影里💫👥",
  "长生 沐浴 冠带 临官✨🚿👑",
  "嗤笑 怒骂 喜怒 悲欢😏😡😃😢",
  "无来 无往 无妄 无常⚖️🔄",
  "生长 生命 生存 生活🌱💖",
  "替我追一百部剧📺🎬",
  "替我看一百部番📚🎥",
  "替我冲一千次浪🌊🏄‍♀️",
  "也可以爬一百座山⛰️🧗‍♂️",
  "拔去父母童年有意无意扎向你的刺👨‍👩‍👧‍👦🪶",
  "替我做遍他们口中所谓没意义的事🙄🌀",
  "替我选你爱的人在一起 哪怕会伤痛💔❤️",
  "在能选择的年纪里 没选择将就⏳🤷‍♂️",
  "都一无所有 为什么还在旁边当个观众?🤔👀",
  "钱包空无一个铜板 那就刚好用来装梦💸💭",
  "替我在反感时说反感 不附和多数👎🤐",
  "大多数服从 也都为了有天能说不💼🚫",
  "用火把夜点亮 给出第五个选项🔥🌙",
  "去做你认为对的 再把证据丢他脸上🛠️⚡",
  "替我立在新世界的风里🌍💨",
  "远离所有盲从的拥挤🚶‍♀️🏙️",
  "替我质疑长者们的公理👵🔍",
  "在说教者的怒斥中😡📣",
  "用力地直起身体💪🧍‍♀️",
];

// gameLoop module：回合/年份/结局推进的主时序。
// incrementRound（含金条利息、跨 character/relationship）与 setGameEnded（commit 成就、
// 弹窗）属跨域，留在 root。本模块仅保留纯局部的 incrementLyricIndex。
export interface GameLoopState {
  term: number;
  year: number;
  round: number;
  totalRounds: number;
  gameEnded: boolean;
  currentEndings: string[];
  specialEndingAchievement: { name: string; desc: string } | null;
  currentLyricIndex: number;
}

export function gameLoopState(): GameLoopState {
  return {
    term: 1,
    year: START_YEAR,
    round: 1,
    totalRounds: 432,
    gameEnded: false,
    currentEndings: [],
    specialEndingAchievement: null,
    currentLyricIndex: -1,
  };
}

export const gameLoop: Module<GameLoopState, RootState> = {
  namespaced: true,
  state: gameLoopState,
  mutations: {
    incrementLyricIndex(state) {
      state.currentLyricIndex++;
      if (state.currentLyricIndex >= skyTreeLyrics.length) {
        state.currentLyricIndex = 0;
      }
    },
  },
};
