// Phase 3d②：地点 / 动作 / 事件的「派发标识符」常量化。
// 把原本散落在 @click、store.dispatch、handler 分发表里的中文魔法字符串收敛到这里，
// 让调用点与分发表共用同一常量、无法漂移（写错即编译期/属性访问报错）。
//
// 说明：成就名 / 结局名暂未纳入（数量多、且与「派发路由」是不同关注点），如需可另立 ACHIEVEMENTS。

export const LOCATIONS = {
  EAT: "去吃点东西",
  DRINK: "去喝点东西",
  SHOP: "买东西",
  BANK: "地下钱庄之暴富金铺",
  EXCHANGE: "交易所",
  AGENCY: "公司",
  FENGYAN: "风炎文化",
  HAIRCUT: "去剪头发",
  DAO: "上山修行",
  UNDERGROUND: "Underground",
  BATTLE: "Battle大赛",
} as const;

export const ACTIONS = {
  GO_HOME: "回家",
  HANG_OUT: "出去鬼混",
  GO_OUT: "外出",
  STUDY: "去上课",
  MAKE_MONEY: "赚钱",
  SLEEP: "睡觉休息",
  LIVE_STREAM: "开直播",
  PLAY_GAME: "打游戏",
  WRITE_SONG: "写歌",
} as const;

export const EVENTS = {
  JIANG_GE: "姜哥，玩挺好",
  BIRTHDAY: "生日快乐",
  WATCH_FUN: "去看热闹",
  TEN_YEARS: "十年",
  RELAX_BREATHE: "放松，呼吸",
  WEDDING: "记姜云升账上",
  RPS_KING: "包剪锤之王",
  SIGN_AGENCY: "二八分",
} as const;

export type LocationKey = (typeof LOCATIONS)[keyof typeof LOCATIONS];
export type ActionKey = (typeof ACTIONS)[keyof typeof ACTIONS];
export type EventKey = (typeof EVENTS)[keyof typeof EVENTS];
