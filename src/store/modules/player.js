import { mergeObjectsWithPrototypes } from '@/utils/object.js';

import { socket } from './../../modules/ws.js';

import { wsErrorHandler } from '@/modules/wsErrorHandler.js';

import { Player } from '@/player.ts';

const state = () => ({
    players : [],
    currentPlayer : null
});

const mutations = {

    setCurrentPlayer(state, currentPlayer) {

        const p = mergeObjectsWithPrototypes(new Player({...currentPlayer}), currentPlayer);

        state.currentPlayer = currentPlayer;
    },

    toggleIsReady(state, player) {

        const p = state.players.find(pp => pp.getId() === player.id)

        p.isReady = !p.isReady;
    },

    setPlayers(state, players) {
        state.players = players.map(p => {
            return mergeObjectsWithPrototypes(new Player({...p}), p);
        });
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
            commit('setCurrentPlayer', player);

            return { player };
        }
        catch(e) {
            wsErrorHandler(e);
            return e;
        }
    },

    async getPlayers({ commit }, { roomId }) {
        
        const players = await socket.emit('player/getAllFromRoom', { roomId });

        commit('setPlayers', players.map(p => {
            return mergeObjectsWithPrototypes(new Player({...p}), p);
        }));
    },

    setCurrentPlayer({ commit }, { currentPlayer }) {
        commit('setCurrentPlayer', currentPlayer);
    },

    async toggleIsReady({ commit }, { roomId, playerId }) {

        const { player } = await socket.emit('player/toggleIsReady', {
            roomId   : roomId,
            playerId : playerId
        });
        
        commit('toggleIsReady', player);
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
