<template>
    <ul>
    <li v-for="achievement in achievements" :key="achievement">
      {{ achievement }}
    </li>
  </ul>
  <p style="display: none;">制作人：@千啾略</p>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const achievements = computed(() => store.state.achievements)



</script>