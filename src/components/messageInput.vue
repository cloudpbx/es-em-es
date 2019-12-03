<template>
  <v-container grey lighten-2 style="display:inline-flex; align-items:center; width:70%;">
    <v-form @submit.prevent="msg">
      <v-textarea
        v-model="message"
        filled
        outlined
        background-color="white"
        rows="2"
        row-height="20"
      ></v-textarea>
      <v-btn medium color="primary" type="submit">SEND</v-btn>
    </v-form>
  </v-container>
</template>

<script>
/* eslint-disable */

export default {
  data() {
    return {
      message: null
    };
  },
  methods: {
    msg() {
      console.log(this.message);
    }
  }
};
</script>
