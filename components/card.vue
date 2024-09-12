<template>
    <div
        :class="{
            'card': true,
            [`card--is-${card.getValue()}`]: true,
            'card--is-mine' : this.isMyCard(),
            'card--is-active' : card.isActive()
        }"
    >
        <img :src="`/imgs/cards/${card.getIndex()}.png`" width="70" height="120" />
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {

    props : {
        card   : Object,
        player : Object
    },

    computed : {
        ...mapGetters(['currentPlayer']),
    },

    methods: {

        isMyCard() {
            return this.card.getPlayerId() && this.card.getPlayerId()=== this.currentPlayer.getId()
        }
    }
}
</script>
