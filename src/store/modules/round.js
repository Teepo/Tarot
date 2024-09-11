import { socket } from './../../modules/ws.js';

const state = () => ({
    round : {}
});

const mutations = {

    set(state, round) {
        state.round = round;
    },

    giveCardsToPlayers(state, round) {
        round.giveCardsToPlayers();
    }
};

const actions = {

    async set({ state, rootState , commit }, { roomId, round }) {

        if (rootState.isOnePlayerMode) {
            return commit('set', round);
        }

        const { r } = await socket.emit('round/set', { roomId, round });

        commit('set', r);
    },

    async giveCardsToPlayers({ commit }) {
    },

    initSocketListeners({ commit }) {
    },

    removeSocketListeners() {
    },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
