<template>
    <v-dialog max-width="600" v-model="shouldDisplayDialog" :scrim="false" persistent>
        <v-card>
            <v-card-title>
                You have misere of figure, did you want to announce it ?
            </v-card-title>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Go" color="success" variant="flat" @click="handleClickAnnounce(true)">Yes</v-btn>
                <v-btn text="Go" color="error" variant="flat" @click="handleClickAnnounce(false)">No</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

export default {

    props : {
        resolver : Function,
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
