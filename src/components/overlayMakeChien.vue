<template>
</template>

<script>

import { gameTypeList } from '../config/gameTypeList';

import { Alert } from './../modules/alert';

import { Game } from './../game';

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
