import { socket } from './../../modules/ws.js';

const state = () => ({
    round : {}
});

const mutations = {

    set(state, round) {
        state.room = round;
    },

    giveCardsToPlayers(state, round) {
        round.giveCardsToPlayers();
    }
};

const actions = {

    async set({ state, commit }, { roomId, r }) {

        if (state.isOnePlayerMode) {
            return commit('set', r);
        }

        const { round } = await socket.emit('round/set', { roomId, round : r });

        commit('set', round);
    },

    async giveCardsToPlayers({ state, commit }, { roomId, round }) {

        if (state.isOnePlayerMode) {
            return commit('giveCardsToPlayers', round);
        }

        const { round } = await socket.emit('round/set', { roomId, round : r });

        commit('set', round);
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
