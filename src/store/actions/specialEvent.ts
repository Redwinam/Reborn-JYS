import { Commit } from 'vuex';
import { showEventDialog } from '../../components/composables/gameRefs';

export async function specialEvent(context: { commit: Commit, dispatch: Function }, event: string) {
  if (event === '姜哥，玩挺好') {
    const specialEventDetails = {
      title: '姜哥，玩挺好',
      intro: '这天，姜云升在家陪女朋友，心情很好，忽然想玩点不一样的。决定外卖买个黑丝，外卖订单留哪一个名字呢？',
      options: [
        '【就叫姜云升！】',
        '【叫姜挣钱】',
        '【叫姜云升要谦虚】',
        '【叫姜云升很行】',
        '【叫不如姜云升】',
        '【除了姜云升，叫什么都行】',
      ],
    };
    context.commit('setSpecialEventDetails', specialEventDetails);
    showEventDialog.value = true;
  }
}  

export async function specialEventOptionChosen(context: {
  rootState: any; commit: Commit, dispatch: Function 
}, payload: { event: string; option: string }) {
  if (payload.event === '姜哥，玩挺好') {
    if (payload.option !== '【除了姜云升，叫什么都行】') {
      context.commit('unlockAchievement', payload.event);
      const achievements = Object.keys(context.rootState.achievements).filter((achievement) => context.rootState.achievements[achievement]);
      await context.dispatch('typeWriter', ['片刻后，外卖小哥咚咚咚敲了敲门，送了外卖，看到你开门，笑了笑，留下了一句“姜哥，玩挺好”。','恭喜，姜云升解锁了第' + achievements.length + '个成就【' + payload.event + '】。']);
    }
  }
}