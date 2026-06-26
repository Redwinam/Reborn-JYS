import type { Module } from "vuex";
import { allArtists, type Artist } from "../artists";
import type { RootState } from "../index";

// business module：经纪约/风炎文化/投资等经营线。
// setSignedAgency（读 gameLoop.round）、recruit/train/dispatchArtist、investProject
//（均联动 character.money）属跨域，留在 root。
export interface BusinessState {
  signedAgency: boolean;
  signedAgencyRound: number | null;
  goToAgencyTimes: number;
  openFengyan: boolean;
  artists: Artist[];
  thisSeasonArtist: { move: { name: string; action: string } | null; dispatch: string[] };
  realEstate: string[];
  investedProjects: string[];
  investYearIncome: number;
  currentStock: boolean;
}

export function businessState(): BusinessState {
  return {
    signedAgency: false,
    signedAgencyRound: null,
    goToAgencyTimes: 0,
    openFengyan: false,
    artists: allArtists,
    thisSeasonArtist: { move: null, dispatch: [] },
    realEstate: [],
    investedProjects: [],
    investYearIncome: 0,
    currentStock: false,
  };
}

export const business: Module<BusinessState, RootState> = {
  namespaced: true,
  state: businessState,
  mutations: {
    incrementGoToAgencyTimes(state) {
      state.goToAgencyTimes++;
    },
    openFengyan(state, payload: boolean) {
      state.openFengyan = payload;
    },
    initArtist(state, artistName: string) {
      state.artists.push({ name: artistName, level: 0 });
    },
    resetThisSeasonArtist(state) {
      state.thisSeasonArtist = { move: null, dispatch: [] };
    },
  },
};
