<template>
  <v-container fill-height class="align-center justify-center">

      <RouterLink to="/oneplayer">
        <v-btn color="primary" class="mt-2" type="submit" block>One Player</v-btn>
      </RouterLink>

      <RouterLink to="/multiplayer">
        <v-btn color="primary" class="mt-2" type="submit" block>Multiplayer</v-btn>
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