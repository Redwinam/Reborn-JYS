import { Commit } from 'vuex';
import TypeIt from 'typeit';

export async function typeWriter(context: { commit: Commit }, message: string | string[]) {
  return new Promise((resolve: (value: unknown) => void) => {
    new TypeIt('#textboxText', {
      strings: message,
      speed: 25,
      loop: false,
      cursorSpeed: 1000,
      cursorChar: '▐',
      deleteSpeed: 0,
      startDelete: true,
      startDelay: 0,
      breakLines: true,
      afterComplete: (instance: { options: { cursor: boolean; }; destroy: () => void; }) => {
        instance.options.cursor = false;
        instance.destroy();
        resolve(true);
      },
    }).go();
  }).then(() => {
    context.commit('addTextToHistory', message);
  });
}