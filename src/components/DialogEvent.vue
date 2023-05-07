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