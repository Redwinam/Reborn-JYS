export interface Song {
  title: string
  conditions: {
    [key: string]: number | boolean
  }
  conditions_ne?: {
    [key: string]: number | boolean
  }
  conditionsText?: string
  cost: number
  effects: {
    [key: string]: number
  }
  lyrics: string
  url: string,
}

export interface SongStage {
  completedStage: string | null
  unlocked: boolean
}


export const songLibrary: Song[] = [{
  title: '浪漫主义',
  conditions: { charm: 999, talent: 999, divine: 999, },
  cost: 500,
  effects: { charm: 100, talent: 100, divine: 100, red: + 2000, black: + 1000, },
  lyrics: '大概我承受过的一切，都是为如今和你遇见。',
  url: 'https://music.163.com/#/song?id=1887917182',
}, {
  title: '浪漫主义2.0',
  conditions: { charm: 1000, talent: 1000, energy: 90 },
  cost: 500,
  effects: { charm: 100, talent: 50, energy: - 100, red: + 1000, black: + 500, },
  lyrics: '你听我说，只要是你，都OK的。',
  url: 'https://music.163.com/#/song?id=1920025919',
}, {
  title: '你一定能够成为你想要去成为的人',
  conditions: { talent: 1200, divine: 1000 },
  conditions_ne: { money: 10000 },
  cost: 500,
  effects: { talent: 100, red: + 2000 },
  lyrics: '你一定能够成为你想要去成为的人。',
  url: 'https://music.163.com/#/song?id=1414783972',
}, {
  title: '孤独面店',
  conditions: { talent: 500, },
  conditionsText: '和女孩子分手 ≥ 2次，且分手后至今3个月没有出去鬼混',
  cost: 1000,
  effects: { talent: + 100, charm: + 50, mood: + 100, red: + 1000, money: + 10000, },
  lyrics: '如果这是孤独，那我就敬孤独万岁。',
  url: 'https://music.163.com/#/song?id=1909021556',
}, {
  title: '网易云',
  conditions: { talent: 80, },
  conditions_ne: { mood: 0 },
  cost: 1000,
  effects: { talent: 50, red: + 800 },
  lyrics: '你今夜为了什么戴上耳机？',
  url: 'https://music.163.com/#/song?id=1307591526',
}, {
  title: '真没睡',
  conditions: { talent: 100, },
  conditionsText: '拥有衣服 ≥ 5件，包包 ≥ 5个',
  cost: 250,
  effects: { charm: -100,  talent: 100, red: + 1000, black: + 1000, },
  lyrics: '你衣服包包给你换新的，先别动手，先好好听着！',
  url: 'https://music.163.com/#/song?id=1358276770',
}, {
  title: 'SAD',
  conditions: {  },
  conditions_ne: { mood: 20 },
  conditionsText: '被分手1个月之内，立即外出鬼混。',
  cost: 1000,
  effects: { charm: 50, talent: 50, mood: + 100, red: + 1000, black: + 200, },
  lyrics: '当你是长夜里寂寞没诚意的梦……',
  url: 'https://music.163.com/#/song?id=1874158536',
}, {
  title: '这首歌没唱直接听',
  conditions: { freestyle: 21, },
  cost: 200,
  effects: { talent: 50, mood: + 100, red: + 1200, black: + 1000, },
  lyrics: '我抬着头当Rapper，也不低头当个IDOL。',
  url: 'https://music.163.com/#/song?id=1315952365',
}, {
  title: '流量Rapper',
  conditions: { popularity: 3000, },
  cost: 1000,
  effects: { talent: 50, charm: 50, red: + 800, black: + 500, money: + 10000, },
  lyrics: '靠HIPHOP的大树赚钱，老子就是那棵树。',
  url: 'https://music.163.com/#/song?id=1981589542',
}, {
  title: '自白书',
  conditions: { talent: 100, },
  conditionsText: '姜云升长到20岁！',
  cost: 100,
  effects: { talent: 50, charm: 50, red: + 800, black: + 500, money: + 100, },
  lyrics: 'Hey 很高兴和你相见',
  url: 'https://music.163.com/#/song?id=440090070'
}]

export interface SongFei {
  name: string
  lyrics: string
}

export const songFeiLibrary: SongFei[] = [
  {name: "Mary", lyrics: "你送给我的表我还一直戴着……"},
  {name: "教父", lyrics: "年轻的教父，斯文的暴徒……"},
  {name: "凯尔特", lyrics: "强大者持谦卑之心，不可因力量而跋扈，弱小者持上进之心，不可因无力就麻木。"},
  {name: "KAMI", lyrics: "把窗户给开了，冲一冲房间里充斥着烟味的空气……"},
  {name: "My Baby", lyrics: "心都碎了没能看到你远去的背影……"},
  {name: "My Girlfriend", lyrics: "My Girlfriend拿起电话打给你！"},
  {name: "谦虚", lyrics: "他们想要看我出个DISS，几个菜啊怎么开始醉了……"},
  {name: "Rap Star的生活", lyrics: "Rap Star的生活怎么会有这么妙啊！"},
  {name: "最后你实现了吗", lyrics: "因为有天我们的名字会占满他们的播放器……"},
  {name: "感情的哲理家", lyrics: "被窝里拿起手机，看看现在几点钟……"},
  {name: "写给十年前的自己", lyrics: "姜云升你好，那时你还不叫这名字……"},
  {name: "回忆", lyrics: "第一次品尝爱或者分手，都是在奶茶的杯里……"},
  {name: "超级SAD", lyrics: "I'm SAD you don't know, 想走你就走！"},
  {name: "肚子饿的小猫你别再吵", lyrics: "我也一样有烦恼~"},
  {name: "无你无关", lyrics: "想离开那就滚吧你不用为难……"},
  {name: "没有你会怎样", lyrics: "我银白色的麦克……"},
]