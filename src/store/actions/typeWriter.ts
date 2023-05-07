import { Commit } from 'vuex';
import TypeIt from 'typeit';

export async function typeWriter(context: { commit: Commit }, message: string | string[]) {
  return new Promise<void>((resolve) => {
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
        context.commit('addTextToHistory', message);
        resolve();
      },
    }).go();
  });
}

export async function typeWriterPopup(context: { commit: Commit }, message: string | string[]) {
  return new Promise<void>((resolve) => {
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
        context.commit('addTextToHistory', message);
        resolve();
      },
    }).go();
  });
}
