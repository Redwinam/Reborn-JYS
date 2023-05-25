<template>
  <transition name="fade">
    <div v-if="visible" class="popup-sub-container">
      <div class="popup-sub">
        <h3 v-if="title">{{ title }}</h3>
        <slot></slot>
        <!-- <button v-if="showCloseButton" @click="$emit('close')" class="close-button">×</button> -->
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
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
.popup-sub-container {
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

.popup-sub {
  position: relative;
  background-color: white;
  border-radius: 5px;
  padding: 20px;
  width: 35vh;
  border: 1px solid black;
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

</style>
