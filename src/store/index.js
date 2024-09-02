import { createStore } from 'vuex'

import { socket } from './../modules/ws.js';

export const store = createStore({
    state () {
        return {
            currentPlayer : {},
            players       : [],
            game          : {},
            round         : {},
            turn          : {}
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
    },
    actions : {

        async getPlayers({ commit }, { roomName }) {
            
            const players = await socket.emit('getAllPlayersFromRoom', {
                roomName : roomName
            });

            commit('setPlayers', players);
        },

        async setCurrentPlayer({ commit }, { currentPlayer }) {
            commit('setCurrentPlayer', currentPlayer);
        },

        async setRound({ commit }, { roomName, round }) {

            await socket.emit('setRound', {
                roomName : roomName,
                round    : round
            });

            commit('setRound', round);
        },

        async setTurn({ commit }, { roomName, turn }) {

            await socket.emit('setTurn', {
                roomName : roomName,
                turn     : turn
            });

            commit('setTurn', round);
        }
    }
});