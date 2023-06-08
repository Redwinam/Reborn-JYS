<template>
<div class="artist-list">
  <div class="artist-item" v-for="artist in artists" :key="artist.name">
  <div class="item-info">
    <div class="artist-meta">
      <p><span>艺人</span>{{ artist.name }}</p>
      <span> {{ artist.level > 0 ? '（' + artist.level + '级）' : '（未招募）' }}</span>
    </div>
  </div>
  <div class="select-buttons">
    <div class="buttons-container">
    <button 
      class="round-button" @click="recruitArtist(artist.name)" v-if="artist.level === 0">招募</button>
    <button 
      class="left-button" @click="trainArtist(artist.name)" v-if="artist.level > 0" :disabled="thisSeasonArtist.dispatch.includes(artist.name)">锻炼</button>
    <button 
      class="right-button" @click="dispatchArtist(artist.name)" v-if="artist.level > 0" :disabled="(thisSeasonArtist.move.artist === artist.name && thisSeasonArtist.move.action === '锻炼') || thisSeasonArtist.dispatch.includes(artist.name)">派遣</button>
    </div>
  </div>
  </div>
</div>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import { Artist } from '../store/artists'

const store = useStore()

const artists = computed(() => store.state.artists);
const thisSeasonArtist = computed(() => store.state.thisSeasonArtist);
const operatingCost = 800000; // company operating cost for recruit and train

const recruitArtist = async (artistName: string) => {
  const artist = artists.value.find((artist: Artist) => artist.name === artistName);
  if (artist.level === 0 && !thisSeasonArtist.value.move && store.state.attributes.money >= operatingCost) {
    store.commit('recruitArtist', artistName);
    // 统计现在已有几位艺人level>0 的数量
    const recruitedArtistCount = artists.value.filter((artist: Artist) => artist.level > 0).length;
    await store.dispatch('typeWriterPopup', `「告诉我你也想火🔥吗，想成为下一个我吗？」恭喜！你成功招募了【${artistName}】为风炎文化的第${recruitedArtistCount}位艺人，你可以派遣你的艺人去参加活动赚大钱你们一起买房买车了！你支出了本季度风炎文化有限公司的经营费用80万元。`);
  } else if (thisSeasonArtist.value.move) {
    await store.dispatch('typeWriterPopup', `本季度风炎文化已经${thisSeasonArtist.value.move.action}了艺人【${artistName}】，已经满负荷运转啦，下季度再招募或锻炼艺人吧！`);
  } else {
    await store.dispatch('typeWriterPopup', `姜云升的金钱不足，需要支出本季度风炎文化有限公司的经营费用80万元才能招募艺人【${artistName}】。`);
  }
}

const trainArtist = async (artistName: string) => {
  const artist = artists.value.find((artist: Artist) => artist.name === artistName);
  if (artist.level > 0 && artist.level < 5 && !thisSeasonArtist.value.move && !thisSeasonArtist.value.dispatch.includes(artistName) && store.state.attributes.money >= operatingCost) {
    store.commit('trainArtist', artistName);
    await store.dispatch('typeWriterPopup', `你支出了本季度风炎文化有限公司的经营费用80万元，锻炼了 ${artistName}，艺人【${artistName}】的等级提升到了${artist.level}级！`);
  } else if (artist.level >= 5) {
    await store.dispatch('typeWriterPopup', `艺人【${artistName}】当前已经是最高级别了，快去给他安排活赚钱吧！`);
  } else if (thisSeasonArtist.value.move) {
    console.log(thisSeasonArtist.value.move)
    await store.dispatch('typeWriterPopup', `本季度风炎文化已经${thisSeasonArtist.value.move.action}了艺人【${artistName}】，已经满负荷运转啦，下季度再招募锻炼艺人吧！`);
  } else if (thisSeasonArtist.value.dispatch.includes(artistName)) {
    await store.dispatch('typeWriterPopup', `艺人【${artistName}】已经在本季度安排派遣，无法锻炼。`);
  } else {
    await store.dispatch('typeWriterPopup', `姜云升的金钱不足，需要支出本季度风炎文化有限公司的经营费用80万元才能锻炼艺人【${artistName}】。`);
  }
}

const dispatchArtist = async (artistName: string) => {
  const artist = artists.value.find((artist: Artist) => artist.name === artistName);
  if (artist.level > 0 && !(thisSeasonArtist.value.move.artist === artist.name && thisSeasonArtist.value.move.action === '锻炼') && !thisSeasonArtist.value.dispatch.includes(artistName)) {
    let activity;
    switch (artist.level) {
      case 1:
        store.commit('updateItem', { itemName: '冰箱', quantity: 1 })
        activity = '参加了《男生女生向前冲》，「告诉我你也想火吗，推你去综艺里搞一点水花」，获得冰箱1台。';
        break;
      case 2:
        activity = '在Livehouse嘉宾助演，艺人运营状况将在本季度末的【风炎经营季报】中公布！';
        break;
      default: // for artist level 3 to 5
        activity = '参加了音乐节演出，艺人运营状况将在本季度末的【风炎经营季报】中公布！';
        break;
    }
    store.commit('dispatchArtist', artistName);
    await store.dispatch('typeWriterPopup', `你派遣了【${artistName}】<small>（${artist.level}级）</small>${activity}`);
  } else if (thisSeasonArtist.value.move.artist === artist.name && thisSeasonArtist.value.move.action === '锻炼') {
    await store.dispatch('typeWriterPopup', `艺人【${artistName}】已经在本季度安排锻炼，无法再安排派遣。`);
  } else if (thisSeasonArtist.value.dispatch.includes(artistName)) {
    await store.dispatch('typeWriterPopup', `艺人【${artistName}】已经在本季度安排派遣，无法再安排派遣。`);
  } else {
    await store.dispatch('typeWriterPopup', `艺人【${artistName}】尚未招募，请先招募艺人！`);
  }
}


</script>
