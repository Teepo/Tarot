<template>
    <v-dialog max-width="600" v-model="shouldDisplayDialog" :scrim="false" persistent>
        <v-card>
            <v-card-title>
                You have {{ poigneType }} poignee, did you want to announce it ?
            </v-card-title>

            <v-card-actions>
                <v-spacer></v-spacer>
                
                <v-btn v-if="player.haveSimplePoignee()" color="success" variant="flat" @click="handleClickAnnounce('simple')">Simple</v-btn>
                <v-btn v-if="player.haveDoublePoignee()" color="success" variant="flat" @click="handleClickAnnounce('double')">Double</v-btn>
                <v-btn v-if="player.haveTriplePoignee()" color="success" variant="flat" @click="handleClickAnnounce('triple')">Triple</v-btn>
                
                <v-btn color="error" variant="flat" @click="handleClickAnnounce(false)">No</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

export default {

    props : {
        player     : Object,
        poigneType : String,
        resolver   : Function,
    },

    data() {
        return {
            shouldDisplayDialog : true
        }
    },

    methods: {
        handleClickAnnounce: function(announce) {
            return this.resolver(announce);
        }
    }
}
</script>
