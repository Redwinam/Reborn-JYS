<template>

<h2>技能升级</h2>
<p>{{ currentQuestion?.question }}</p>
<input v-model="userAnswer" type="text" placeholder="">
<button @click="submitAnswer">提交</button>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getCurrentQuestionsAndAnswers, handleUpgrade, handleFail } from '../store/actions/upgradeSkill';
    
const currentQuestionsAndAnswers = getCurrentQuestionsAndAnswers();

const currentQuestionIndex = ref(0);
const currentQuestion = computed(() => {
  if (currentQuestionsAndAnswers.value) {
    return {
      question: currentQuestionsAndAnswers.value.questions[currentQuestionIndex.value],
      answer: currentQuestionsAndAnswers.value.answers[currentQuestionIndex.value]
    } ;
  } else {
    return null;
  }
});
const userAnswer = ref('');

function submitAnswer() {
  if (userAnswer.value === currentQuestion.value?.answer) {
    if (currentQuestionsAndAnswers.value && currentQuestionIndex.value === currentQuestionsAndAnswers.value.questions?.length - 1) {
      handleUpgrade();
    } else {
      currentQuestionIndex.value++;
    }
  } else {
    handleFail();
  }
  userAnswer.value = '';
}

</script>

<style scoped>

</style>