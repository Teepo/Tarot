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

export default {

    props : {
        player   : Object,
        cards    : Array,
        resolver : Function,
    },

    data() {
        return {
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
