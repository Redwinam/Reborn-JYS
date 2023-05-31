export interface Achievement { 
  name: string; 
  desc: string; 
  condition?: string;
  event?: boolean;
  ending?: boolean;
  unlocked: boolean;
  unlockTerm?: number;
}

export const achievements: Achievement[] = [
  { name: '生日快乐', desc: '祝姜云升生日快乐！', condition: '在每年的六月上旬的特殊事件达成', event: true, ending: false,unlocked: false, },
  { name: '十年', desc: '如果没人跟着起舞，我们怎么革命。', condition: '游戏进程达到十年的特殊事件达成', event: true, ending: false, unlocked: false, },
  { name: '姜哥，玩挺好', desc: '从此，姜云升记住了点外卖不留名。', condition: '在家陪女朋友且体力>=50时概率触发特殊事件选项达成', event: true, ending: false, unlocked: false},
  { name: '放松，呼吸', desc: '山里有位老神仙，他对我说……', condition: '在第二年后的每一年的春天（2-5月）有女朋友时外出概率触发特殊事件选项达成', event: true, ending: false, unlocked: false, },
  { name: '二八分', desc: '告诉我你也想火吗？', condition: '在说唱技能值到达A级后或，在地下签约经纪公司后达成', event: true, ending: false, unlocked: false, },
  { name: '风炎文化', desc: '因为淋过雨，所以想为他人撑伞。', condition: '在第二次触发二八分事件时选择自己开公司', event: true, ending: false, unlocked: false, },
  { name: '被敲碎的小金猪', desc: '没等到光明的未来，却背了几百万的债……', condition: '二八分事件一年后与公司解约触发', event: true, ending: false, unlocked: false, },

  { name: '姜云升虚弱',  desc: '姜云升的体力透支完毕，由于极度虚弱，不得不结束游戏。', condition: '体力<-100结束游戏触发姜云升虚弱结局达成', event: false, ending: true, unlocked: false, },
  { name: '我不做人啦', desc: '姜云升心情过于EMO，结束游戏！', condition: '心情<-100结束游戏触发我不做人啦结局达成', event: true, ending: true, unlocked: false, },
  { name: '汤臣亿品', desc: '“有两套更好，一套给我，一套给我妈……”', condition: '金钱>=100,000,000一个亿时达成', event: false, ending: true, unlocked: false, },
  { name: '刀削面子', desc: '恭喜姜云升真是好福气啊！', condition: '累计女友数量>=12，发布歌曲《浪漫主义》、《浪漫主义2.0》，且当前还没有被女朋友分手。', event: false, ending: true, unlocked: false, },
  { name: '皮卡皮卡', desc: '解锁皮卡丘结局，和皮卡丘快乐地生活在一起！', condition: '拥有皮卡丘玩偶数量>=521个，发布歌曲《皮卡丘》，且没有发布歌曲《3》！', event: false, ending: true, unlocked: false, },
  { name: '一肩明月，两袖清风', desc: '何以为富 身无他物 一肩明月 两袖清风', condition: '结局时金钱<=99999时达成', event: false, ending: true, unlocked: false, },
  { name: '无法定义的结局', desc: '“你们可以像看一个电视剧一样观看我的人生……”', condition: '完成一个周目的游戏未触发其他特殊结局时达成', event: false, ending: true, unlocked: false, },

  { name: '小学升戴墨镜', desc: '不建议戴', condition: '佩戴墨镜并去剪头发达成', event: false, ending: false, unlocked: false, },
  { name: '小姜的餐厅', desc: '解锁所有食物！', condition: '外出吃点东西概率解锁所有共18种食物达成', event: false, ending: false, unlocked: false, },
  { name: '这歌废啦', desc: '解锁所有废歌！', condition: '在家写废歌解锁所有共16首废歌达成', event: false, ending: false, unlocked: false, },
  { name: '谢谢你们提醒我吃维生素', desc: '集齐所有维生素片！', condition: '在家直播概率解锁所有共13种维生素片达成', event: false, ending: false, unlocked: false, },
  { name: '醉酒小姜', desc: '不是酒后吐真言，是借着喝醉说心里话。', condition: '在醉酒状态时陪粉丝开直播达成', event: false, ending: false, unlocked: false, },
  { name: '我所拥有的人气，又是不是真的？', desc: '都来到我身边，都要我感恩呢。', condition: '人气>1200，其中黑人气>1000时达成', event: false, ending: false, unlocked: false, },
  { name: '时间很长', desc: '指的是姜云升的睡眠时间很长！', condition: '在一轮游戏中累计睡眠时间达到500小时达成', event: false, ending: false, unlocked: false, },
  { name: '拜拜就拜拜', desc: '拜拜就拜拜👋🏻，下一个更乖🥺', condition: '姜云升累计分手或被甩超过10次达成', event: false, ending: false, unlocked: false, },
]