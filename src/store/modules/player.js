import { mergeObjectsWithPrototypes } from '@/utils/object.js';

import { socket } from '@/modules/ws.js';

import { wsErrorHandler } from '@/modules/wsErrorHandler.js';

import { Player } from '@core/models/player.ts';

const state = () => ({
    currentPlayerID : null,
    players : []
});

const mutations = {

    toggleIsReady(state, player) {

        const p = state.players.find(pp => pp.getId() === player.id)

        p.isReady = !p.isReady;
    },

    setPlayers(state, players) {
        state.players = players.map(p => {
            return mergeObjectsWithPrototypes(new Player({...p}), p);
        });
    },

    setCurrentPlayerID(state, playerId) {
        state.currentPlayerID = playerId;
    },

    add(state, player) {

        const p = mergeObjectsWithPrototypes(new Player({...player}), player);

        state.players.push(p);
    },

    delete(state, playerId) {
        state.players = state.players.filter(player => player.getId() !== playerId);
    }
};

const actions = {

    async get({ commit }, { roomId, playerId }) {

        try {
            
            const { player } = await socket.emit('player/get', {
                roomId   : roomId,
                playerId : playerId
            });
    
            commit('add', player);

            return { player };
        }
        catch(e) {
            wsErrorHandler(e);
            return e;
        }
    },

    async getPlayers({ commit }, { roomId }) {
        
        try {
            const players = await socket.emit('player/getAllFromRoom', { roomId });

            commit('setPlayers', players.map(p => {
                return mergeObjectsWithPrototypes(new Player({...p}), p);
            }));

            return players;
        }
        catch(e) {
            return e;
        }
    },

    setCurrentPlayerID({ commit }, playerId) {
        commit('setCurrentPlayerID', playerId);
    },

    setPlayers({ commit }, players) {
        commit('setPlayers', players);
    },

    setPlayers({ commit }, players) {
        commit('setPlayers', players);
    },

    async toggleIsReady({ commit }, { roomId, playerId }) {

        await socket.emit('player/toggleIsReady', {
            roomId   : roomId,
            playerId : playerId
        });
    },

    initSocketListeners({ commit }) {

        socket.on('player/toggleIsReady', ({ player }) => {
            commit('toggleIsReady', player);
        });
    },

    removeSocketListeners() {
    },
};

const getters = {

    getPlayers(state) {
        return state.players;
    },

    getCurrentPlayer(state) {
        return state.players.find(player => player.getId() === state.currentPlayerID);
    }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
