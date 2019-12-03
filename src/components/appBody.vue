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
    connect: () => {
      console.log("socket connected");
    },
    loadMessages: (messages) => {
      // TODO load messages into UI data store
    },
    receiveMessage: (data) => {
      // console.log("New message recieved" + JSON.stringify(data));
      console.log(`From | ${JSON.stringify(data.payload.from)}`);
      console.log(`To | ${JSON.stringify(data.payload.to[0])}`);
      console.log(`Sent At | ${JSON.stringify(data.payload.sent_at)}`);
      console.log(`Received At | ${JSON.stringify(data.payload.received_at)}`);
      console.log(`Message | ${JSON.stringify(data.payload.text)}`);
    },
    sentMessage: (message) => {
      // TODO load sent message into UI data store
    }
  },
  methods: {
    test() {
      this.$socket.emit("sendMessage", {
        message: this.message,
        number: this.number
      });
    }
  }
};
</script>
