<template>
    <div class="artist-list">
      <div class="artist-item" v-for="artist in artists" :key="artist.name">
        <div class="item-info">
          <div class="artist-meta">
            <p>{{ artist.name }}</p>
            <span> {{ artist.level }}</span>
          </div>
          <!-- <span class="artist-note" v-if="artist.level > 0">可参加的活动：{{ artistEvents[artist.level - 1] }}</span> -->
        </div>
        <div class="select-buttons">
          <div class="buttons-container">
            <button class="round-button" @click="recruitArtist(artist.name)">招募</button>
            <button class="left-button" @click="trainArtist(artist.name)">训练</button>
            <button class="right-button" @click="dispatchArtist(artist.name)">派遣</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useStore } from 'vuex'
  
  const store = useStore()
  
  const artists = computed(() => store.state.artists);
  const artistEvents = [];
  
  const recruitArtist = (artist: string) => {
    store.commit('recruitArtist', artist);
  }
  
  const trainArtist = (artist: string) => {
    store.commit('trainArtist', artist);
  }
  
  const dispatchArtist = (artist: string) => {
    store.commit('dispatchArtist', artist);
  }
  
  </script>
  