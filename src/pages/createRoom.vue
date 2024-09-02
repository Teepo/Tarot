<template>
	<v-container fill-height class="d-flex align-center justify-center">
		<v-sheet width="300" elevation="2">

			<v-form @submit.prevent="handleOnSubmit" ref="form">

				<v-text-field label="Room name" v-model="roomName" :rules="formRules.roomName" />

				<v-number-input label="Round" v-model="roundNumber" :min="1" :rules="formRules.roomNumber" />

				<v-btn color="primary" class="mt-2" type="submit" prepend-icon="mdi-plus" block>Create Room</v-btn>
			</v-form>

		</v-sheet>
	</v-container>
</template>

<script>

import { useRouter } from 'vue';

import { noUndefinedValue, noNegativeValue } from './../forms/rules.js';

import { socket } from './../modules/ws.js';
import { wsErrorHandler } from './../modules/wsErrorHandler.js';

export default {
	data: () => ({
		roomName: '',
		roundNumber: 10,

		formRules: {
			roomName: [noUndefinedValue],
			roomNumber: [noUndefinedValue, noNegativeValue],
		},
	}),

	mounted() {
		socket.on('createdRoom', data => { this.onCreateRoom(data); });
	},

	methods: {

		async handleOnSubmit() {

			const router = useRouter();

			const { valid } = await this.$refs.form.validate();

			if (!valid) {
				return;
			}

			const data = await socket.emit('room/create', {
				roomName: this.roomName,
				settings: {
					roundNumber: this.roundNumber
				}
			});

			const error = wsErrorHandler(data);
            if (error) {
                return;
            }

			const { room } = data;

			router.push({ name: 'Lobby', params: { roomId: room.id } });
		},

		onCreateRoom(data) {

			const error = wsErrorHandler(data);

			if (error) {
				return;
			}

			const { room } = data;

			this.$router.push({ name: 'Lobby', params: { roomName: room.id } });
		}
	}
}
</script>

<style lang="scss" scoped>
.v-container {
	height: 100vh;
}
</style>