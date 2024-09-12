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

    async askGameType({ commit }, { roomId }) {
        await socket.emit('round/askGameType', { roomId });
    }

    initSocketListeners({ commit }) {

        socket.on('round/init', ({ roomId, round }) => {

            commit('set', round);

            router.push({ name: 'MultiplayerGame', params: { roomId } });
        });
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
