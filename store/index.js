import { createStore } from 'vuex'

import { socket } from './../modules/ws.js';
import { wsErrorHandler } from './../modules/wsErrorHandler.js';

import roomModule from './../store/modules/room.js';
import playerModule from './../store/modules/player.js';
import roundModule from './../store/modules/round.js';

import { Alert } from './../modules/alert.js';

const store = createStore({

    modules: {
        room   : roomModule,
        player : playerModule,
        round  : roundModule,
    },

    state () {
        return {

            isOneplayerMode   : false,
            isMultiplayerMode : false,

            game : {},
            turn : {},
        }
    },
    getters : {

        players(state) {
            return state.player.players;
        },

        currentPlayer(state, getters, rootState, rootGetters) {
            return rootGetters['player/getCurrentPlayer'];
        },

        round(state) {
            return state.round.round;
        },

        room(state) {
            return state.room.room;
        },
    },
    mutations: {

        setGame(state, game) {
            state.game = game;
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

        initSocketListeners() {

            socket.on('alert', data => {
                Alert.add(data);
            });
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
            socket.off('alert');
        },
    }
});

store.dispatch('room/initSocketListeners');
store.dispatch('player/initSocketListeners');
store.dispatch('round/initSocketListeners');
store.dispatch('initSocketListeners');

export default store;