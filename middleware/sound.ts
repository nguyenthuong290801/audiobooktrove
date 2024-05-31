import { useStore } from 'vuex';

export default defineNuxtRouteMiddleware((to, _from) => {
  const store = useStore();
  const sound = store.state.sound;

  if (sound) {
    if (typeof sound == 'object') {
      Object.values(sound).forEach((audio: any) => {
        if (audio.playing()) {
          audio.stop();
        }
      });
    }
  }
});
