<template>
  <div class="star-wall">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-star">🌟</div>
      <div class="loading-text">正在寻找星星们...</div>
    </div>
    <div v-else>
      <div v-for="(star, index) in stars" :key="index" :style="starStyle(index)" class="star">{{ star }}~🌟</div>
    </div>
  </div>
  <div v-if="!errorMessage" class="star-message">「在没有 星星 的时候，我们 自己 就是 星星 ⭐」</div>
  <div v-else class="star-message">{{ errorMessage }}</div>
</template>

<script setup lang="ts">
import { computed, ref, CSSProperties } from "vue";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const stars = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");

function weAreStars() {
  isLoading.value = true;
  axios
    .get(`${API_BASE_URL}/players`)
    .then((res) => {
      stars.value = res.data;
      errorMessage.value = "";
    })
    .catch((error) => {
      errorMessage.value = "网络错误，现在看不见星星㖏！";
    })
    .finally(() => {
      isLoading.value = false;
    });
}

weAreStars();

const starStyle = (index: number) => {
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
.star-wall {
  height: 61vh;
  overflow: scroll;
  position: relative;
  background-color: #1e2228;
  box-shadow: 0 0 20px inset black;
  border-radius: 0.25rem;
}

.star {
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
}

.star-message {
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

.loading-star {
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
