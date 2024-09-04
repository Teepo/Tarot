import { socket } from './../../modules/ws.js';

const state = () => ({
    players : {}
});

const mutations = {

    setCurrentPlayer(state, currentPlayer) {
        state.currentPlayer = currentPlayer;
    },

    togglePlayerIsReady(state, player) {
        player.isReady = !player.isReady;
    },

    setPlayers(state, players) {
        state.players = players;
    },

    add(state, player) {
        state.players.push(player);
    },
};

const actions = {

    async get({ commit }, { roomId, playerId }) {
            
        const data = await socket.emit('player/get', {
            roomId   : roomId,
            playerId : playerId
        });

        const error = wsErrorHandler(data);
        if (error) {
            return { error };
        }

        const { player } = data;

        commit('setCurrentPlayer', new Player({ player }));
    },

    async getPlayers({ commit }, { roomId }) {
        
        const players = await socket.emit('player/getAllFromRoom', { roomId });

        commit('setPlayers', players);
    },

    setCurrentPlayer({ commit }, { currentPlayer }) {
        commit('setCurrentPlayer', currentPlayer);
    },

    togglePlayerIsReady({ commit, getters }, { playerId }) {

        const player = getters.findPlayerById(playerId);

        commit('togglePlayerIsReady', player);
    },

    initSocketListeners({ commit }) {
    },

    removeSocketListeners() {
    },
};

const getters = {
    
    findPlayerById: (state) => (playerId) => {
        return state.players.find(player => player.getId() === playerId);
    }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
