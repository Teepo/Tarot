<template>
    <v-container class="mt-16" v-if="players.length > 0">

        <v-container>
            <strong class="mr-5">ROOM ID = {{ room.id }}</strong>
            <v-icon class="cursor-pointer" icon="mdi-content-copy" @click="copyHandler(room.id)"></v-icon>
        </v-container>

        <v-container>
            <strong class="d-block mr-5 text-decoration-underline">Share this link to invite people = </strong>
            <strong>{{ joinLink }}</strong>
            <v-icon class="cursor-pointer ml-5" icon="mdi-content-copy" @click="copyHandler(joinLink)"></v-icon>
        </v-container>

        <v-container v-for="(player, index) in players" :key="index">
            <v-card :theme="player.isReady ? 'is-ready' : 'is-not-ready'" >
                <v-card-item>
                    <v-card-text>
                        <v-row class="align-center">

                            <v-col cols="8">
                                <v-row class="align-center">
                                    <img :src="`assets/img/avatars/${player.customData.avatar}`" class="mr-4" :width="32" @click="showOverlayAvatar(player)">
                                    <strong class="font-weight-bold">
                                        {{ player.login }}
                                    </strong>
                                </v-row>
                            </v-col>

                            <v-col cols="4" class="player-list-status">
                                <v-checkbox-btn
                                    v-if="currentPlayer && currentPlayer.id == player.id"
                                    @click="togglePlayerReadyHandler"
                                    :model-value="player.isReady"
                                    label="I'm ready"
                                    ></v-checkbox-btn>
                                <template v-else>
                                    <v-icon v-if="player.isReady" icon="mdi-check" color="green-lighten-1"></v-icon>
                                    <v-icon v-else icon="mdi-close" color="red-lighten-1"></v-icon>
                                </template>
                            </v-col>

                        </v-row>
                    </v-card-text>
                </v-card-item>
            </v-card>
        </v-container>

        <v-container v-if="currentPlayer && room.owner && room.owner.id == currentPlayer.id">
            <v-btn class="mt-10" color="primary" block @click="startTheRoom">START THE GAME</v-btn>
        </v-container>

        <v-container>
            <v-btn class="bg-red mt-10" block @click="leaveTheRoom">LEAVE THE ROOM</v-btn>
        </v-container>
    </v-container>
</template>

<script>

import { useRouter } from 'vue-router';

import { mapState, mapGetters } from 'vuex';

import store from '@/store';

import { socket } from '@/modules/ws.js';
import { wsErrorHandler } from '@/modules/wsErrorHandler.js';

import { getFileNameAndExtension } from '@/utils/string';

import { Player } from '@/models/player';

export default {

    setup() {

        const roomId = sessionStorage.getItem('roomId');

        const router = useRouter();

        return {
            getFileNameAndExtension,
            joinLink : window.location.origin + router.resolve({ name : 'JoinRoom', params : { roomId }}).href
         };
    },

    computed: {
        ...mapGetters(['currentPlayer']),
        ...mapState('player', {
            players : state => state.players,
        }),
        ...mapState('room', {
            room: state => state.room
        }),
    },

    async mounted() {

        this.playerId = sessionStorage.getItem('playerId');
        this.roomId   = sessionStorage.getItem('roomId');

        if (!this.playerId || !this.roomId) {
            return this.goToHome();
        }

        const { error } = await store.dispatch('player/get', {
            roomId   : this.roomId,
            playerId : this.playerId
        });
        
        if (error) {
            return this.goToHome();
        }

        store.dispatch('player/setCurrentPlayerID', this.playerId);

        store.dispatch('room/get', {
            roomId : this.roomId
        });

        store.dispatch('player/getPlayers', { roomId : this.roomId });
    },

    methods: {

        startTheRoom() {
            socket.emit('room/start', { roomId : this.roomId });
        },

        leaveTheRoom() {

            store.dispatch('room/leave', {
                roomId   : this.roomId,
                playerId : this.playerId
            });

            return this.goToHome();
        },

        togglePlayerReadyHandler() {

            store.dispatch('player/toggleIsReady', {
                roomId   : this.roomId,
                playerId : this.playerId
            });
        },

        copyHandler(value) {
            navigator.clipboard.writeText(value);
        },

        goToHome() {
            sessionStorage.clear();
            socket.removeAllListeners();
            this.$router.push({ name : 'index' });
        }
    }
}
</script>

<style lang="scss" scoped>
    .player-list {

        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        &--is-visible {
            display: flex;
        }

        &-status {
            display: flex;
            justify-content: end;
        }
    }

    .v-card {

        &-item {
            height: 60px;

            .v-checkbox-btn {

                flex: initial;

                .v-label {
                    white-space: nowrap;
                }
            }
        }

        &.v-theme {

            &--is-ready {
                border: 2px solid rgb(var(--v-theme-green-lighten-1));
            }

            &--is-not-ready {
                border: 2px solid rgb(var(--v-theme-red-lighten-1));
            }
        }
    }

    .v-overlay {

        .v-card {

            &-item {
                height: auto;
            }

            &-text {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                gap: 20px;
                justify-content: center;
            }
        }
    }

    .v-col .v-label {
        font-size: .85rem;
    }
</style>