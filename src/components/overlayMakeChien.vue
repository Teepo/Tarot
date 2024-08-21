<template>
    <v-dialog max-width="500" v-model="shouldDisplayDialog" :scrim="false" persistent>
        <v-card>
            <v-card-title>
                Make chien - {{ player.login }}
            </v-card-title>

            <v-card-text>
                <template v-for="card in chiens" :key="card">
                    <v-btn color="primary" class="mr-5 mb-5" @click="handleClickChienCard(card)">{{ card.sign + card.label }}</v-btn>
                </template>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-text>
                <template v-for="card in cards" :key="card">
                    <v-btn color="primary" class="mr-5 mb-5" @click="handleClickDeckCard(card)">{{ card.sign + card.label }}</v-btn>
                </template>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Go" color="success" variant="flat" @click="handleClickGo()"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

import { gameTypeList } from './../config/gameTypeList';

import { Alert } from './../modules/alert';

import { Game } from './../game';
import { Card } from './../card';

export default {

    props : {
        player   : Object,
        chiens   : Array,
        cards    : Array,
        resolver : Function,
    },

    data() {
        return {
            shouldDisplayDialog : true
        }
    },

    methods: {

        handleClickChienCard: function(card) {
            const index = this.chiens.findIndex(c => c.index === card.index);
            this.chiens.splice(index, 1);
            this.cards.push(card);
        },

        handleClickDeckCard: function(card) {
            const index = this.cards.findIndex(c => c.index === card.index);
            this.cards.splice(index, 1);
            this.chiens.push(card);
        },

        handleClickGo: function() {

            if (!Game.isChienValid(this.chiens)) {
                return Alert.add({ str : 'Chien is invalid', type : 'warning' });
            }

            return this.resolver({ cards : this.cards, chiens : this.chiens})
        },
    }
}
</script>
