import { Commit } from 'vuex';
import TypeIt from 'typeit';

import { isTyping } from '../../components/composables/gameRefs';

export async function typeWriter(context: { commit: Commit }, message: string | string[]) {
  isTyping.value = true;
  return new Promise<void>((resolve) => {
    context.commit('addTextToHistory', message);
    new TypeIt("#textboxText", {
      strings: message,
      speed: 25,
      loop: false,
      cursorSpeed: 1000,
      cursorChar: '▐',
      deleteSpeed: 0,
      startDelete: true,
      startDelay: 0,
      breakLines: true,
      beforeStep: async (instance: TypeIt) => {
        if (instance.hasBeenTyped) {
          await new Promise(resolve => setTimeout(resolve, instance.getPauseDuration(true)));
        }
      },
      afterComplete: async (instance: { options: { cursor: boolean; }; destroy: () => void; }) => {
        instance.options.cursor = false;
        instance.destroy();
        resolve();
        isTyping.value = false;
      },
    }).go();
  });
}

export async function typeWriterPopup(context: { commit: Commit }, message: string | string[]) {
  isTyping.value = true;
  return new Promise<void>((resolve) => {
    context.commit('addTextToHistory', message);
    new TypeIt("#textboxPopup", {
      strings: message,
      speed: 25,
      loop: false,
      cursorSpeed: 1000,
      cursorChar: '▐',
      deleteSpeed: 0,
      startDelete: true,
      startDelay: 0,
      breakLines: true,
      beforeStep: async (instance: TypeIt) => {
        if (instance.hasBeenTyped) {
          await new Promise(resolve => setTimeout(resolve, instance.getPauseDuration(true)));
        }
      },
      afterComplete: async (instance: { options: { cursor: boolean; }; destroy: () => void; }) => {
        instance.options.cursor = false;
        instance.destroy();
        resolve();
        isTyping.value = false;
      },
    }).go();
  });
}
