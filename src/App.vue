<template>
  <div id="app">
    <Game />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Game from './components/Game.vue'

export default defineComponent({
  components: {
    Game,
  },
})
</script>

<style>
/* 在这里添加全局样式 */
</style>