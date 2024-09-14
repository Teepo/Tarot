import router from './../../router/index';

import { socket } from './../../modules/ws.js';

const state = () => ({
    round : {}
});

const mutations = {

    set(state, round) {
        state.round = round;
    }
};

const actions = {

    async get({ commit }, { roomId }) {
            
        const { round } = await socket.emit('round/get', { roomId });

        return { round };
    },

    set({ commit }, round) {
        commit('set', round);
    },

    async waitMyTurnToTellGameType() {

        socket.on('round/askGameType', ({ playerId }) => {

            const currentPlayerID = rootState.player.currentPlayerID;

            console.log('askGameType', playerId);

            if (currentPlayerID !== playerId) {
                return;
            }

            return Promise.resolve();
        });
    },

    async tellGameType({ commit }, { roomId, type }) {

        console.log('tellGameType', type);

        socket.emit('round/tellGameType', { roomId, type });
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
