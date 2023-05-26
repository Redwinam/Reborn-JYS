<template>
  <transition name="fade">
    <div v-if="visible" class="popup-container">
      <div class="popup">
        <h2>{{ title }}</h2>
        <slot></slot>
        <p id="textboxPopup" v-if="title ==='客官今天打算吃点什么？'">吃点什么呢……</p>
        <p id="textboxPopup" v-if="title ==='买喝的！'">喝杯什么呢……</p>
        <p id="textboxPopup" v-if="title ==='买东西！'">要买什么呢？</p>
        <p id="textboxPopup" v-if="title ==='写歌'">一起写歌吧！</p>
        <p id="textboxPopup" v-if="title ==='物品'"></p>
        <button v-if="showCloseButton" @click="$emit('close')" class="close-button"><X></X></button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

const props = defineProps({
  title: String,
  visible: Boolean,
  showCloseButton: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.popup-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.popup {
  position: relative;
  background-color: white;
  border-radius: 5px;
  padding: 20px;
  width: 42vh;
  max-width: 500px;
  border: 2px solid #1e2228;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.popup #textboxPopup {
  font-size: 0.9rem;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;
  color: #1e2228;
  padding: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
