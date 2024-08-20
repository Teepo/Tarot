<template>

    <div class="gameboard">
        <div :class="['gameboard-player', `gameboard-player__${key}`]" v-for="player, key in players" :key="player.id">

            <span class="gameboard-player-name text-center">
                {{ player.login }}
                <strong class="d-block">( 0 pts )</strong>
            </span>

            <span
            :class="{
                'gameboard-player-card': true,
                'card': true,
                [`card--is-${player.currentCard.value}`]: true
            }"
            v-if="player.currentCard">
                {{ player.currentCard.value }}
            </span>

            <div class="gameboard-player-cards">
                <template v-for="card in player.cards" :key="card.index">
                    <Card
                        :card="card"
                        :player="player"
                        @click="handleClickCard(card)"
                        ref="refCards"
                    />
                </template>
            </div>
        </div>
    </div>

    <DynamicComponent ref="refOverlayGameType" />
    <DynamicComponent ref="refOverlayCallKing" />
    <DynamicComponent ref="refOverlayMakeChien" />
</template>
  
<script>

import { store } from './../store';

import { gameTypeList } from './../config/gameTypeList';

import { socket } from './../modules/ws.js';
import { wsErrorHandler } from './../modules/wsErrorHandler.js';
import { Alert } from './../modules/alert.js';

import { Player } from './../player';
import { Game }   from './../game';
import { Round }  from './../round';
import { Turn }   from './../turn';
import { Card }   from './../card';

import DynamicComponent from './../components/dynamicComponent.vue';
import OverlayGameType  from './../components/overlayGameType.vue';
import OverlayCallKing  from './../components/overlayCallKing.vue';
import OverlayMakeChien from './../components/overlayMakeChien.vue';
import Board            from './../components/board.vue';

const player1 = new Player({ id : 'A', login : 'A' });
const player2 = new Player({ id : 'B', login : 'B' });
const player3 = new Player({ id : 'C', login : 'C' });
const player4 = new Player({ id : 'D', login : 'D' });
const player5 = new Player({ id : 'E', login : 'E' });

const currentPlayer = player1;

let handlerClickCardResolver;

