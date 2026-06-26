import type { Module } from "vuex";
import type { Food } from "../eats";
import type { Inventory } from "../actions/purchaseItem";
import type { AchievementState } from "../achievements";
import { battleResults, type BattleResult } from "../battle";
import type { SongFei } from "../songs";
import type { Vitamin } from "../vitamins";
import { SPECIAL_ITEMS } from "../constants";
import type { RootState } from "../index";

// progress module：收集/成就/解锁等玩家进度。
// unlockFood（联动 character.maxEnergy）、unlockAchievement / unlockAchievementCondition
//（读取 gameLoop.term）属跨域，留在 root。
export interface ProgressState {
  unlockedFoods: Food[];
  inventory: Inventory;
  lastSpecialItem: string | null;
  achievementStates: AchievementState[];
  unlockedAchievementConditions: string[];
  happenedEvents: string[];
  battleResults: BattleResult[];
  undergroundCount: number;
  tourCount: number[];
  songs: string[];
  songStages: Record<string, { completedStage: string | null; unlocked: boolean }>;
  unlockedFeiSongs: SongFei[];
  unlockedVitamins: Vitamin[];
  shards: string[];
}

export function progressState(): ProgressState {
  return {
    unlockedFoods: [],
    inventory: {},
    lastSpecialItem: null,
    achievementStates: [],
    unlockedAchievementConditions: [],
    happenedEvents: [],
    battleResults: battleResults,
    undergroundCount: 0,
    tourCount: [0, 0],
    songs: [],
    songStages: {},
    unlockedFeiSongs: [],
    unlockedVitamins: [],
    shards: [],
  };
}

export const progress: Module<ProgressState, RootState> = {
  namespaced: true,
  state: progressState,
  mutations: {
    incrementUndergroundCount(state) {
      state.undergroundCount++;
    },
    incrementTourCount(state, index: number) {
      state.tourCount[index]++;
    },
    updateBattleResult(state, payload: { year: number; result: "落选" | "海选" | "八强" | "冠军" | "Masta" }) {
      const { year, result } = payload;
      if (Array.isArray(state.battleResults)) {
        const index = state.battleResults.findIndex((battleResult) => battleResult.year === year);
        if (index !== -1) {
          state.battleResults[index].result = result;
        }
      }
    },
    updateBattleEnd(state, payload: { year: number; end: boolean }) {
      const { year, end } = payload;
      if (Array.isArray(state.battleResults)) {
        const index = state.battleResults.findIndex((battleResult) => battleResult.year === year);
        if (index !== -1) {
          state.battleResults[index].end = end;
        }
      }
    },
    updateItem(state, payload: { itemName: string; quantity: number }) {
      const { itemName, quantity } = payload;
      if ((SPECIAL_ITEMS as readonly string[]).includes(itemName)) {
        if (state.inventory[itemName] && state.inventory[itemName].quantity > 0) {
          state.inventory[itemName].quantity = 1;
        } else {
          state.inventory[itemName] = {
            quantity: 1,
            isFood: false,
          };
          state.lastSpecialItem = itemName;
        }
      } else {
        if (state.inventory[itemName]) {
          state.inventory[itemName].quantity += quantity;
        } else {
          state.inventory[itemName] = {
            quantity: quantity,
            isFood: false,
          };
        }
      }
    },
    packFood(state, { food, quantity }: { food: string; quantity: number }) {
      if (state.inventory[food]) {
        state.inventory[food].quantity += quantity;
      } else {
        state.inventory[food] = {
          quantity: quantity,
          isFood: true,
        };
      }
    },
    decreaseInventory(state, { itemName, quantity }: { itemName: string; quantity: number }) {
      if (state.inventory[itemName]) {
        state.inventory[itemName].quantity -= quantity;
        if (state.inventory[itemName].quantity <= 0) {
          delete state.inventory[itemName];
        }
      }
    },
    addHappenedEvent(state, event: string) {
      if (!state.happenedEvents.includes(event)) {
        state.happenedEvents.push(event);
      }
    },
    unlockSong(state, songTitle: string) {
      if (state.songStages[songTitle]) {
        state.songStages[songTitle].unlocked = true;
      } else {
        state.songStages[songTitle] = {
          completedStage: null,
          unlocked: true,
        };
      }
    },
    setSongStages(state, songStages: { songTitle: string; stage: string }) {
      if (state.songStages[songStages.songTitle]) {
        state.songStages[songStages.songTitle].completedStage = songStages.stage;
      } else {
        state.songStages[songStages.songTitle] = {
          completedStage: songStages.stage,
          unlocked: true,
        };
      }
    },
    unlockFeiSong(state, songFei: SongFei) {
      state.unlockedFeiSongs.push(songFei);
    },
    unlockVitamin(state, vitamin: Vitamin) {
      state.unlockedVitamins.push(vitamin);
    },
    collectShard(state, shard: string) {
      state.shards.push(shard);
    },
  },
};
