import { Commit } from 'vuex';
import { showEventDialog } from '../../components/composables/gameRefs';

export async function specialEvent(context: { commit: Commit, dispatch: Function }, event: string) {
  if (event === '姜哥，玩挺好') {
    // await context.dispatch('typeWriter', '');

    const eventDetail = {
      title: '姜哥，玩挺好',
      intro: '这天，姜云升在家陪女朋友，心情很好，忽然想玩点不一样的。决定外卖买个黑丝，外卖订单留哪一个名字呢？',
      options: [
        '【就叫姜云升！】',
        '【叫姜挣钱】',
        '【叫姜云升要谦虚】',
        '【叫姜云升很行】',
        '【不如姜云升】',
        '【除了姜云升，叫什么都行】',
      ],
    };
    context.commit('setEventDetails', eventDetail);

    showEventDialog.value = true;

    
    const handleOptionChosen = async (option: string) => {
      if (option !== '【除了姜云升，叫什么都行】') {
        await context.dispatch('typeWriter', '片刻后，外卖小哥咚咚咚敲了敲门，送了外卖，留下了一句“姜哥，玩挺好”)');
        context.commit('unlockAchievement', event);
        await context.dispatch('typeWriter', '姜云升获得了成就【' + event + '】！');
      }
    };
  }
}  