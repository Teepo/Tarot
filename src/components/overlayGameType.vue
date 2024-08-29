<template>
    <v-dialog max-width="500" v-model="shouldDisplayDialog" :scrim="false" persistent>
        <v-card>
            <v-card-title>
                Choose game type - {{ player.login }}
            </v-card-title>
            <v-card-text>
                <template v-for="gameType, key in gameTypesAvailable" :key="gameType">
                    <v-btn block color="primary" class="mb-5" @click="handleClickGameType(key)">{{ gameType }}</v-btn>
                </template>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Pass" color="warning" variant="flat" @click="handleClickGameType(false)"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

import { gameTypeList } from '../config/gameTypeList';

export default {

    props : {
        player             : Object,
        gameTypesAvailable : Object,
        resolver           : Function,
    },

    data() {
        return {
            gameTypeList        : gameTypeList,
            shouldDisplayDialog : true
        }
    },

    methods: {

        handleClickGameType: function(gameType) {
            return this.resolver(gameType);
        }
    }
}
</script>
