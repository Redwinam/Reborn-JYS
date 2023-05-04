export interface AchievementLibrary { 
  id: string; 
  name: string; 
  desc: string; 
  ending?: boolean
}

export const achievementLibrary: AchievementLibrary[] = [
  {
    id: 'jiangyunsheng-weak',
    name: '姜云升虚弱',
    desc: '姜云升的体力被透支到了极限，由于极度虚弱，不得不结束游戏。',
    ending: true,
  },
  // 其他成就
]