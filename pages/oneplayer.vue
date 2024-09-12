<template>
    <v-container fill-height class="d-flex align-center justify-center" v-if="!this.isChildRoute()">
      <v-sheet width="300" elevation="2">
        
        <v-form @submit.prevent="handleOnSubmit" ref="form">
  
          <v-number-input
            label="Round"
            v-model="roundNumber"
            :min="1"
            :rules="formRules.roomNumber"
          />
  
          <v-btn color="primary" class="mt-2" type="submit" prepend-icon="mdi-plus" block>Play</v-btn>
        </v-form>
      
      </v-sheet>
    </v-container>

    <router-view></router-view>
  </template>
    
  <script>
  
  import { noUndefinedValue, noNegativeValue } from '@/forms/rules.js';
    
  export default {
      data: () => ({
        roomName: '',
        roundNumber : 10,
  
        formRules: {
          roomNumber : [noUndefinedValue, noNegativeValue],
        },
      }),

      methods: {
  
        async handleOnSubmit() {
  
          const { valid } = await this.$refs.form.validate();
  
          if (!valid) {
            return;
          }

          this.$router.push({ name : 'OneplayerGame' });
        },

        isChildRoute() {
            return this.$route.matched.length > 1;
        },
      }
    }
  </script>
    
  <style lang="scss" scoped>
  .v-container {
    height: 100vh;
  }
  </style>