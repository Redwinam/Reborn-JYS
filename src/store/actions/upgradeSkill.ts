import { ref } from 'vue';
import { Commit } from 'vuex';
import { store } from '../index';

import { showUpgradeSkillDialog } from '../../components/composables/gameRefs'

export const SkillLevelMapping = [
  { level: 'D', min: 0, max: 3 },
  { level: 'C', min: 4, max: 7 },
  { level: 'B', min: 8, max: 11 },
  { level: 'A', min: 12, max: 15 },
  { level: 'S', min: 16, max: 19 },
  { level: 'SS', min: 20, max: 23 },
  { level: 'SSS', min: 24, max: 24 },
];

interface QuestionsAndAnswers {
  [key: string]: {
    [key: string]: {
      questions: (string|string[])[];
      answers: string[];
      type?: string;
    };
  };
}

function getQuestionAndAnswer(skill: string, level: string) {
  const questionsAndAnswers: QuestionsAndAnswers = {
    gaming: {
      D: {
        questions: [['这一天，你在直播间对着手机划了很久，骂骂咧咧，看着超话里的一个个大西瓜，你一遍遍地说着「最后一把」，最后卸载了游戏再重新下载了破解无限复活版《','》，终于你通关了，在超话里晒截图炫耀「有啥了不起」。'] ],
        answers: ['合成大西瓜'],
      },
      C: {
        questions: [['我们是顶级的玩家 / You Know Me / 那冠军的奖杯都被我们收集 / 二十分没有就推到你高地 / 来比起我他们像温顺的猫咪 / ',' ——《玩家》/ 姜云升'] ],
        answers: ['喵'],
      },
      B: {
        questions: [['你在网易的一个能振刀的游戏《','》里练到手指都起茧，还接个了广告曲，在全明星周末赛里从最后一名逆转到第一名。'],
        ['行不更名，坐不改姓，你的游戏昵称就叫「', '」！'], 
        ['你至今记得在那个游戏里有一天杀过你的一个人叫「不如','」！']],
        answers: ['永劫无间', '皮卡振', '姜云升'],
      }, 
      A: {
        questions: [['姜云升带着重新演绎的《成名》来到了英雄联盟手游的《英雄团聚夜》，在手游影响力赛道明星赛第一场，胜利由姜云升作为','的TUA获得！'] ],
        answers: ['吉祥物'],
      },
      S: {
        questions: [['为了向粉丝证明你的游戏水平，姜云升在直播间举办了「第一届姜云升杯挑战赛」，挑战赛的第一局叫《 ','》全员阵亡于Boss姜刀下，无人生还'], 
        ['第二局《', '》，一位勇士勇屠姜人头两次。'], ['第三局《', '》，姜云升被粉丝轮番群殴。'], ['第四局《', '》，姜云升出师未捷身先死，圆满地结束了本届比赛。']],
        answers: ['挑战姜云升', '被姜云升打', '姜云升挑战赛', '只准单挑'],
      },
      SS: {
        questions: [['你和你的好朋友一起快乐地玩游戏，你虽然游戏里赢了他好多好多次，但他接着拿着老婆亲手削的水果，对你说，「云升呐，这','真甜！」'], 
        ['虽然你赢了游戏，但你感觉你输了', '。']],
        answers: ['苹果', '人生'],
      },
    },
    freestyle: {
      D: {
        questions: ['我知道不少人们期待我的', '我知道他们一直盯着我的', '想看我输 看我眼泪还有', '想看我倒地不起吐我几口', '我看到我的身后盯着我的', '喜欢或恨 不一样的', '我知道这可能就是所谓的', '我知道必须往前一步也不'],
        answers: ['落魄', '过错', '懦弱', '唾沫', '人群', '神情', '成名', '能停'],
        type: '双押'
      },
      C: {
        questions: [ ['我叫做僵尸 今年20','不爱笑是因为胸口有块大石','……','要向上爬把楼梯踩断'], '目标是年收入', '用心写歌词', '想从大陆一直红到'],
        answers: ['', '几百万', '几百段', '西海岸'],
        type: '三押'
      }, 
      B: {
        questions: ['虽然她送了我', '但昨晚我真的', ['她打车把我送回酒店','进房间我和她说你']],
        answers: ['玫瑰花', '没睡她', '回去吧'],
        type: '三押'
      },
      A: {
        questions: ['我看过流星坠落地面','我见过最阴暗的', '我受过背后刺的', '我遭过数不清的', '我经过猛然间的', '明白了生命是个', '大概我承受过的', '都是为如今和你' ],
        answers: ['', '欲念', '利剑', '历练', '剧变', '剧院', '一切', '遇见'],
        type: 'Eh'
      },
      S: {
        questions: ['FLOW是清晨的烟幕', '我满腹', '内涵和', '像挂满', '把押韵', '歌词像', ['给所有听闻的新人','展示我']],
        answers: ['', '经纶的宣布', '精神的兼顾', '星辰的天幕', '倾盆地编入', '精纯的仙术', '惊人的天赋'],
        type: '五押'
      },
      SS: {
        questions: ['你一定能够成为你想要去成为的人', '你一定能够成为你想要去成为的', '你一定能够成为你想要去成为', '你一定能够成为你想要去', '你一定能够成为你想', '你一定能够成为', '你一定能够', '你一定', ''],
        answers: ['', '人', '的人', '成为的人', '要去成为的人', '你想要去成为的人', '成为你想要去成为的人', '能够成为你想要去成为的人', '你一定能够成为你想要去成为的人'],

      }
    },
  };

  return questionsAndAnswers[skill][level];
}

const currentQuestionsAndAnswers = ref<{
  skill: string;
  level: string;
  questions: (string|string[])[];
  answers: string[];
  type: string | null;
} | null>(null);

export function upgradeSkill(context: { commit: Commit, dispatch: Function }, { skill, level }: { skill: string; level: string }) {
  if ( level != 'SSS' ) {
    const questionsAndAnswers = getQuestionAndAnswer(skill, level);
    currentQuestionsAndAnswers.value = {
      skill,
      level,
      questions: questionsAndAnswers.questions,
      answers: questionsAndAnswers.answers,
      type: questionsAndAnswers.type || null
    };
    showUpgradeSkillDialog.value = true;
  }
}

export async function handleUpgrade() {
  const { skill } = currentQuestionsAndAnswers.value!;
  store.commit('upgradeSkillLevel', skill);
  currentQuestionsAndAnswers.value = null;
  showUpgradeSkillDialog.value = false;
  const skillLevel = store.state.attributes.skill[`${skill}Level` as keyof typeof store.state.attributes.skill];
  skillLevel === 'SSS' ? store.dispatch('typeWriter', `恭喜姜云升的${skill==="gaming" ? '游戏' : 'freestyle'}技能升级达到了顶级${skillLevel}级，姜云升已经是这个世界上${skill==="gaming" ? '游戏' : 'freestyle'}最强的人了！`) :
  await store.dispatch('typeWriter', `恭喜！姜云升通过了考验！姜云升的${skill==="gaming" ? '游戏' : 'freestyle'}技能升级到${skillLevel}级啦！再接再厉噢`);
}

export async function handleFail() {
  const { skill, level } = currentQuestionsAndAnswers.value!;
  currentQuestionsAndAnswers.value = null;
  showUpgradeSkillDialog.value = false;
  await store.dispatch('typeWriter', `嘤嘤嘤，回答错误，${skill}技能升级失败了！`);
}

export function getCurrentQuestionsAndAnswers() {
  return currentQuestionsAndAnswers;
}