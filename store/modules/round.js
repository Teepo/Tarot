import { socket } from './../../modules/ws.js';

let waitMyTurnToTellGameTypeResolver = null;
let waitGameTypeIsChoosenResolver = null;
let waitGameTypeIsChoosenAndEveryoneHasSpokeResolver = null;
let waitCalledKingResolver = null;

const state = () => ({
    round : null
});

const mutations = {

    set(state, round) {
        state.round = round;
    },

    setCalledKing(state, card) {
        state.round.setCalledKing(card);
    },

    setGameType(state, type) {
        state.round.setGameType(parseInt(type));
    }
};

const actions = {

    async get({ commit }, { roomId }) {
            
        const { round } = await socket.emit('round/get', { roomId });

        commit('set', round);

        return { round };
    },

    set({ commit }, round) {
        commit('set', round);
    },

    async setCalledKing({ commit, rootState }, { roomId, card }) {

        if (rootState.isOnePlayerMode) {
            return commit('setCalledKing', card);
        }

        socket.emit('round/setCalledKing', { roomId, card });
    },

    async waitMyTurnToTellGameType({ rootGetters }, { roomId }) {

        return new Promise(async (resolve) => {

            const { player } = await socket.emit('round/getPlayerWhoMustGiveHisGametype', { roomId });

            console.log('waitMyTurnToTellGameType', player?.login, rootGetters.currentPlayer.id === player?.id);

            waitMyTurnToTellGameTypeResolver = resolve;

            if (rootGetters.currentPlayer.id !== player?.id) {
                return;
            }

            waitMyTurnToTellGameTypeResolver();
        });
    },

    async waitGameTypeIsChoosenAndEveryoneHasSpoke({ rootGetters }, { roomId }) {

        return new Promise(resolve => {

            console.log('emit round/getPlayerWhoMustGiveHisGametype', roomId);
            socket.emit('round/getPlayerWhoMustGiveHisGametype', { roomId });

            waitGameTypeIsChoosenAndEveryoneHasSpokeResolver = resolve;
        });
    },

    async waitGameTypeIsChoosen({ state, rootGetters }, { roomId }) {

        return new Promise(async (resolve) => {

            if (rootGetters.currentPlayer.roomId !== roomId) {
                return;
            }

            waitGameTypeIsChoosenResolver = resolve;

            if (state.round.gameTypeIsChoosen()) {
                waitGameTypeIsChoosenResolver();
            }
        });
    },

    async waitCalledKing({ state }) {

        return new Promise(async (resolve) => {
            waitCalledKingResolver = resolve;
        });
    },

    async tellGameType({ commit }, { playerId, roomId, type }) {
        await socket.emit('round/tellGameType', { playerId, roomId, type });
    },

    initSocketListeners({ commit, rootGetters }) {

        socket.on('round/tellToPlayerToGiveHisGameType', ({ round, player }) => {

            if (rootGetters.currentPlayer.id !== player?.id) {
                return;
            }

            commit('set', round);

            waitMyTurnToTellGameTypeResolver();
        });

        socket.on('round/gameTypeIsChoosen', ({ round, roomId }) => {

            if (rootGetters.currentPlayer.roomId !== roomId) {
                return;
            }

            commit('set', round);

            waitGameTypeIsChoosenResolver();
        });

        socket.on('round/setGameType', ({ type }) => {
            commit('setGameType', type);
        });

        socket.on('round/gameTypeIsChoosenAndEveryoneHasSpoke', ({ roomId }) => {
            waitGameTypeIsChoosenAndEveryoneHasSpokeResolver();
        });

        socket.on('round/setCalledKing', ({ card }) => {

            commit('setCalledKing', card);

            waitCalledKingResolver(card);
        });

        socket.on('round/set', ({ round }) => {
            commit('set', round);
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
