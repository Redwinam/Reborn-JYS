import { Attributes } from '../store/attributes'
export interface Girlfriend { type: string; effect: keyof Attributes; breakupReasons: string[] }

export const girlfriendTypes = [
  { 
    type: '有才华的女朋友', effect: 'talent', 
    breakupReasons: ['她觉得你愚钝', '她觉得你看着有点傻', '她觉得你太有才华了自己配不上'],
  },
  { 
    type: '长得超级好看的女朋友', effect: 'charm',
    breakupReasons: ['她觉得你们不合适', '她觉得你太帅了自己配不上', '想起了她的前男友'],
  },
  { 
    type: '让你牵肠挂肚的女朋友', effect: 'mood',
    breakupReasons: ['你两个小时没回她微信', '你一天没回她微信', '你一周没回她微信', '你一月没回她微信', '你一年没回她微信'],
  },
  { 
    type: '身材火辣的女朋友', effect: 'energy',
    breakupReasons: ['最近体力有些跟不上', '最近想换换口味', '最近想换个人试试', '腻了'],
  },
  { 
    type: '会理财的女朋友', effect: 'money',
    breakupReasons: ['你父母给了她500万让她离开你', '你父母给了她1000万让她离开你', '你父母给了她2000万让她离开你', '你父母给了她5000万让她离开你', '你父母给了她一个亿让她离开你'],
  },
] as Girlfriend[]