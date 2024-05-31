<template>
  <transition name="fade">
    <div v-if="visible" class="popup-container">
      <div class="popup">
        <slot></slot>
        <div class="quick-start-button-container">
          <button v-if="showStartGameDialog" @click="quickStartGame()" class="quick-start-button">（跳过开始）</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { showStartGameDialog } from "./composables/gameRefs";

const store = useStore();

const quickStartGame = async () => {
  showStartGameDialog.value = false;
  await store.dispatch("typeWriter", "【系统】终于到了十五岁，你长成了风一样的少年，这一天，你决定去——");
};

const props = defineProps({
  title: String,
  visible: Boolean,
  showCloseButton: {
    type: Boolean,
    default: true,
  },
});
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

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.quick-start-button-container {
  margin: 0.25rem auto 0.3rem;
  gap: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: -2rem;
  left: 50%;
  transform: translateX(-50%);
}

button.quick-start-button {
  padding: 0.2rem;
  font-size: 0.8rem;
  border: none;
  background: none;
  color: #fcfcfc;
}
</style>
