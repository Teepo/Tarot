<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
    import './scss/app.scss';
</script>

<style lang="scss">

body {
    padding: 0;
    margin: 0;

    width: 100vw;
    height: 100vh;
}

.v-application {
    background-image: radial-gradient(circle, #00a184, #019377, #02856a, #01775d, #006a51) !important;
    background-size: cover;
    box-shadow: inset 0 0 10px rgba(#000, .5), inset 0 0 20px rgba(#000, .3);
}

</style>