export interface Song {
  title: string
  conditions: {
    [key: string]: number | boolean
  }
  conditionsText?: string
  cost: number
  effects: {
    [key: string]: number
  }
  lyrics: string
  url: string,
  coverImage: string
}

export const songLibrary: Song[] = [
    {
      title: '浪漫主义',
      conditions: {
        charm: 999,
        talent: 999,
        divine: 999,
      },
      cost: 500,
      effects: {
        charm: 100,
        talent: 100,
        divine: 100,
        red: + 2000,
        black: + 1000,
      },
      lyrics: '大概我承受过的一切，都是为如今和你遇见。',
      url: 'https://music.163.com/#/song?id=1887917182',
      coverImage: 'lhmjvuyi'
    },
    {
      title: '浪漫主义2.0',
      conditions: {
        charm: 1000,
        talent: 1000,
        energy: 90
      },
      cost: 500,
      effects: {
        charm: 100,
        talent: 50,
        energy: - 100,
        red: + 1000,
        black: + 500,
      },
      lyrics: '你听我说，只要是你，都OK的。',
      url: 'https://music.163.com/#/song?id=1920025919',
      coverImage: 'lhmjvuyi2'
    },
    {
      title: '孤独面店',
      conditions: {
        talent: 500,
      },
      conditionsText: '和女孩子分手>=2次，且分手后至今没有出去鬼混',
      cost: 1000,
      effects: {
        talent: + 100,
        charm: + 50,
        mood: + 100,
        red: + 1000,
        money: + 10000,
      },
      lyrics: '如果这是孤独，那我就敬孤独万岁。',
      url: 'https://music.163.com/#/song?id=1909021556',
      coverImage: 'gudummdm'
    },
    {
      title: '真没睡',
      conditions: {
        talent: 100,
      },
      conditionsText: '拥有衣服>=5件，包包>=5个',
      cost: 500, // 写歌所需金钱
      effects: {
        charm: -100, 
        talent: 100,
        red: + 1000,
        black: + 1000,
      },
      lyrics: '你衣服包包给你换新的，先别动手，先好好听着！',
      url: 'https://music.163.com/#/song?id=1358276770',
      coverImage: 'vfmwuv'
    },
]

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