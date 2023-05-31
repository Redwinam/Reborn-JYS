export interface Skill {
  freestyle: number
  gaming: number
  gamingLevel: string
  freestyleLevel: string
}

export interface Popularity {
  red: number
  black: number
}


export interface Attributes {
  divine: number
  talent: number
  charm: number
  popularity: Popularity
  money: number
  gold: number
  skill: Skill
  energy: number
  maxEnergy: number
  mood: number
}

export interface AttributeNames {
  [key: string]: string;
}


export const attributeNames: AttributeNames = {
  talent: '才华',
  charm: '魅力',
  popularity: '人气',
  red: '人气红值',
  black: '人气黑值',
  money: '金钱',
  skill: '技能',
  gaming: '电竞技能',
  freestyle: 'Freestyle技能',
  energy: '体力',
  mood: '心情',
  divine: '???',

}