<template>

<div v-if="currentQuestionsAndAnswers && currentQuestionsAndAnswers.skill === 'gaming'">
<h3>游戏技能升级考验</h3>
<div class="questions gaming">
  <template v-if="Array.isArray(currentQuestion?.question)">
    <p class="question"><span>{{ currentQuestion?.question[0] }}</span><BoxSelect :size="16" v-for="i in currentQuestion?.answer.length"></BoxSelect><span>{{ currentQuestion?.question[1] }}</span></p>
  </template>
  <template v-else>
    <p class="question">题目：{{ currentQuestion?.question }} <BoxSelect :size="16" v-for="i in currentQuestion?.answer.length"></BoxSelect></p>
  </template>
</div>
<div class="answer-group">
  <input v-if="currentQuestion?.answer.length" v-model="userAnswer" type="text" placeholder="">
  <button @click="submitAnswer">{{ (currentQuestion?.answer.length) ? '填空' : '开始'}}</button>
</div>
</div>

<div v-else-if="currentQuestionsAndAnswers && currentQuestionsAndAnswers.skill === 'freestyle'">
<h3>Freestyle技能升级考验</h3>
<div class="questions">
  <template v-if="Array.isArray(currentQuestion?.question)">
    <p class="question">题目：{{ currentQuestion?.question[0] }}</p>
    <p class="question" v-for="(line, index) in currentQuestion?.question.slice(1)">{{ line }}
      <template v-if="currentQuestion && index === currentQuestion.question.length - 2">
        <BoxSelect :size="16" v-for="i in currentQuestion?.answer.length"></BoxSelect>
      </template>
    </p>
  </template>
  <template v-else>
    <p class="question">题目：{{ currentQuestion?.question }} <BoxSelect :size="16" v-for="i in currentQuestion?.answer.length"></BoxSelect></p>
  </template>
</div>
<div class="answer-group">
  <input v-if="currentQuestion?.answer.length" v-model="userAnswer" type="text" placeholder="">
  <button @click="submitAnswer">{{ (currentQuestion?.answer.length) ? 'Freestyle' : '开始'}}</button>
  <span v-if="currentQuestionIndex">{{ currentQuestion?.type }} × {{ currentQuestionIndex + 1 }}</span>
</div>
</div>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { BoxSelect } from 'lucide-vue-next';
import { getCurrentQuestionsAndAnswers, handleUpgrade, handleFail } from '../store/actions/upgradeSkill';
    
const currentQuestionsAndAnswers = getCurrentQuestionsAndAnswers();

const currentQuestionIndex = ref(0);
const currentQuestion = computed(() => {
  if (currentQuestionsAndAnswers.value) {
    return {
      question: currentQuestionsAndAnswers.value.questions[currentQuestionIndex.value],
      answer: currentQuestionsAndAnswers.value.answers[currentQuestionIndex.value],
      type: currentQuestionsAndAnswers.value.type,
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

div.questions {
  margin-bottom: 1rem;
}

p.question {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0.2rem;
}

.gaming .question {
  display: inline;
  align-items: center;
  vertical-align: middle;
}

.gaming .span {
  vertical-align: middle;
}

.gaming .question svg {
  vertical-align: middle;
}

input {
  width: 5rem;
  margin: 2px auto;
  padding: 6px;
  border: 2px solid #1e2228;
}

button {
  background-color: #964742;
  border: 2px solid #1e2228;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-left: 0.5rem;
}

div.answer-group {
  margin-bottom: 1rem;
}

div.answer-group span {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  color: #1e2228;
}
</style>