<template>
  <v-container fill-height class="d-flex align-center justify-center">
    <v-sheet width="300" elevation="2">
      
      <v-form @submit.prevent="handleOnSubmit" ref="form">
        
        <v-text-field
          label="Room name"
          v-model="roomName"
          :rules="formRules.roomName"
        />

        <v-number-input
          label="Round"
          v-model="roundNumber"
          :min="1"
          :rules="formRules.roomNumber"
        />

        <v-btn color="primary" class="mt-2" type="submit" prepend-icon="mdi-plus" block>Create Room</v-btn>
      </v-form>
    
    </v-sheet>
  </v-container>
</template>
  
<script>

import { noUndefinedValue, noNegativeValue } from './../forms/rules.js';

import { socket } from './../modules/ws.js';
import { wsErrorHandler } from './../modules/wsErrorHandler.js';

export default {
    data: () => ({
      roomName: '',
      roundNumber : 10,

      formRules: {
        roomName   : [noUndefinedValue],
        roomNumber : [noUndefinedValue, noNegativeValue],
      },
    }),

    mounted() {
      socket.on('createdRoom', data => { this.onCreateRoom(data); });
    },

    methods: {

      async handleOnSubmit() {

        const { valid } = await this.$refs.form.validate();

        if (!valid) {
          return;
        }

        socket.emit('createRoom', {
          name : this.roomName,
          settings : {
            roundNumber : this.roundNumber
          }
        });
      },

      onCreateRoom(data) {

        const error = wsErrorHandler(data);

        if (error) {
            return;
        }

        const { room } = data;

        this.$router.push(`/lobby/${room.id}`);
      }
    }
  }
</script>
  
<style lang="scss" scoped>
.v-container {
  height: 100vh;
}
</style>