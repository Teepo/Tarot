<template>
    <div
        :class="{
            'card': true,
            [`card--is-${card.value}`]: true,
            'card--is-mine' : this.isMyCard(),
            'card--is-active' : this.isActive
        }"
    >
        {{ card.value }}
    </div>
</template>

<script>

import { store } from './../store/index.js';

export default {

    props : {
        card   : Object,
        player : Object
    },

    data : function() {

        return {
            isActive      : false,
            player        : this.player,
            currentPlayer : store.state.currentPlayer
        }
    },

    methods: {

        isMyCard() {
            return this.card.getPlayer() && this.card.getPlayer().getId() === this.currentPlayer.getId()
        }
    }
}
</script>
