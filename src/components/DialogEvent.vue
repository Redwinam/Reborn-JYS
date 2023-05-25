<template>

<p id="textboxEvent">{{ specialEventDetails && specialEventDetails.intro }}</p>

<div class="event-dialog__options">

  <button v-if="specialEventDetails && specialEventDetails.options.length"
    v-for="option in specialEventDetails.options"
    :key="option"
    @click="specialEventOptionChosen(option)"
  >
    {{ option }}
  </button>
</div>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { showEventDialog } from './composables/gameRefs';

const store = useStore()

const specialEventDetails = computed(() => store.state.specialEventDetails);

const specialEventOptionChosen = (option: string) => {
  store.dispatch('specialEventOptionChosen', { event: specialEventDetails.value.title, option });
  showEventDialog.value = false;
}

</script>

<style scoped>
#textboxEvent {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  padding: 0.5rem;
  text-align: center;
}

.event-dialog__options {
  display: flex;
  justify-content: space-around;
  margin: 0.5rem 0;
}

.event-dialog__options button {
  padding: 0.5rem 1rem;
  background-color: #f3f3f3;
  color: #1e2228;
  border-radius: 6px;
  cursor: pointer;
}

.event-dialog__options button:hover {
  background-color: #964742;
  outline:2px solid #1e2228;
  color: #fff;
}
</style>