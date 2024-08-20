import { createStore } from 'vuex'

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
    }
});