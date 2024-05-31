import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      countCart: '00',
      sound: {}
    };
  },
  mutations: {
    addToCart(state, payload) {
      if (!payload == 0) {
        state.countCart = String(payload).padStart(2, '0');
      } else {
        state.countCart = '00';
      }
    },
    addToSound(state, payload) {
      state.sound = payload;
    },
  },
  actions: {
    addToCart({ commit }, payload) {
      commit('addToCart', payload);
    },
    addToSound({ commit }, payload) {
      commit('addToSound', payload);
    },
  },
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(store);
});

