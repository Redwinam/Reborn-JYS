export interface Song {
  id: string
  title: string
  conditions: {
    [key: string]: number | boolean
  }
  cost: number
  effects: {
    [key: string]: { min: number; max: number }
  }
}

export const songLibrary: Song[] = [
    {
      id: 'romanticism',
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
    },
    {
      id: 'romanticism-2.0',
      title: '浪漫主义2.0',
      conditions: {
        charm: 100,
        talent: 100,
        
      },
      cost: 500, // 写歌所需金钱
      effects: {
        charm: { min: 3, max: 5 }, // 魅力值随机增加3到5
        talent: { min: 1, max: 3 }, // 才华值随机增加1到3
      },
    },
    {
      id: 'lonely-noodle-shop',
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
    },
    // 其他歌曲
]