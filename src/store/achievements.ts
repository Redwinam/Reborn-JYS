export interface Achievement { 
  name: string; 
  desc: string; 
  event?: boolean;
  ending?: boolean;
  unlocked: boolean;
  unlockTerm?: number;
}

export const achievements: Achievement[] = [
  { name: '生日快乐', desc: '祝姜云升生日快乐！',event: true, ending: false,unlocked: false, },
  { name: '姜哥，玩挺好', desc: '从此，姜云升记住了点外卖不留名。', event: true, ending: false, unlocked: false, },
  { name: '放松，呼吸', desc: '山里有位老神仙，他对我说……', event: true, ending: false, unlocked: false, },

  { name: '小学升戴墨镜', desc: '不建议戴', event: false, ending: false, unlocked: false, },
  { name: '小姜的餐厅', desc: '解锁所有食物！', event: false, ending: false, unlocked: false, },
  { name: '这歌废啦', desc: '解锁所有废歌！', event: false, ending: false, unlocked: false, },
  { name: '谢谢你们提醒我吃维生素', desc: '集齐所有维生素片！', event: false, ending: false, unlocked: false, },
  { name: '醉酒小姜', desc: '不是酒后吐真言，是借着喝醉说心里话。', event: false, ending: false, unlocked: false, },
  { name: '我所拥有的人气，又是不是真的？', desc: '人气>1200，黑人气>1000。', event: false, ending: false, unlocked: false, },
  { name: '时间很长', desc: '指的是姜云升的睡眠时间很长，在一轮游戏中累计睡眠时间达到500个小时。', event: false, ending: false, unlocked: false, },
  { name: '拜拜就拜拜', desc: '拜拜就拜拜👋🏻，下一个更乖🥺', event: false, ending: false, unlocked: false, },


  { name: '姜云升虚弱',  desc: '姜云升的体力被透支到了极限，由于极度虚弱，不得不结束游戏。', event: false, ending: true, unlocked: false, },
  { name: '无法定义的结局', desc: '“你们可以像看一个电视剧一样观看我的人生……”', event: false, ending: true, unlocked: false, },
  { name: '皮卡皮卡', desc: '解锁皮卡丘结局，和皮卡丘快乐地生活在一起！', event: false, ending: true, unlocked: false, },
]