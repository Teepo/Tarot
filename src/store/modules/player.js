import { socket } from './../../modules/ws.js';

import { wsErrorHandler } from '@/modules/wsErrorHandler.js';

import { Player } from '@/player.ts';

const state = () => ({
    players : [],
    currentPlayer : null
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

        try {
            
            const { player } = await socket.emit('player/get', {
                roomId   : roomId,
                playerId : playerId
            });

            const p = new Player({ ...player })
    
            commit('add', p);
            commit('setCurrentPlayer', p);

            return { player };
        }
        catch(e) {
            console.error(e);
            wsErrorHandler(e);
            return e;
        }
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
