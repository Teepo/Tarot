<template>
    <v-container fill-height class="d-flex align-center justify-center">
      <v-sheet width="300" elevation="2">
        <v-form @submit.prevent="onSubmitLoginForm" ref="form">
          <v-text-field
            v-model="login"
            :rules="rules"
            label="Nickname"
          ></v-text-field>
          <v-btn class="mt-2" type="submit" block>Sign in</v-btn>
        </v-form>
      </v-sheet>
    </v-container>
  </template>
  
  <script>
    
  import { socket } from '@/modules/ws.js';
  import { wsErrorHandler } from '@/modules/wsErrorHandler.js';
  
  export default {
      data: () => ({
        login: '',
        rules: [
          value => {
            if (value) return true
            return 'You must enter a nickname.'
          },
        ],
      }),
  
      mounted() {
  
        socket.on('joinedRoom', data => { this.onJoinedRoom(data); });
      },
  
      methods: {
  
        onSubmitLoginForm() {
  
          if (!this.$refs.form.validate()) {
            return;
          }
  
          socket.emit('joinRoom', {
            login : this.login
          });
        },
  
        onJoinedRoom(data) {
  
          const { socketId } = data;
  
          const error = wsErrorHandler(data);
  
          if (error) {
              return;
          }
  
          const { player } = data;
  
          sessionStorage.setItem('id', player.id);
          sessionStorage.setItem('room', ROOM_NAME);
  
          this.$router.push('/lobby');
  
          // @TODO
          // Go to lobby
        }
      }
    }
  </script>
  
  <style lang="scss" scoped>
  .v-container {
    height: 100vh;
  }
  </style>