<template>
  <div
    class="attribute"
    v-for="(value, attribute) in attributes"
    :key="attribute"
  >
    {{ attributeNames[attribute] }}: {{ value }}
  </div>

  <h3 class="title">数值说明：</h3>
  <ul>
    <li><strong>才华：</strong>决定你的学习能力和创造力。</li>
    <li><strong>魅力：</strong>决定你的人缘和交际能力。</li>
    <li><strong>人气：</strong>决定你的知名度和影响力，分为红色人气和黑色人气。</li>
    <li><strong>金钱：</strong>决定你的经济实力。</li>
    <li><strong>Freestyle：</strong>决定你的说唱Freestyle实力。</li>
    <li><strong>电竞：</strong>决定你的电竞实力。</li>
    <li><strong>体力：</strong>决定你的身体素质和耐力。</li>
    <li><strong>心情：</strong>决定你的情绪和心态。</li>
    <li><strong>神性：</strong>决定你的神秘能力和超自然力量。</li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";

import { attributeNames } from "../store/attributes";

const store = useStore();



const attributes = computed(() => store.state.attributes);
</script>