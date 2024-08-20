<template>
    <div class="gameboard">
        <div :class="['gameboard-player', `gameboard-player__${key}`]" v-for="player, key in players" :key="player.id">

            <span class="gameboard-player-name">{{ player.login }}</span>

            <span class="gameboard-player-card card card--is-{{ player.currentCard.value }}" v-if="player.currentCard">
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
</template>

<script>

import { store } from './../store';

import Card from './card';

export default {

    components : [ Card ],

    props : {
        players : Array,
        currentPlayer : Object
    },

    data : function() {

        return {
            players       : this.players,
            currentPlayer : store.state.currentPlayer,
        }
    },

    methods: {

        handleClickCard() {

        }
    }
}
</script>
