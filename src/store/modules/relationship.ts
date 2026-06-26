import type { Module } from "vuex";
import type { Girlfriend } from "../girlfriend";
import type { RootState } from "../index";

// relationship module：恋爱关系。setGirlfriend 因读取 gameLoop.round 属跨域，留在 root。
export interface RelationshipState {
  girlfriend: Girlfriend | null;
  flirtCount: number;
  accompanyCount: number;
  relationRound: number;
  breakupTimes: number;
  lastBreakupRound: number | null;
  seamlessRelation: boolean;
}

export function relationshipState(): RelationshipState {
  return {
    girlfriend: null,
    flirtCount: 0,
    accompanyCount: 0,
    relationRound: 0,
    breakupTimes: 0,
    lastBreakupRound: null,
    seamlessRelation: false,
  };
}

export const relationship: Module<RelationshipState, RootState> = {
  namespaced: true,
  state: relationshipState,
  mutations: {
    incrementFlirtCount(state) {
      state.flirtCount += 1;
    },
    resetFlirtCount(state) {
      state.flirtCount = 0;
    },
    resetRelationRound(state) {
      state.relationRound = 0;
    },
    setSeamlessRelation(state, payload: boolean) {
      state.seamlessRelation = payload;
    },
    incrementAccompanyCount(state) {
      state.accompanyCount++;
    },
    resetAccompanyCount(state) {
      state.accompanyCount = 0;
    },
  },
};
