import { Game } from '../models/game';
import { Round } from '../models/round';
import { Player } from '../models/player';

import { Module, VuexModule, Action } from "vuex-class-modules";

@Module
export default class GameStore extends VuexModule {

    namespaced = true;

    players : Player[] = [];
    rounds : Round[] = [];
    currentPlayer : Player | null = null;

    mutations = {
        SET_CURRENT_PLAYER(state: Game, player: Player) {
            state.setCurrentPlayer(player);
        },

        SET_PLAYERS(state: Game, players: Player[]) {
            state.setCurrentPlayer(players);
        },
    }

    @Action
    setCurrentPlayer(player: Player) {
        this.currentPlayer = player;
    }

    @Action
    setPlayers(players: Player[]) {
        this.players = players;
    }

    actions = {
        setCurrentPlayer({ commit }: { commit: Commit }, player: Player) {
            commit('SET_CURRENT_PLAYER', player);
        },

        setPlayers({ commit }: { commit: Commit }, players: Player[]) {
            commit('SET_PLAYERS', players);
        },
    }
}