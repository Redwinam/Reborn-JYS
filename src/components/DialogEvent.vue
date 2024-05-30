<template>
  <p id="textboxEvent">{{ specialEventDetail && specialEventDetail.intro }}</p>

  <div class="event-dialog__options">
    <button v-if="specialEventDetail && specialEventDetail.options && specialEventDetail.options.length" v-for="option in specialEventDetail.options" :key="option" @click="specialEventOptionChosen(option)">
      {{ option }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";

import { specialEventDetail } from "../store/actions/specialEvent";
import { showEventDialog } from "./composables/gameRefs";

const store = useStore();

const specialEventOptionChosen = (option: string) => {
  if (!specialEventDetail.value) return;
  showEventDialog.value = false;
  store.dispatch("specialEventOptionChosen", { event: specialEventDetail.value.title, option });
};
</script>

<style scoped>
#textboxEvent {
  font-size: 0.9rem;
  margin: 0.5rem 0;
  padding: 0.5rem;
  text-align: center;
}

.event-dialog__options {
  display: flex;
  justify-content: space-around;
  margin: 0.5rem 0;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.event-dialog__options button {
  padding: 0.5rem 1rem;
  background-color: #f3f3f3;
  color: #1e2228;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.event-dialog__options button:hover {
  background-color: #964742;
  outline: 2px solid #1e2228;
  color: #fff;
}
</style>
