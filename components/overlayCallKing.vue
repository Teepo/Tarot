<template>
    <v-dialog max-width="500" v-model="shouldDisplayDialog" :scrim="false" persistent>
        <v-card>
            <v-card-title>
                Choose king - {{ player.login }}
            </v-card-title>
            <v-card-text>
                <template v-for="card in cards" :key="card">
                    <v-btn block color="primary" class="mb-5" @click="handleClickKingCard(card)">{{ card.sign }}{{ card.label }}</v-btn>
                </template>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>

import { gameTypeList } from './../config/gameTypeList';

import { Game } from './../models/game';

export default {

    props : {
        player   : Object,
        resolver : Function,
    },

    data() {

        let cards = Game.getKingCards();

        if (this.player.hasAllKingCards()) {
            cards = Game.getQueenCards();
        }

        if (this.player.hasAllQueenCards()) {
            cards = Game.getKnightCards();
        }

        if (this.player.hasAllKnightCards()) {
            cards = Game.getJackCards();
        }

        return {
            cards : cards,
            shouldDisplayDialog : true
        }
    },

    methods: {

        handleClickKingCard: function(card) {
            return this.resolver(card);
        }
    }
}
</script>
