<template>
<Popup title="" :visible="showShardPopup" @close="showShardPopup = false">
  <div class="shard">
    <div v-if="shardName ==='晚霞和云' || shardName ==='秋天的第一片晚霞'">
      <video class="shard-video" controls muted>
        <source :src="'/shards/' + shardName + '.mp4'" type="video/mp4">
      </video>
    </div>
    <div v-else>
      <img class="shard-image" :src="'/shards/' + shardName + '.jpg'" alt="shard">
    </div>
    <p class="shard-message"><span>「日出·晚霞」碎片之——</span><span>《{{ shardName }}》</span></p>
  
  </div>
</Popup>
</template>

<script setup lang="ts">
import Popup from '../components/Popup.vue'
import { showShardPopup } from './composables/gameRefs';

const props = defineProps({
  shardName: String,
})

</script>

<style scoped>
.shard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 7px 18px;
}

.shard-video {
  width: 98%;
  max-height: 75vh;
  border-radius: 5px;
  border: 2px solid #1e2228;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.shard-image {
  width: 100%;
  /* max-width: 500px; */
  max-height: 75vh;
  border-radius: 5px;
  border: 2px solid #1e2228;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.shard-message {
  font-size: 0.7rem;
  color: #666;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
}

</style>