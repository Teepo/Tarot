<template>

    <div class="gameboard">
        <div :class="['gameboard-player', `gameboard-player__${key}`]" v-for="player, key in this.getPlayersWithCurrentPlayerInFirst()" :key="player.id">

            <span class="gameboard-player-name text-center">
                {{ player.login }}
                <strong class="d-block">( {{ player.getTotalScore() }} pts )</strong>
            </span>

            <span
                :class="{
                    'gameboard-player-card': true,
                    'card': true,
                    [`card--is-${player.currentCard.value}`]: true
                }"
                v-if="player.currentCard">
                <Card
                    :card="player.currentCard"
                    :player="player"
                />
            </span>

            <div class="gameboard-player-cards">
                <template v-for="card in player.getCardsOrderBySignAndValue()" :key="card.getIndex()">
                    <Card
                        :card="card"
                        :player="player"
                        @click="handleClickCard(card)"
                        ref="refCards"
                    />
                </template>
            </div>
        </div>

        <v-dialog class="chiens" max-width="500" v-model="shouldDisplayChien" :scrim="false" persistent>
            <v-card>
                <v-card-text>
                    <div class="chien" v-for="card in this.round.chiens" :key="card.getIndex()">
                        <Card :card="card" @click="handleClickCardChien(card)" />
                    </div>
                </v-card-text>

                <v-card-actions v-if="round.getAttackerPlayers()[0].id === currentPlayer.id">
                    <v-btn color="success" variant="flat" @click="handleClickValidateChien()">Validate</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>

    <DynamicComponent ref="refOverlayGameType" />
    <DynamicComponent ref="refOverlayCallKing" />
    <DynamicComponent ref="refOverlayMisere" />
    <DynamicComponent ref="refOverlayPoignee" />
</template>
  
<script>

import { useRoute } from 'vue-router'

import { mapState, mapGetters } from 'vuex'

import store from './../store';

import { gameTypeList } from './../config/gameTypeList';

import { sleep } from './../utils/timing';

import { socket } from './../modules/ws.js';
import { wsErrorHandler } from './../modules/wsErrorHandler.js';
import { Alert } from './../modules/alert.js';

import { Player } from './../models/player.ts';
import { Game }   from './../models/game.ts';
import { Round }  from './../models/round.ts';
import { Turn }   from './../models/turn.ts';
import { Card }   from './../models/card.ts';

import DynamicComponent from './../components/dynamicComponent.vue';
import OverlayGameType  from './../components/overlayGameType.vue';
import OverlayCallKing  from './../components/overlayCallKing.vue';
import OverlayMisere    from './../components/overlayMisere.vue';
import OverlayPoignee   from './../components/overlayPoignee.vue';

const player1 = new Player({ id : 1, login : 'HUMAN', isCPU : true });
const player2 = new Player({ id : 2, login : 'CPU 1', isCPU : true });
const player3 = new Player({ id : 3, login : 'CPU 2', isCPU : true });
const player4 = new Player({ id : 4, login : 'CPU 3', isCPU : true });
const player5 = new Player({ id : 5, login : 'CPU 4', isCPU : true });

const cpuPlayers = [player2, player3, player4, player5];

let handlerClickCardResolver;
let handlerClickValidateChienResolver;

