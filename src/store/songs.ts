export interface Song {
  title: string
  conditions: {
    [key: string]: number | boolean
  }
  cost: number
  effects: {
    [key: string]: { min: number; max: number }
  }
  lyrics: string
  url: string
}

export const songLibrary: Song[] = [
    {
      title: '浪漫主义',
      conditions: {
        charm: 99,
        talent: 99,
        divine: 99,
      },
      cost: 500, // 写歌所需金钱
      effects: {
        charm: { min: 3, max: 5 }, // 魅力值随机增加3到5
        talent: { min: 1, max: 3 }, // 才华值随机增加1到3
      },
      lyrics: '大概我承受过的一切，都是为如今和你遇见。',
      url: 'https://music.163.com/#/song?id=1407551413'
    },
    {
      title: '浪漫主义2.0',
      conditions: {
        charm: 100,
        talent: 100,
        energy: 90
      },
      cost: 500, // 写歌所需金钱
      effects: {
        charm: { min: 3, max: 5 }, // 魅力值随机增加3到5
        talent: { min: 1, max: 3 }, // 才华值随机增加1到3
      },
      lyrics: '你听我说，只要是你，都OK的。',
      url: 'https://music.163.com/#/song?id=1407551413'
    },
    {
      title: '真没睡',
      conditions: {
        talent: 100,
      },
      cost: 500, // 写歌所需金钱
      effects: {
        charm: { min: 3, max: 5 }, // 魅力值随机增加3到5
        talent: { min: 1, max: 3 }, // 才华值随机增加1到3
      },
      lyrics: '你衣服包包给你换新的，先别动手，先好好听着！',
      url: 'https://music.163.com/#/song?id=1407551413'
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
        mood: { min: -5, max: -2 }, // 心情值随机减少2到5
      },
      lyrics: '如果这是孤独，那我就敬孤独万岁。',
      url: 'https://music.163.com/#/song?id=1407551413'
    },
    // 其他歌曲
]