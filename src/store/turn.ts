import { Round } from '../models/round';
import { Player } from '../models/player';
import { Card } from '../models/card';
import { Turn } from '../models/turn';

import { createStore, Store, Commit } from 'vuex';

import { ITurn } from './../types/turn';

export default class TurnStore {

    store: Store<ITurn>;

    private state!: ITurn;

    constructor() {
        this.store = createStore({
            state     : this.state,
            mutations : this.mutations,
            actions   : this.actions,
            getters   : this.getters,
        });
    }

    private mutations = {
        SET_ROUND(state: Turn, round: Round) {
            state.round = round;
        },
        SET_CURRENT_PLAYER(state: Turn, player: Player) {
            state.currentPlayer = player;
        },
        ADD_PLAYER_TO_QUEUE(state: Turn, player: Player) {
            state.playersQueue.push(player);
        },
        SET_WINNER(state: Turn, player: Player) {
            state.winner = player;
        },
        ADD_CARD(state: Turn, card: Card) {
            state.cards.push(card);
        },
        RESET_PLAYERS_CURRENT_CARD(state: Turn) {
        // Vous devrez probablement gérer cela dans les actions si vous devez manipuler les joueurs
        },
        SET_CARDS(state: Turn, cards: Card[]) {
            state.cards = cards;
        },
    }

  private actions = {
    setRound({ commit }: { commit: Commit }, round: Round) {
        commit('SET_ROUND', round);
    },
    setCurrentPlayer({ commit }: { commit: Commit }, player: Player) {
        commit('SET_CURRENT_PLAYER', player);
    },
    addPlayerToQueue({ commit }: { commit: Commit }, player: Player) {
        commit('ADD_PLAYER_TO_QUEUE', player);
    },
    setWinner({ commit }: { commit: Commit }, player: Player) {
        commit('SET_WINNER', player);
    },
    addCard({ commit }: { commit: Commit }, card: Card) {
        commit('ADD_CARD', card);
    },
    pickUpCards({ state, commit }: { state: Turn; commit: Commit }) {
        const winner = state.winner;
        const round = state.round;

        if (!winner || !round) return;

        if (round.getAttackerPlayers().includes(winner)) {
            round.addAttackerStackCards(state.cards);
        } else {
            round.addDefenderStackCards(state.cards);
        }
    },
    resetPlayersCurrentCard({ state, commit }: { state: Turn; commit: Commit }) {
        // Vous devrez probablement gérer cela dans une action si vous devez manipuler les joueurs
    },
};

  private getters = {
    getRound(state: Turn): Round {
        return state.round;
    },
    getCurrentPlayer(state: Turn): Player {
        return state.currentPlayer;
    },
    getPlayersQueue(state: Turn): Player[] {
        return state.playersQueue;
    },
    getWinner(state: Turn): Player {
        return state.winner;
    },
    getCards(state: Turn): Card[] {
        return state.cards;
    },
};
}
