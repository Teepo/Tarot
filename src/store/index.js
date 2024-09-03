import { createStore } from 'vuex'

import { socket } from './../modules/ws.js';
import { wsErrorHandler } from './../modules/wsErrorHandler.js';

import { Player } from './../player.js';

export const store = createStore({
    state () {
        return {
            currentPlayer : {},
            players       : [],
            game          : {},
            round         : {},
            turn          : {},
            room          : {}
        }
    },
    getters: {
        findPlayerById: (state) => (playerId) => {
            return state.players.find(player => player.getId() === playerId);
        }
    },
    mutations: {
        
        setCurrentPlayer(state, currentPlayer) {
            state.currentPlayer = currentPlayer;
        },

        setPlayerIsReady(state, player) {
            player.isReady = !player.isReady;
        },

        setPlayers(state, players) {
            state.players = players;
        },

        setPlayers(state, players) {
            state.players = players;
        },

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

        async getPlayer({ commit }, { playerId }) {
            
            const data = await socket.emit('player/get', {
                playerId : playerId,
                roomId   : roomId
            });

            const error = wsErrorHandler(data);
            if (error) {
                return { error};
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

        async setRound({ commit }, { roomId, round }) {

            await socket.emit('setRound', { roomId, round });

            commit('setRound', round);
        },

        async setTurn({ commit }, { roomId, turn }) {

            await socket.emit('setTurn', { roomId, turn });

            commit('setTurn', round);
        },

        async setRoom({ commit }, { roomId }) {

            const room = await socket.emit('room/get', { roomId });

            commit('setRoom', room);
        },
    }
});