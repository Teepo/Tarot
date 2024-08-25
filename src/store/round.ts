import { Deck } from '../models/deck';
import { Player } from '../models/player';
import { Card } from '../models/card';
import { Turn } from '../models/turn';
import { Round } from '../models/round';

import { createStore, Store, Commit } from 'vuex';

export default class RoundStore {

    store: Store<Round>;

    private state = {
        attackerPlayers: [],
        defenderPlayers: [],
        attackerStackCards: [],
        defenderStackCards: [],
        attackerPoints: 0,
        defenderPoints: 0,
        playersQueue: [],
        playerWhoGiveCards: null,
        calledKing: null,
        gameType: null,
        turns: [],
        deck: new Deck,
        chiens: [],
    };

    constructor() {
        this.store = createStore({
            state     : this.state,
            mutations : this.mutations,
            actions   : this.actions,
            getters   : this.getters,
        });
    }

    private mutations = {
        SET_ATTACKER_PLAYERS(state: Round, players: Array<Player>) {
            state.attackerPlayers = players;
        },
        SET_DEFENDER_PLAYERS(state: Round, players: Array<Player>) {
            state.defenderPlayers = players;
        },
        ADD_ATTACKER_PLAYER(state: Round, player: Player) {
            state.addAttackerPlayer(player);
        },
        ADD_DEFENDER_PLAYER(state: Round, player: Player) {
            state.addDefenderPlayer(player);
        },
        RESET_ATTACKER_PLAYERS(state: Round) {
            state.resetAttackerPlayers();
        },
        SET_CALLED_KING(state: Round, card: Card) {
            state.setCalledKing(card);
        },
        SET_GAME_TYPE(state: Round, type: number) {
            state.setGameType(type);
        },
        SET_PLAYER_WHO_GIVE_CARDS(state: Round, player: Player) {
            state.setPlayerWhoGiveCards(player);
        },
        SET_ATTACKER_POINTS(state: Round, points: number) {
            state.setAttackerPoints(points);
        },
        SET_DEFENDER_POINTS(state: Round, points: number) {
        state.setDefenderPoints(points);
        },
        ADD_CARD_IN_CHIEN(state: Round) {
            state.addCardInChien();
        },
        GIVE_CARDS_TO_PLAYERS(state: Round) {
            state.giveCardsToPlayers();
        },
        ADD_TURN(state: Round, turn: Turn) {
            state.addTurn(turn);
        },
        BUILD_PLAYERS_QUEUE(state: Round) {
            state.buildPlayersQueue();
        },
        SET_POINTS(state: Round) {
            state.setPoints();
        },
        DETERMINE_THE_WINNER(state: Round) {
            state.determineTheWinner();
        },
        EMPTY_PLAYERS_CARDS(state: Round) {
            state.emptyPlayersCards();
        }
    }

    private actions = {
        addAttackerPlayer({ commit }: { commit: Commit }, player: Player) {
            commit('ADD_ATTACKER_PLAYER', player);
        },
        addDefenderPlayer({ commit }: { commit: Commit }, player: Player) {
            commit('ADD_DEFENDER_PLAYER', player);
        },
        resetAttackerPlayers({ commit }: { commit: Commit }) {
            commit('RESET_ATTACKER_PLAYERS');
        },
        setCalledKing({ commit }: { commit: Commit }, card: Card) {
            commit('SET_CALLED_KING', card);
        },
        setGameType({ commit }: { commit: Commit }, type: number) {
            commit('SET_GAME_TYPE', type);
        },
        setPlayerWhoGiveCards({ commit }: { commit: Commit }, player: Player) {
            commit('SET_PLAYER_WHO_GIVE_CARDS', player);
        },
        giveCardsToPlayers({ commit }: { commit: Commit }) {
            commit('GIVE_CARDS_TO_PLAYERS');
        },
        addCardInChien({ commit }: { commit: Commit }) {
            commit('ADD_CARD_IN_CHIEN');
        },
        addTurn({ commit }: { commit: Commit }, turn: Turn) {
            commit('ADD_TURN', turn);
        },
        setPoints({ commit }: { commit: Commit }) {
            commit('SET_POINTS');
        },
        determineTheWinner({ commit }: { commit: Commit }) {
            commit('DETERMINE_THE_WINNER');
        },
        emptyPlayersCards({ commit }: { commit: Commit }) {
            commit('EMPTY_PLAYERS_CARDS');
        },
    }

    private getters = {
        getAttackerPlayers: (state: Round) => state.getAttackerPlayers(),
        getDefenderPlayers: (state: Round) => state.getDefenderPlayers(),
        getCalledKing: (state: Round) => state.getCalledKing(),
        getGameType: (state: Round) => state.getGameType(),
        getPlayersQueue: (state: Round) => state.getPlayersQueue(),
        getChiens: (state: Round) => state.getChiens(),
        getAttackerPoints: (state: Round) => state.getAttackerPoints(),
        getDefenderPoints: (state: Round) => state.getDefenderPoints(),
        getTurns: (state: Round) => state.getTurns(),
        isFinished: (state: Round) => state.isFinished(),
        getCurrentTurn: (state: Round) => state.getCurrentTurn(),
        getPreviousTurn: (state: Round) => state.getPreviousTurn(),
        getAvailablesGameType: (state: Round) => state.getAvailablesGameType(),
        checkIfThereArePetitSec: (state: Round) => state.checkIfThereArePetitSec(),
        findPartnerByCards: (state: Round) => state.findPartnerByCards(),
        findDefenderPlayers: (state: Round) => state.findDefenderPlayers(),
        getNextPlayerToGiver: (state: Round) => state.getNextPlayerToGiver(),
    }
}
