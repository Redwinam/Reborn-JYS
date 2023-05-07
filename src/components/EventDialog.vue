<template>

  <transition name="fade">
    <div v-if="showDialog" class="popup-container">

      <div class="popup">
        <p id="textboxEvent">{{ eventDetail && eventDetail.intro }}</p>
        <div class="event-dialog__options">

          <button v-if="eventDetail && eventDetail.options.length"
            v-for="option in eventDetail.options"
            :key="option"
            @click="handleOptionChosen(option)"
          >
            {{ option }}
          </button>
        </div>

      </div>
    </div>
  </transition>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const props = defineProps<{
  showDialog: boolean
}>()

const emit = defineEmits<{
  (event: 'closeDialog'): void
}>()

const closeDialog = () => {
  emit('closeDialog')
}

const eventDetail = computed(() => store.state.eventDetail);
const specialEvent = (payload: { event: string; option: string }) => {
  store.commit('specialEvent', payload);
};

const handleOptionChosen = (option: string) => {
  if (eventDetail.value.name === '姜哥，玩挺好') {
    specialEvent({ event: eventDetail.value.name, option });
  }
}
</script>