export default {

    components : [ DynamicComponent ],

    data() {

        return {
            game    : null,
            players : [],
            currentPlayer : currentPlayer,
        }
    },

    mounted() {

        this.game = new Game;
        this.game.setCurrentPlayer(currentPlayer);

        this.game.setPlayers([
            player1,
            player2,
            player3,
            player4,
            player5
        ]);

        this.players = this.game.getPlayers();

        store.commit('setCurrentPlayer', currentPlayer);
        store.commit('setPlayers', this.game.getPlayers());

        this.gameLoop();
    },

    methods: {

        gameLoop : async function() {

            while (true) {
                
                const round = this.newRound();

                // await this.askGameType(round);
                
                // Fake game type
                round.setGameType(1);
                round.resetAttackerPlayers();
                round.addAttackerPlayer(player1);
                
                // await this.askCalledKing(round);

                // Fake call king
                round.setCalledKing(new Card(42));

                await this.makeChien(round);

                round.addAttackerPlayer(round.findPartnerByCards());
                round.setDefenderPlayers(round.findDefenderPlayers());

                // Un joueur a pris, on commence la partie
                this.game.addRound(round);

                while (!round.isFinished()) {

                    const turn = new Turn;
                    turn.setRound(round);
                    turn.setPlayers(round.getPlayers());

                    turn.buildPlayersQueue();

                    round.addTurn(turn);

                    store.commit('setRound', round);

                    await this.waitCards(turn);

                    // Fin du tour
	                turn.determineTheWinner();

                    // Les gagnants prennent les Card
                    turn.pickUpCards();

                    store.commit('setTurn', turn);

                    console.log('Fin du turn');
                }

                // On compte les points
                round.setPoints();

                round.determineTheWinner();

                store.commit('setRound', round);

                console.log('Fin du round', round);
            }
        },

        waitCards : async function(turn) {

            for await (const player of turn.getPlayersQueue()) {

                console.log(player.id);

                turn.setCurrentPlayer(player);

                store.commit('setTurn', turn);

                // On attend que le Player choissise sa Card
                const card = await new Promise(resolver => {

                    handlerClickCardResolver = resolver;
                
                    this.activateCardsForPlayer(turn.getCurrentPlayer());
                });

                // On ajoute la Card dans la liste des Card du tour
                turn.addCard(card);

                // On ajoute au Player la Card joué
                player.setCurrentCard(card);

                console.log(card);
            }
        },

        handleClickCard(card) {

            const turn          = store.state.turn;
            const currentPlayer = turn.currentPlayer;

            if (card.player.id !== currentPlayer.id) {
                return;
            }

            if (!Game.isOkToPlayThisCard(turn, currentPlayer, card)) {
                Alert.add({
                    str : `Player ${currentPlayer.login} try to play card ${card.value}, but this is invalid`,
                    type : 'error'
                });
                return;
            }

            handlerClickCardResolver(card);
        },

        activateCardsForPlayer(player) {

            this.$refs.refCards.forEach(card => {
                card.isActive = false;
            });
            
            return this.$refs.refCards
            .filter(card => {
                return card.player.id === player.id;
            })
            .forEach(card => {
                card.isActive = true;
            });
        },

        newRound : function() {

            const round = new Round;

            round.setGame(this.game);

            round.setPlayers(this.game.getPlayers());

            round.setPlayerWhoGiveCards((() => {

                if (!(this.game.getCurrentRound() instanceof Round)) {
                    return player1;
                }

                return this.game.getCurrentRound().getNextPlayerToGiver();
            })());

            round.buildPlayersQueue();

            // On distribute les cartes
            round.giveCardsToPlayers();

            return round;
        },

        askCalledKing : async function(round) {

            const player = round.getAttackerPlayers()[0];

            const card = await this.renderOverlayCallKing(player);

            Alert.add({
                str : `Player ${player.login} call ${card.value}`,
                type : 'success'
            });

            round.setCalledKing(card);
        },

        askGameType : async function(round) {

            while (!round.gameTypeIsChoosen()) {

                for await (const player of round.getPlayersQueue()) {

                    const type = await this.renderOverlayGameType(player, round);

                    this.destroyOverlayGameType();

                    // Si le joueur ne passe pas, on ajoute le joueur à la liste des attaquants
                    if (type) {
                        
                        round.setGameType(parseInt(type));
                        round.resetAttackerPlayers();
                        round.addAttackerPlayer(player);

                        Alert.add({
                            str : `Player ${player.login} take ${gameTypeList[type]}`,
                            type : 'success'
                        });
                    }
                    else {
                        Alert.add({
                            str : `Player ${player.login} pass`,
                            type : 'warning'
                        });
                    }
                }
            }
        },

        makeChien : async function(round) {
            
            if (round.isPetite() || round.isGarde()) {

                const attackerPlayer = round.getAttackerPlayers()[0];

                const { cards, chiens } = await this.renderOverlayMakeChien(attackerPlayer, round);

                Alert.add({
                    str : `Player ${attackerPlayer.login} make chien`,
                    type : 'success'
                });

                this.destroyOverlayMakeChien();

                // On mets les cartes selectionnés dans le chien
                round.addAttackerStackCards(chiens);

                // On met à jour notre deck
                attackerPlayer.setCards(cards);
            }
            else if (round.isGardeSans()) {

                // On mets le chien direct dans notre stack de carte
                round.addAttackerStackCards(round.getChiens());
            }
            else if (round.isGardeContre()) {

                // On mets le chien direct dans la stack de carte des defenseurs
                round.addDefenderStackCards(round.getChiens());
            }
        },

        renderOverlayGameType : async function(player, round) {

            return new Promise(resolver => {
                this.$refs.refOverlayGameType.render(OverlayGameType, {
                    player             : player,
                    gameTypesAvailable : round.getAvailablesGameType(),
                    resolver           : resolver
                });
            });
        },

        destroyOverlayGameType : function() {
            this.$refs.refOverlayGameType.destroy();
        },

        renderOverlayCallKing : async function(player) {

            return new Promise(resolver => {

                this.$refs.refOverlayCallKing.render(OverlayCallKing, {
                    player   : player,
                    cards    : Game.getKingCards(),
                    resolver : resolver
                });
            });
        },

        destroyOverlayCallKing : function() {
            this.$refs.refOverlayCallKing.destroy();
        },

        renderOverlayMakeChien : async function(player, round) {

            return new Promise(resolver => {

                this.$refs.refOverlayMakeChien.render(OverlayMakeChien, {
                    player   : player,
                    cards    : player.getCards(),
                    chiens   : round.getChiens(),
                    resolver : resolver
                });
            });
        },

        destroyOverlayMakeChien : function() {
            this.$refs.refOverlayMakeChien.destroy();
        },

        renderBoard : function(players) {

            this.$refs.refBoard.render(Board, {
                currentPlayer : currentPlayer,
                players       : players
            });
        }
    }
}
</script>