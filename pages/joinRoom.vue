<template>
	<v-container fill-height class="d-flex align-center justify-center">
		<v-sheet width="300" elevation="2">

			<v-form @submit.prevent="handleSubmit" ref="form">

				<v-text-field label="Login" v-model="login" :rules="formRules.login" />
				<v-text-field label="Room ID" v-model="roomId" :rules="formRules.roomId" />

				<v-btn color="primary" class="mt-2" type="submit" prepend-icon="mdi-plus" block>Join Room</v-btn>
			</v-form>

		</v-sheet>
	</v-container>
</template>

<script>

import { useRoute } from 'vue-router'

import { noUndefinedValue, noNegativeValue } from './../forms/rules.js';

import { socket } from './../modules/ws.js';
import { wsErrorHandler } from './../modules/wsErrorHandler.js';

import store from './../store';

export default {
	
	data: function() {

		const route = useRoute();

		return {
		
			login   : 'b',
			roomId : route.params.roomId ?? '',

			formRules: {
				login  : [noUndefinedValue],
				roomId : [noUndefinedValue],
			},
		};
	},

	methods: {

		async handleSubmit() {

			const { valid } = await this.$refs.form.validate();

			if (!valid) {
				return;
			}

			const { player, error } = await store.dispatch('room/join', {
				login  : this.login,
				roomId : this.roomId,
			});

			if (error) {
				return;
			}

			sessionStorage.setItem('playerId', player.id);
        	sessionStorage.setItem('roomId', this.roomId);

			this.$router.push({ name: 'Lobby', params: { roomId: this.roomId } });
		}
	}
}
</script>

<style lang="scss" scoped>
.v-container {
	height: 100vh;
}
</style>