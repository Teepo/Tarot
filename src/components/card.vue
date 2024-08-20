<template>
    <div
        :class="{
            'card': true,
            [`card--is-${card.value}`]: true,
            'card--is-mine' : this.isMyCard(),
            'card--is-active' : this.isActive
        }"
    >
        <img :src="`/imgs/cards/${card.index}.png`" width="70" height="120" />
    </div>
</template>

<script>

import { store } from './../store/index.js';

export default {

    props : {
        _card   : Object,
        _player : Object
    },

    data : function() {

        return {
            isActive      : false,
            card          : this._card,
            player        : this._player,
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
