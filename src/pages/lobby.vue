<template>
    <v-container class="mt-16">
        <v-container v-for="(player, index) in players.toArray()" :key="index">
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
                                    v-if="this.id == player.id"
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

            <v-dialog
                v-if="player.id == this.playerId"
                v-model="this.shouldDisplayOverlayAvatars[player.id]"
                contained
                class="align-center justify-center"
            >
                <v-card>
                    <v-card-item>
                        <v-card-text>
                            <template v-for="image in this.avatarsFiles">
                                <img :src="image" :width="32" @click="selectavatarImage(player, getFileNameAndExtension(image))">
                            </template>
                        </v-card-text>
                    </v-card-item>
                </v-card>
            </v-dialog>
        </v-container>

        <v-container>
            <v-btn class="mt-10" color="primary" block @click="startTheRoom">START THE GAME</v-btn>
        </v-container>

        <v-container>
            <v-btn class="bg-red mt-10" block @click="leaveTheRoom">LEAVE THE ROOM</v-btn>
        </v-container>
    </v-container>
</template>

<script>

import { mapState } from 'vuex';

import { store } from './../store';

import { socket } from './../modules/ws.js';
import { wsErrorHandler } from '../modules/wsErrorHandler.js';

import { getFileNameAndExtension } from './../utils/string';

import { Player } from './../player';

export default {

    setup() {
        return { getFileNameAndExtension };
    },

    computed: {
        ...mapState(['players'])
    },

    async created() {

        const images = [];

        const avatarsFiles = import.meta.glob('./../../imgs/avatars/*');
        for (const path in avatarsFiles) {
            images.push(`./assets/img/avatars/${getFileNameAndExtension(path)}`);
        }

        this.avatarsFiles = images;
    },

    async mounted() {

        this.playerId = sessionStorage.getItem('playerId');
        this.roomId   = sessionStorage.getItem('roomId');

        if (!this.playerId || !this.roomId) {
            return this.goToHome();
        }

        socket.emit('room/join', {
            id     : 'B',
            login  : 'B',
            roomId : this.roomId
        });

        socket.emit('room/join', {
            id     : 'C',
            login  : 'C',
            roomId : this.roomId
        });

        socket.emit('room/join', {
            id     : 'D',
            login  : 'D',
            roomId : this.roomId
        });

        socket.emit('room/join', {
            id     : 'E',
            login  : 'E',
            roomId : this.roomId
        });

        const { error } = await store.dispatch('getPlayer', {
            playerId : this.playerId,
            roomId   : this.roomId
        });
        
        if (error) {
            return this.goToHome();
        }

        store.dispatch('setRoom', {
            roomId : this.roomId
        });

        store.dispatch('getPlayers', {
            roomId : this.roomId
        });
        
        socket
        .on('start', () => {

            socket.removeAllListeners();

            this.$router.push('/game');
        })
        .on('getAllPlayersFromRoom', data => {
            this.handleGetAllPlayersFromRoom(data);
        })
        .on('updatedPlayer', data => {
            const { player } = data;
            this.players.set(player.id, player);
        })
        .on('joinedRoom', data => {
            this.handleJoinedRoom(data);
        })
        .on('setPlayerIsReady', data => {

            const { player } = data;

            this.players.get(player.id).isReady = player.isReady;
        })
        .on('leavedRoom', data => {
            const { id } = data;
            this.players.delete(id);
        })
        .on('deletedPlayer', data => {

            const { id } = data;

            // kick mode
            if (this.id === id) {
                socket.removeAllListeners();
                return this.back();
            }

            this.players.delete(id);
        });
    },

    methods: {

        startTheRoom() {

            socket.emit('start', {
                roomName : this.room
            });
        },

        leaveTheRoom() {

            socket.emit('leaveRoom', {
                id       : this.id,
                roomName : this.room
            });

            this.goToHome();
        },

        handleGetAllPlayersFromRoom(data) {

            const { players } = data;

            players.map(player => {
                this.players.set(player.id, player);
            });
        },

        handleJoinedRoom(data) {

            const { player, error } = data;
			
            if (error) {
                return;
            }
            
            this.players.set(player.id, player);
        },

        togglePlayerReadyHandler() {

            store.dispatch('togglePlayerIsReady', {
                playerId : this.playerId
            });
        },

        showOverlayAvatar(player) {

            if (this.id !== player.id) {
                return;
            }

            this.shouldDisplayOverlayAvatars[player.id] = true;
         },

        selectAvatarImage(player, avatarName) {

            player.customData.avatar = avatarName;

            if (this.id !== player.id) {
                return;
            }

            socket.emit('updatePlayer', {
                roomName : this.room,
                player   : player
            });

            this.shouldDisplayOverlayAvatars[player.id] = false;
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