export default {

    components : [ DynamicComponent ],

    props : {
        isOneplayerMode : {
            type    : Boolean,
            default : false
        },
        isMultiplayerMode : {
            type    : Boolean,
            default : false
        },
    },

    computed : {
        ...mapGetters(['currentPlayer']),
        ...mapState('player', {
            players : state => state.players,
        }),
        ...mapState('round', {
            round : state => state.round,
        })
    },

    data() {

        return {
            game : null,
            shouldDisplayChien : false
        }
    },

    async mounted() {

        this.game = new Game;

        if (this.isOneplayerMode) {

            const currentPlayer = player1;
            
            this.roomName = 'oneplayer';
            
            store.dispatch('setIsOnePlayerMode', true);
            store.dispatch('player/setCurrentPlayerID', currentPlayer.id);
            store.dispatch('player/setPlayers', [
                player1,
                player2,
                player3,
                player4,
                player5
            ]);
        }
        else if (this.isMultiplayerMode) {

            store.dispatch('setIsMultiplayerMode', true);

            const route = useRoute();

            this.playerId = sessionStorage.getItem('playerId');
            this.roomId   = sessionStorage.getItem('roomId');

            if (!this.playerId || !this.roomId) {
                return this.goToHome();
            }

            await store.dispatch('room/simpleJoin', {
				id     : this.playerId,
				roomId : this.roomId,
			})

            store.dispatch('player/setCurrentPlayerID', this.playerId);

            await store.dispatch('player/getPlayers', { roomId : route.params.roomId });

            const { error } = await store.dispatch('room/get', {
                roomId : this.roomId
            });

            if (error) {
                return this.goToHome();
            }
        }

        this.gameLoop();
    },

    methods: {

        gameLoop : async function() {

            while (true) {
                
                const round = await this.newRound();

                store.dispatch('round/set', round);

                await this.askGameType();

                console.log('after ask game type');
                
                await store.dispatch('round/waitGameTypeIsChoosenAndEveryoneHasSpoke', {
                    roomId : this.roomId
                });

                console.log('after waitGameTypeIsChoosenAndEveryoneHasSpoke');
                
                await this.askCalledKing();

                console.log('ask called king');

                this.shouldDisplayChien = true;

                await sleep(1000);

                await this.makeChien(round);

                this.shouldDisplayChien = false;

                round.addAttackerPlayer(round.findPartnerByCards());
                round.setDefenderPlayers(round.findDefenderPlayers());

                round.setStarted(true);

                // Un joueur a pris, on commence la partie
                this.game.addRound(round);

                while (!round.isFinished()) {
                    await this.turnLoop(round);
                }

                // @TODO check petit au bout
                console.log('petit au bout ?', round.havePetitAuBout());

                round.determineTheWinner();

                store.dispatch('round/set', {
                    roomId : this.roomId,
                    round  : round
                });

                console.log('Fin du round', round);
            }
        },

        turnLoop : async function(round) {

            const turn = new Turn;

            round.addTurn(turn);

            turn.buildPlayersQueue();

            store.dispatch('round/set', {
                roomId : this.roomId,
                round  : round
            });

            await this.waitCards(turn);

            // Fin du tour
            turn.determineTheWinner();

            // Les gagnants prennent les Card
            turn.pickUpCards();

            store.dispatch('setTurn', {
                roomName : this.roomName,
                turn     : turn
            });

            console.log('Fin du turn');

            await sleep(1000);
        },

        waitCards : async function(turn) {

            const round = store.getters.round;
            const currentPlayer = store.getters.currentPlayer;

            for await (const player of turn.getPlayersQueue()) {

                const isCPU = player.isCPU;

                console.log(player.login, ' turn');

                store.dispatch('setTurn', {
                    roomName : this.roomName,
                    turn     : turn
                });

                if (round.isFirstTurn()) {
                    await this.handleMiseres(player, isCPU);
                    await this.handlePoignee(player, isCPU);
                }

                let card;
                if (player.id === currentPlayer.id) {

                    // On attend que le Player choissise sa Card
                    card = await new Promise(resolver => {

                        handlerClickCardResolver = resolver;

                        this.activateCardsForPlayer(currentPlayer);
                    });
                }
                else if (this.isOneplayerMode) {

                    await sleep(1000);

                    card = player.pickRandomValidCardInHisDeck(turn);
                }

                console.log(player.login, ' play ', card.label + card.sign);

                // On ajoute la Card dans la liste des Card du tour
                turn.addCard(card);

                // On ajoute au Player la Card joué
                player.setCurrentCard(card);

                // On la supprime du deck du Player
                player.removeCard(card);
            }
        },

        handleClickCard(card) {

            const round  = store.getters.round;
            const currentPlayer = store.getters.currentPlayer;

            if (card.playerId !== currentPlayer.id) {
                return;
            }

            // On est dans la phase de faisage de chien
            if (!round.isStarted()) {

                card.setActive(false);
                card.setPlayerId(null);

                round.chiens.push(card);
                
                currentPlayer.removeCard(card);

                return;
            }

            if (!Game.isOkToPlayThisCard(card)) {
                Alert.add({
                    str : `Player ${currentPlayer.login} try to play card ${card.sign}${card.label}, but this is invalid`,
                    type : 'error'
                });
                return;
            }

            handlerClickCardResolver(card);
        },

        handleClickCardChien(card) {

            const round = store.getters.round;
            const currentPlayer = store.getters.currentPlayer;

            const attackerPlayer = round.getAttackerPlayers()[0];

            card.setActive(true);
            card.setPlayerId(currentPlayer.getId());

            store.dispatch('player/addCard', {
                player : attackerPlayer,
                card
            });

            const index = round.chiens.findIndex(c => c.getIndex() === card.getIndex());
            round.chiens.splice(index, 1);
        },

        handleClickValidateChien() {

            const round = store.getters.round;

            if (!Game.isChienValid(round.chiens)) {
                return Alert.add({ str : 'Chien is invalid', type : 'warning' });
            }

            handlerClickValidateChienResolver();
        },

        activateCardsForPlayer(player) {

            this.$refs.refCards.forEach(card => {
                card.isActive = false;
            });
            
            return this.$refs.refCards
            .filter(card => {
                return card.playerId === player.id;
            })
            .forEach(card => {
                card.isActive = true;
            });
        },

        newRound : async function() {

            if (this.isMultiplayerMode) {
                
                const { round } = await store.dispatch('round/get', {
                    roomId : this.roomId
                });

                return round;
            }

            const round = new Round;

            store.dispatch('player/emptyPlayersCards', {
                roomId : this.roomId
            });

            round.setPlayerWhoGiveCards((() => {

                if (!(this.game.getCurrentRound() instanceof Round)) {
                    if (this.isOneplayerMode) {
                        return player1;
                    }
                    else if (this.isMultiplayerMode) {
                        return store.getters.players[0];
                    }
                }

                return round.getNextPlayerToGiver(store.getters.players);
            })());

            round.buildPlayersQueue(store.getters.players);

            // On distribute les cartes
            round.giveCardsToPlayers(store.getters.players);

            // On check qu'il n'y a pas de petit sec
            if (round.checkIfThereArePetitSec()) {

                Alert.add({
                    str : 'Petit sec detected, we restart the round',
                    type : 'error'
                });

                return this.newRound();
            }

            return round;
        },

        askCalledKing : async function() {

            const round = store.getters.round;

            const currentPlayer = store.getters.currentPlayer;
            const player = round.getAttackerPlayers()[0];

            if (round.hasCalledKing()) {
                return;
            }

            if (this.isMultiplayerMode) {

                if (currentPlayer.id !== player.id) {

                    Alert.add({
                        str : `Waiting Player ${player.login} to call his king...`
                    });

                    await store.dispatch('round/waitCalledKing', {
                        roomId : this.roomId
                    });

                    return;
                }
            }

            const card = await this.renderOverlayCallKing(player);

            this.destroyOverlayCallKing();

            this.isOneplayerMode && Alert.add({
                str : `Player ${player.login} call ${card.value}`,
                type : 'success'
            });

            store.dispatch('round/setCalledKing', {
                roomId : this.roomId,
                card   : card
            });
        },

        askGameType : async function() {

            const round = store.getters.round;

            if (this.isMultiplayerMode) {

                const currentPlayer = store.getters.currentPlayer;

                while (!round.gameTypeIsChoosen() || !round.hasPlayersQueueForAskGameTypeEmpty()) {
                
                    await store.dispatch('round/waitMyTurnToTellGameType', {
                        roomId : this.roomId
                    });

                    const type = await this.renderOverlayGameType(currentPlayer);

                    this.destroyOverlayGameType();

                    console.log({
                        playerId : currentPlayer.id,
                        roomId : this.roomId,
                        type
                    });

                    store.dispatch('round/tellGameType', {
                        playerId : currentPlayer.id,
                        roomId : this.roomId,
                        type
                    });

                    return;
                }
            }
            else if (this.isOneplayerMode) {

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
            }
        },

        makeChien : async function(round) {
            
            if (round.isPetite() || round.isGarde()) {

                const attackerPlayer = round.getAttackerPlayers()[0];

                await new Promise(resolver => {
                    handlerClickValidateChienResolver = resolver;
                });

                await socket.alert({
                    str : `Player ${attackerPlayer.login} make chien`,
                    type : 'success'
                });

                // On mets les cartes selectionnés dans le chien
                // round.addAttackerStackCards(round.chiens);

                store.dispatch('round/updateAfterMakingChien', {
                    chiens : round.chiens
                });
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

        getPlayersWithCurrentPlayerInFirst: function() {
            const index = this.players.indexOf(store.getters.currentPlayer);
            return [...this.players.slice(index), ...this.players.slice(0, index)];
        },

        handleMiseres : async function(player, isCPU) {

            if (!player.haveMisere()) {
                return;
            }

            let misereType = '';

            if (!player.hasCardAtoutInHisCards()) {
                misereType = 'atout';
            }
            else if (!player.hasCardFigureInHisCards()) {
                misereType = 'figure';
            }

            const wantToAnnounce = isCPU ? true : await this.renderOverlayMisere({
                player     : player,
                misereType : misereType
            });

            this.destroyOverlayMisere();

            if (wantToAnnounce) {
                Alert.add({
                    str : `Player ${player.login} have a misere of ${misereType}`,
                    type : 'error'
                });
            }
        },

        handlePoignee : async function(player, isCPU) {

            if (!player.havePoignee()) {
                return;
            }

            let poigneeType = '';

            if (player.haveSimplePoignee()) {
                poigneeType = 'simple';
            }
            if (player.haveDoublePoignee()) {
                poigneeType = 'double';
            }
            if (player.haveTriplePoignee()) {
                poigneeType = 'triple';
            }

            const poigneeAnnounced = isCPU ? poigneeType : await this.renderOverlayPoignee({
                player      : player,
                poigneeType : poigneeType
            });

            this.destroyOverlayPoignee();

            if (poigneeAnnounced) {
                Alert.add({
                    str : `Player ${player.login} have a ${poigneeAnnounced} poignee`,
                    type : 'error'
                });
            }
        },

        renderOverlayPoignee : async function(data) {

            const { player, poigneeType } = data;

            return new Promise(resolver => {
                this.$refs.refOverlayPoignee.render(OverlayPoignee, {
                    player      : player,
                    poigneeType : poigneeType,
                    resolver    : resolver,
                });
            });
        },

        destroyOverlayPoignee : function() {
            this.$refs.refOverlayPoignee.destroy();
        },

        renderOverlayGameType : async function(player) {

            const round = store.getters.round;

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
                    resolver : resolver
                });
            });
        },

        destroyOverlayCallKing : function() {
            this.$refs.refOverlayCallKing.destroy();
        },

        renderOverlayMisere : async function(data) {

            const { player, misereType } = data;

            return new Promise(resolver => {
                this.$refs.refOverlayMisere.render(OverlayMisere, {
                    resolver   : resolver,
                    misereType : misereType
                });
            });
        },

        destroyOverlayMisere : function() {
            this.$refs.refOverlayMisere.destroy();
        },

        goToHome() {
            sessionStorage.clear();
            socket.removeAllListeners();
            this.$router.push({ name : 'index' });
        }
    }
}
</script>