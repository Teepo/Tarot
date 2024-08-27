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

import { mapState } from 'vuex'

export default {

    props : {
        card   : Object,
        player : Object
    },

    computed : {
        ...mapState(['currentPlayer'])
    },

    data : function() {

        return {
            isActive : false,
        }
    },

    methods: {

        isMyCard() {
            return this.card.getPlayerId() && this.card.getPlayerId()=== this.currentPlayer.getId()
        }
    }
}
</script>
