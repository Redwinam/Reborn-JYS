export interface Song {
  title: string
  conditions: {
    [key: string]: number | boolean
  }
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
      },
      lyrics: '你听我说，只要是你，都OK的。',
      url: 'https://music.163.com/#/song?id=1920025919',
      coverImage: 'lhmjvuyi2'
    },
    {
      title: '真没睡',
      conditions: {
        talent: 100,
      },
      cost: 500, // 写歌所需金钱
      effects: {
        charm: -100, 
        talent: 100,
      },
      lyrics: '你衣服包包给你换新的，先别动手，先好好听着！',
      url: 'https://music.163.com/#/song?id=1358276770',
      coverImage: 'vfmwuv'
    },
    {
      title: '孤独面店',
      conditions: {
        breakups: 2,
        noNewGirlfriendForMonths: 3,
        noFlirt: true,
      },
      cost: 1000,
      effects: {
        mood: + 100,
        money: + 10000,
      },
      lyrics: '如果这是孤独，那我就敬孤独万岁。',
      url: 'https://music.163.com/#/song?id=1909021556',
      coverImage: 'gudummdm'
    },
    // 其他歌曲
]