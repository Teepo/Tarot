import { createStore } from 'vuex'

import { socket } from './../modules/ws.js';
import { wsErrorHandler } from './../modules/wsErrorHandler.js';

import roomModule from './modules/room';
import playerModule from './modules/player';

const store = createStore({

    modules: {
        room   : roomModule,
        player : playerModule,
    },

    state () {
        return {

            isOneplayerMode   : false,
            isMultiplayerMode : false,

            game  : {},
            round : {},
            turn  : {},
        }
    },
    getters : {

        players(state) {
            return state.player.players;
        },

        currentPlayer(state) {
            return state.player.currentPlayer;
        }
    },
    mutations: {

        setGame(state, game) {
            state.game = game;
        },

        setRound(state, round) {
            state.round = round;
        },

        setTurn(state, turn) {
            state.turn = turn;
        },

        setRoom(state, room) {
            state.room = room;
        },

        setIsOnePlayerMode(state, isOnePlayerMode) {
            state.isOnePlayerMode = isOnePlayerMode;
        },

        setIsMultiplayerMode(state, isMultiplayerMode) {
            state.isMultiplayerMode = isMultiplayerMode;
        },
    },
    actions : {

        initSocketListeners({ commit, dispatch }) {
        },

        async setRound({ state, commit }, { roomId, round }) {

            if (state.isOnePlayerMode) {
                return commit('setRound', round);
            }

            await socket.emit('setRound', { roomId, round });

            commit('setRound', round);
        },

        async setTurn({ state, commit }, { roomId, turn }) {

            if (state.isOnePlayerMode) {
                return commit('setTurn', turn);
            }

            await socket.emit('setTurn', { roomId, turn });

            commit('setTurn', turn);
        },

        setIsOnePlayerMode({ commit }, isOnePlayerMode) {
            commit('setIsOnePlayerMode', isOnePlayerMode);
        },

        setIsMultiplayerMode({ commit }, isMultiplayerMode) {
            commit('setIsMultiplayerMode', isMultiplayerMode);
        },

        removeSocketListeners() {
        },
    }
});

store.dispatch('room/initSocketListeners');
store.dispatch('player/initSocketListeners');
store.dispatch('initSocketListeners');

export default store;