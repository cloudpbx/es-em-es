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
export default {
  data() {
    return {
      message: null,
      number: null
    };
  },
  sockets: {
    connect: function () {
        console.log('socket connected')
    },
    receiveMessage: function (data) {
        console.log('New message recieved' + data.hello)
    }
  },
  methods: {
    test() {
      this.$socket.emit('sendMessage', {message: this.message, number: this.number})
    }
  }
};
</script>
