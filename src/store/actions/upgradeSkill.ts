import { ref } from 'vue';
import { Commit } from 'vuex';
import { store } from '../index';

import { showUpgradeSkillDialog } from '../../components/composables/gameRefs'

export const SkillLevelMapping = [
    { level: 'D', min: 0, max: 3 },
    { level: 'C', min: 4, max: 8 },
    { level: 'B', min: 9, max: 14 },
    { level: 'A', min: 15, max: 20 },
    { level: 'S', min: 21, max: 24 },
    { level: 'SS', min: 25, max: 27 },
    { level: 'SSS', min: 28, max: 28 },
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
        questions: ['我看过流星坠落地面', '我见过最阴暗的', '我受过背后刺的', ],
        answers: ['欲念', '利剑'],
        type: '双押'
      },
      A: {
        questions: ['我看过流星坠落地面，第二句是我见过最阴暗的XX', '我受过背后刺的'],
        answers: ['欲念', '利剑'],
      },
      S: {
        questions: ['虽然她送了我', '但昨晚我真的', '她打车把我送回酒店，进房间我和她说你'],
        answers: ['玫瑰花', '没睡她', '回去吧'],
        type: '三押'
      }
      
      // ... 其他级别
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

export function handleUpgrade() {
  const { skill } = currentQuestionsAndAnswers.value!;
  store.commit('upgradeSkillLevel', skill);
  currentQuestionsAndAnswers.value = null;
  showUpgradeSkillDialog.value = false;
  const skillLevel = store.state.attributes.skill[`${skill}Level` as keyof typeof store.state.attributes.skill];
  skillLevel === 'SSS' ? store.dispatch('typeWriter', `恭喜姜云升的${skill==="gaming" ? '电竞' : 'freestyle'}技能升级到${skillLevel}级，姜云升已经是这个世界上${skill==="gaming" ? '电竞' : 'freestyle'}最强的人了！`) :
  store.dispatch('typeWriter', `恭喜！姜云升通过了考验！姜云升的${skill==="gaming" ? '电竞' : 'freestyle'}技能升级到${skillLevel}级啦！再接再厉噢`);
}

export function handleFail() {
  const { skill, level } = currentQuestionsAndAnswers.value!;
  currentQuestionsAndAnswers.value = null;
  showUpgradeSkillDialog.value = false;
  store.dispatch('typeWriter', `嘤嘤嘤，回答错误，${skill}技能升级失败了`);
}

export function getCurrentQuestionsAndAnswers() {
  return currentQuestionsAndAnswers;
}