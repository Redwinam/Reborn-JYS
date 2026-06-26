import type { Module } from "vuex";
import type { Attributes } from "../attributes";
import { GOLD_PRICE } from "../constants";
import { SkillLevelMapping } from "../actions/upgradeSkill";
import type { RootState } from "../index";

// character module：人物本体属性。
// 仅包含「只读写 character 自身字段」的局部 mutation；跨域改钱（如 updateAttribute 受
// business.signedAgency 影响、buyGold 仅动 character 故留此）等保持在 root（见 index.ts）。
export interface CharacterState {
  attributes: Attributes;
  weak: boolean;
  drunk: number;
  sleepHours: number;
}

export function characterState(): CharacterState {
  return {
    attributes: {
      divine: 0,
      talent: 0,
      charm: 0,
      popularity: {
        red: 0,
        black: 0,
      },
      money: 0,
      gold: 0,
      skill: {
        freestyle: 0,
        gaming: 0,
        gamingLevel: "D",
        freestyleLevel: "D",
      },
      energy: 100,
      maxEnergy: 100,
      mood: 0,
      fight: {
        level: 26,
        attack: 19,
        defense: 9,
        hp: 6,
        mp: 61,
      },
      superstition: 0,
    },
    weak: false,
    drunk: 0,
    sleepHours: 0,
  };
}

export const character: Module<CharacterState, RootState> = {
  namespaced: true,
  state: characterState,
  mutations: {
    addSleepHours(state, payload: number) {
      state.sleepHours += payload;
    },
    upgradeSkillLevel(state, skill: "gaming" | "freestyle") {
      if (skill === "gaming" || skill === "freestyle") {
        state.attributes.skill[skill]++;
        for (const level of SkillLevelMapping) {
          if (state.attributes.skill[skill] >= level.min && state.attributes.skill[skill] <= level.max) {
            state.attributes.skill[`${skill}Level`] = level.level;
            break;
          }
        }
      }
    },
    setWeak(state, payload: boolean) {
      state.weak = payload;
    },
    updateDrunk(state, payload: number) {
      state.drunk += payload;
    },
    buyGold(state, payload: number) {
      state.attributes.gold += payload;
      state.attributes.money -= GOLD_PRICE * payload;
    },
  },
};
