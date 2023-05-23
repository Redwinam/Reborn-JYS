export interface Achievement { 
  name: string; 
  desc: string; 
  event?: boolean;
  ending?: boolean;
  unlocked: boolean;
  unlockTerm?: number;
}

export const achievements: Achievement[] = [
  {
    name: '生日快乐',
    desc: '祝姜云升生日快乐！',
    event: true,
    ending: false,
    unlocked: false,
  },
  {
    name: '姜云升虚弱',
    desc: '姜云升的体力被透支到了极限，由于极度虚弱，不得不结束游戏。',
    event: false,
    ending: true,
    unlocked: false,
  },

  {
    name: '无法定义的结局',
    desc: '“你们可以像看一个电视剧一样观看我的人生……”',
    event: false,
    ending: true,
    unlocked: false,
  },

  {
    name: '姜哥，玩挺好',
    desc: '从此，姜云升记住了点外卖不留名。',
    event: true,
    ending: false,
    unlocked: false,
  },

  {
    name: '放松，呼吸',
    desc: '山里有位老神仙，他对我说……',
    event: true,
    ending: false,
    unlocked: false,
  },
]