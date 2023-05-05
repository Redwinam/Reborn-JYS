import { Commit } from 'vuex';
import { store } from '../index';

export async function performAction(context: { commit: Commit, dispatch: Function }, location: string) {
  await context.dispatch('typeWriter', '正在前往：' + location)
}  