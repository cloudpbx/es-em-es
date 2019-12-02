<template>
  <v-container>
    <v-container class="grey lighten-5">
      <v-form @submit.prevent="test">
        <v-text-field label="number" v-model="number"></v-text-field>
        <v-text-field label="message" v-model="message"></v-text-field>

        <v-btn color="gray" type="submit">Send</v-btn>
      </v-form>
    </v-container>
  </v-container>
</template>

<script>
/* eslint-disable */
import { sendMessage } from "./body";
export default {
  data() {
    return {
      message: null,
      number: null
    };
  },
  methods: {
    test() {
      sendMessage(this.number, this.message);
    }
  }
};
</script>
