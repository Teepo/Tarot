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
            currentPlayer : {},
            game          : {},
            round         : {},
            turn          : {},
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
    },
    actions : {

        initSocketListeners({ commit, dispatch }) {
        },

        async setRound({ commit }, { roomId, round }) {

            await socket.emit('setRound', { roomId, round });

            commit('setRound', round);
        },

        async setTurn({ commit }, { roomId, turn }) {

            await socket.emit('setTurn', { roomId, turn });

            commit('setTurn', round);
        },

        removeSocketListeners() {
        },
    }
});

store.dispatch('room/initSocketListeners');
store.dispatch('player/initSocketListeners');
store.dispatch('initSocketListeners');

export default store;