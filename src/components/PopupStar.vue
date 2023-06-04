<template>
<div class="star-wall">
	<div
		v-for="(star, index) in stars"
		:key="index"
		:style="starStyle()"
		class="star"
	>
	{{ star }}
	</div>
</div>
</template>
  
<script setup lang="ts">
import { computed, ref } from "vue";
import axios from "axios";

const stars = ref([])

function weAreStars() {
  axios.get('https://api.jys-wtf.proxy.mayq.me/players').then(res => {
    stars.value = res.data
		console.log(res.data)
    errorMessage.value = ""
  }).catch(error => {
    errorMessage.value = "网络错误，现在看不见星星㖏！"
  })
}

weAreStars()

const errorMessage = ref("")

const starStyle = () => {
return {
	position: "absolute",
	left: `${Math.random() * 100}%`,
	top: `${Math.random() * 100}%`,
	color: `hsla(${Math.random() * 360}, 100%, 50%, 0.8)`,
	fontSize: `${Math.random() * 2 + 1}em`,
	fontWeight: "bold",
	textShadow: "0 0 10px rgba(255, 255, 255, 0.8)"
} as CSSStyleDeclaration;
}

</script>
  
<style scoped>
.star-wall {
	width: 80vw;
	height: 75vh;
	overflow: hidden;
	position: relative;
	background-color: #1a1a1a;
}
</style>