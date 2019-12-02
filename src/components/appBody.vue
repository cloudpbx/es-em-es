<template>
  <v-container>
    <v-container class="grey lighten-5">
      <v-form @submit.prevent="test"
        ><v-text-field v-model="text"></v-text-field>

        <v-btn color="gray" type="submit">Test</v-btn>
      </v-form>
    </v-container>
  </v-container>
</template>

<script>
/* eslint-disable */
import {sendMessage} from './body'
export default {
  data() {
    return {
      text: null
    };
  },
  methods: {
    test() {
      sendMessage('testing message');
    }
  }
};
</script>
