<template>

	<v-container class="fill-height">
		<v-responsive class="d-flex align-center fill-height">

			<v-container class="pl-0 mt-10">
				<v-btn class="bg-primary" @click="showOverlayNewRoom = true">CREATE ROOM</v-btn>
			</v-container>

			<div class="text-h6 mb-1">ROOMS</div>
			<v-table class="text-left">
				<thead>
					<tr>
						<th class="text-left">ID</th>					
						<th class="text-left">NAME</th>
						<th class="text-left">IS STARTED ?</th>
						<th class="text-left">SETTINGS</th>						
						<th class="text-left">ACTIONS</th>
					</tr>
				</thead>
				<tbody>
				{{ console.log(rooms) }}
					<tr v-for="room in rooms" :key="room.name">
					     	<td>{{ room.id }}</td>
						<td>{{ room.name }}</td>
						<td>{{ room.isStarted }}</td>
						<td>{{ room.settings }}</td>
						<td>
							<v-btn icon="mdi-play" @click="this.startRoom(room.name)"></v-btn>
							<v-btn icon="mdi-delete" @click="this.deleteRoom(room.name)"></v-btn>
						</td>
					</tr>
				</tbody>
			</v-table>

			<v-container class="pl-0 mt-10">
				<v-btn class="bg-primary" @click="deleteAllPlayers">CLEAN PLAYERS</v-btn>
			</v-container>

			<div class="text-h6 mb-1">ALL PLAYERS</div>
			<v-table class="text-left">
				<thead>
					<tr>
						<th class="text-left">ID</th>
						<th class="text-left">LOGIN</th>
						<th class="text-left">ROOM</th>
						<th class="text-left">IS READY ?</th>
						<th class="text-left">CUSTOM DATA</th>
						<th class="text-left">ACTIONS</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="player in players" :key="player.id">
						<td class="text-left">{{ player.id }}</td>
						<td>{{ player.login }}</td>
						<td>{{ player.roomName }}</td>
						<td>{{ player.isReady }}</td>
						<td>{{ player.customData }}</td>
						<td>
							<v-btn icon="mdi-delete" @click="this.deletePlayer(player.id)"></v-btn>
						</td>
					</tr>
				</tbody>
			</v-table>

			<v-dialog
				v-model="showOverlayNewRoom"
				contained
				persistent
				class="align-center justify-center"
			>
				<v-list>

					<v-btn icon @click="showOverlayNewRoom = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>

					<v-sheet width="300" class="mx-auto">
						<v-form @submit.prevent>
							<v-text-field v-model="formCreateRoomInputValue" :rules="formCreateRoomRules" label="Room name"></v-text-field>
							<v-btn type="submit" class="bg-primary mb-10 d-flex w-100" @click="createRoom">Create room</v-btn>
						</v-form>
					</v-sheet>
				</v-list>
			</v-dialog>

		</v-responsive>
	</v-container>
</template>

<script>

import { WS_PROTOCOL, WS_HOST, WS_PORT} from './../../../config/index.js';

import { io } from 'socket.io-client';

export default {

	data() {

		return {
			players : [],
			rooms   : [],

			showOverlayNewRoom : false,

			formCreateRoomInputValue: 'blindtest',
			formCreateRoomRules: [
				value => {
					if (value) return true
					return 'You must enter a room name.'
				},
			]
		}
	},
    
    async mounted() {
        
        this.socket = new io(`${WS_PROTOCOL}://${WS_HOST}:${WS_PORT}`);

        this.socket.on('connect', () => {
            this.socket.emit('getRooms');
            this.socket.emit('getAllPlayers');
        });

		this.socket.on('start', data => {
			this.handleStart(data);
        });

		this.socket.on('getRooms', data => {
			this.handleGetRooms(data);
        });

		this.socket.on('getAllPlayers', data => {
			this.handleGetAllPlayers(data);
		});

		this.socket.on('createdRoom', data => {
			this.handleCreateRoom(data);
        });

		this.socket.on('joinedRoom', data => {
			this.handleJoinedRoom(data);
        });

		this.socket.on('leavedRoom', data => {
			this.handleLeavedRoom(data);
        });

		this.socket.on('deletedRoom', data => {
			this.handleDeletedRoom(data);
        });

		this.socket.on('deletedPlayer', data => {
			this.handleDeletedPlayer(data);
        });

		this.socket.on('deletedAllPlayers', () => {
			this.handleDeletedAllPlayers();
        });
    },
    methods : {

		createRoom() {

			this.socket.emit('createRoom', {
                roomName : this.formCreateRoomInputValue
            });

			this.showOverlayNewRoom = false;
		},

		createPlayer() {

			this.socket.emit('joinRoom', {
				login    : this.generateRandomString(10),
                roomName : 'petank'
            });
		},

		deletePlayer(id) {
			this.socket.emit('deletePlayer', { id : id });
		},

		deleteAllPlayers() {
			this.socket.emit('deleteAllPlayers');
		},

		startRoom(name) {

			this.socket.emit('start', {
				roomName : name
			});
		},

		deleteRoom(name) {
			this.socket.emit('deleteRoom', { roomName : name });
		},

		handleStart(data) {

			const { room } = data;

			this.rooms.find(r => r.name == room.name).isStarted = room.isStarted;
        },

        handleGetRooms(data) {
			const { rooms } = data;
			this.rooms = rooms;
        },

		handleGetAllPlayers(data) {
			const { players } = data;
			this.players = players;
		},

		handleCreateRoom(data) {
			const { room } = data;
			this.rooms.push(room);
        },

		handleJoinedRoom(data) {
			const { player } = data;
			this.players.push(player);
        },

		handleLeavedRoom(data) {
			this.handleDeletedPlayer(data);
        },

		handleDeletedPlayer(data) {

			const { id } = data;

			this.players = this.players.filter(p => {
                return p.id !== id;
            }) ?? [];
        },

		handleDeletedRoom(data) {

			const { roomName } = data;

			this.rooms = this.rooms.filter(r => {
				return r.name !== roomName;
			}) ?? [];
		},

		handleDeletedAllPlayers() {
			this.players = [];
        },

		generateRandomString(length) {

			let string = '';
			const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

			for (let i = 0; i < length; i++) {
				const randomIndex = Math.floor(Math.random() * chars.length);
				string += chars.charAt(randomIndex);
			}

			return string;
		}
    }
}
</script>