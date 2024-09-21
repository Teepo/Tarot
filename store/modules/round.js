import { socket } from './../../modules/ws.js';

let waitMyTurnToTellGameTypeResolver = null;

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

    async waitMyTurnToTellGameType({ commit, state, rootGetters }, { roomId }) {

        return new Promise(async (resolve, reject) => {

            const { player } = await socket.emit('round/getPlayerWhoMustGiveHisGametype', { roomId });

            console.log('waitMyTurnToTellGameType', player?.login, rootGetters.currentPlayer.id === player?.id);

            waitMyTurnToTellGameTypeResolver = resolve;

            if (rootGetters.currentPlayer.id !== player?.id) {
                return;
            }

            waitMyTurnToTellGameTypeResolver();
        });
    },

    async tellGameType({ commit }, { playerId, roomId, type }) {
        await socket.emit('round/tellGameType', { playerId, roomId, type });
    },

    initSocketListeners({ commit, rootGetters }) {

        socket.on('round/tellToPlayerToGiveHisGameType', ({ player }) => {

            if (rootGetters.currentPlayer.id !== player?.id) {
                return;
            }

            waitMyTurnToTellGameTypeResolver();
        });
    },

    removeSocketListeners() {
        socket.off('round/askGameType');
    },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
