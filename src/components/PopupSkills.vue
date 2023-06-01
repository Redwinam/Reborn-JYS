<template>
  <div class="gaming-skill-container">
    <div class="gaming-skill">
      <h3>游戏技能: {{ attributes.skill.gaming }}</h3>
      <h4>等级: {{ attributes.skill.gamingLevel }}</h4>
    </div>
    <div class="gaming-freestyle">
      <h3>Freestyle技能: {{ attributes.skill.freestyle }}</h3>
      <h4>等级: {{ attributes.skill.freestyleLevel }}</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const attributes = computed(() => store.state.attributes);
</script>

<style scoped>
.gaming-skill-container {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.gaming-skill,
.gaming-freestyle {
  text-align: center;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: bold;
}

h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: normal;
}
</style>
