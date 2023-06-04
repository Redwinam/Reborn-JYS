<template>
	<div class="star-wall">
	  <div
		v-for="(star, index) in stars"
		:key="index"
		:style="starStyle(index)"
		class="star"
	  >
		{{ star }}~🌟
	  </div>
	</div>
	<div class="star-message">「在没有 星星 的时候，我们 自己 就是 星星 ⭐」</div>
  </template>
  
  <script setup lang="ts">
	import { computed, ref, CSSProperties } from "vue";
	import axios from "axios";
  
	const stars = ref([]);
  
	function weAreStars() {
	  axios
		.get("https://api.jys-wtf.proxy.mayq.me/players")
		.then((res) => {
		  stars.value = res.data;
		  console.log(res.data);
		  errorMessage.value = "";
		})
		.catch((error) => {
		  errorMessage.value = "网络错误，现在看不见星星㖏！";
		});
	}
  
	weAreStars();
  
	const errorMessage = ref("");
  
	const starStyle = (index: number) => {
	const animationDuration = (0.9 + Math.random() * 0.3)*9;
	const randomKeyframeName = `twinkle-${index}-${Math.floor(
	Math.random() * 10000
	)}`;
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
		transform: `translate(${Math.random() * 100 - 50}%, ${Math.random() * 100 - 50}%)`
	}
	return [cssStyle]
};

const createKeyframes = (name: string) => {
	const style = document.createElement("style");
	style.type = "text/css";

	const randomTranslateX = (- 0.5 + Math.random()) * 99;
    const randomTranslateY = (- 0.5 + Math.random())* 99;

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
	height: 75vh;
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
</style>
