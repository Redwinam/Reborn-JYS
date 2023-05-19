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
            questions: string[];
            answers: string[];
        };
    };
}

function getQuestionAndAnswer(skill: string, level: string) {
  const questionsAndAnswers: QuestionsAndAnswers = {
    gaming: {
      A: {
        questions: ['我看过流星坠落地面，第二句是我见过最阴暗的XX', '我受过背后刺的'],
        answers: ['欲念', '利剑'],
      },
      // ... 其他级别
    },
    freestyle: {
      A: {
        questions: ['问题1', '问题2'],
        answers: ['答案1', '答案2'],
      },
      // ... 其他级别
    },
  };

  return questionsAndAnswers[skill][level];
}

const currentQuestionsAndAnswers = ref<{
  skill: string;
  level: string;
  questions: string[];
  answers: string[];
} | null>(null);

export function upgradeSkill(context: { commit: Commit, dispatch: Function }, { skill, level }: { skill: string; level: string }) {
  if ( level != 'SSS' ) {
    const questionsAndAnswers = getQuestionAndAnswer(skill, level);
    currentQuestionsAndAnswers.value = {
      skill,
      level,
      questions: questionsAndAnswers.questions,
      answers: questionsAndAnswers.answers,
    };
    showUpgradeSkillDialog.value = true;
  }
}

export function handleUpgrade() {
  const { skill, level } = currentQuestionsAndAnswers.value!;
  store.commit('upgradeSkillLevel', { skill, level });
  currentQuestionsAndAnswers.value = null;
  showUpgradeSkillDialog.value = false;
  const skillLevel = store.state.attributes.skill[`${skill}Level` as keyof typeof store.state.attributes.skill];
  skillLevel === 'SSS' ? store.dispatch('typeWriter', `恭喜姜云升的${skill}技能升级到${skillLevel}级，姜云升已经是这个世界上${skill}最强的人了！`) :
    store.dispatch('typeWriter', `恭喜姜云升的${skill}技能升级到${skillLevel}级！`);
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