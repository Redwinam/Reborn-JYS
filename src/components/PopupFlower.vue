<template>
  <div class="flower-wall">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-flower">🌸</div>
      <div class="loading-text">正在寻找花花们...</div>
    </div>
    <div v-else>
      <div v-for="(flower, index) in flowers" :key="index" :style="flowerStyle(index)" class="flower">{{ flower }}~🌸</div>
    </div>
  </div>
  <div v-if="!errorMessage" class="flower-message">「你们是命运给我的繁花 🌸」</div>
  <div v-else class="flower-message">{{ errorMessage }}</div>
</template>

<script setup lang="ts">
import { ref, CSSProperties } from "vue";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const flowers = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");

function weAreFlowers() {
  isLoading.value = true;
  axios
    .get(`${API_BASE_URL}/players`)
    .then((res) => {
      flowers.value = res.data;
      errorMessage.value = "";
    })
    .catch((error) => {
      errorMessage.value = "网络错误，现在看不见繁花㖏！";
    })
    .finally(() => {
      isLoading.value = false;
    });
}

weAreFlowers();

const flowerStyle = (index: number) => {
  const animationDuration = (0.9 + Math.random() * 0.3) * 9;
  const randomKeyframeName = `twinkle-${index}-${Math.floor(Math.random() * 10000)}`;
  createKeyframes(randomKeyframeName);
  const cssStyle: CSSProperties = {
    position: "absolute",
    left: `${Math.random() * 200}%`,
    top: `${Math.random() * 200}%`,
    color: "#fffff3",
    fontSize: `${(Math.random() * 3 + 1) / 6}rem`,
    whiteSpace: "nowrap",
    animation: `${randomKeyframeName} ${animationDuration}s infinite`,
    animationDelay: `${Math.random()}s`,
    transform: `translate(${Math.random() * 100 - 50}%, ${Math.random() * 100 - 50}%)`,
  };
  return [cssStyle];
};

const createKeyframes = (name: string) => {
  const style = document.createElement("style");
  style.type = "text/css";

  const randomTranslateX = (-0.5 + Math.random()) * 99;
  const randomTranslateY = (-0.5 + Math.random()) * 99;

  style.innerHTML = `
	@keyframes ${name} {
		0% {
		opacity: 1;
		transform: translate(0, 0);
		}

		12.5% {
		opacity: 0.5;
		}

		25% {
		opacity: 1;
		}

		37.5% {
		opacity: 0.5;
		}

		50% {
		opacity: 1;
		transform: translate(${randomTranslateX}px, ${randomTranslateY}px);
		}

		62.5% {
		opacity: 0.5;
		}

		75% {
		opacity: 1;
		}

		87.5% {
		opacity: 0.5;
		}

		100% {
		opacity: 1;
		transform: translate(0, 0);
		}
	}
	`;
  document.getElementsByTagName("head")[0].appendChild(style);
};
</script>

<style scoped>
.flower-wall {
  height: 61vh;
  overflow: scroll;
  position: relative;
  background-color: #1e2228;
  box-shadow: 0 0 20px inset black;
  border-radius: 0.25rem;
}

.flower {
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
}

.flower-message {
  font-size: 0.7rem;
  color: #666;
  margin-top: 0.5rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #fffff3;
}

.loading-flower {
  font-size: 2.4rem;
  animation: rotate 2s infinite linear;
}

.loading-text {
  margin-top: 0.9rem;
  font-size: 0.9rem;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
