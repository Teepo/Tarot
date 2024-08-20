<template>
    <v-container fill-height class="align-center justify-center">
        <RouterLink to="/join-room">
            <v-btn color="primary" class="mt-2" type="submit" prepend-icon="mdi-login" block>Join Room</v-btn>
        </RouterLink>

        <RouterLink to="/create-room">
            <v-btn color="primary" class="mt-2" type="submit" prepend-icon="mdi-plus" block>Create Room</v-btn>
        </RouterLink>
    </v-container>
  </template>
  
<script>
  
import { ROOM_NAME } from './../config/ws.js';

import { socket } from './../modules/ws.js';
import { wsErrorHandler } from './../modules/wsErrorHandler.js';

export default {
}
</script>
  
<style lang="scss" scoped>
.v-container {
    height: 100vh;
}
</style>