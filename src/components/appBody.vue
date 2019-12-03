<template >
  <div style="width:100%; height:100%">
    <selectedUser
      :v-show="selected"
      :number="selectedNumber"
      style="position:absolute; left:0px; top:5px;"
    />
    <v-container class="grey lighten-5">
      <messageWindow :history="selectedPhoneHistory" style="position:absolute; left:0; top:100px;" />
      <messageInput style="position:absolute; left:0; bottom:0;" />
      <!-- <v-form @submit.prevent="test">
        <v-text-field label="number" v-model="number"></v-text-field>
        <v-text-field label="message" v-model="message"></v-text-field>

        <v-btn color="gray" type="submit">Send</v-btn>
      </v-form>-->
    </v-container>

    <contactList @selected="selectedConversation" style="position:absolute; right:250px; top:5px;" />
  </div>
</template>

<script>
/* eslint-disable */

import messageWindow from "./messageWindow";
import messageInput from "./messageInput";
import contactList from "./contactList";
import selectedUser from "./selectedUser";
import { mockdata } from "./recieve";

export default {
  components: {
    messageWindow,
    messageInput,
    contactList,
    selectedUser
  },

  data() {
    return {
      text: null,
      selectedNumber: "",
      selected: false,
      message: null,
      number: null
    };
  },
  computed: {
    selectedPhoneHistory: function() {
      this.selected = true;
      return mockdata[this.selectedNumber];
    }
  },
  methods: {
    selectedConversation(n) {
      this.selectedNumber = n;
    },
    test() {
      this.$socket.emit("sendMessage", {
        message: this.message,
        number: this.number
      });
    }
  },
  mounted() {
    // for key in dict, sort its value(list) by time ascending
    for (var key in mockdata) {
      mockdata[key].sort(function(a, b) {
        return parseFloat(a.time) - parseFloat(b.time);
      });
    }
    console.log();
  },
  sockets: {
    connect: () => {
      console.log("socket connected");
    },
    loadMessages: messages => {
      // TODO load messages into UI data store
    },
    receiveMessage: data => {
      // console.log("New message recieved" + JSON.stringify(data));
      console.log(`From | ${JSON.stringify(data.payload.from)}`);
      console.log(`To | ${JSON.stringify(data.payload.to[0])}`);
      console.log(`Sent At | ${JSON.stringify(data.payload.sent_at)}`);
      console.log(`Received At | ${JSON.stringify(data.payload.received_at)}`);
      console.log(`Message | ${JSON.stringify(data.payload.text)}`);
    },
    sentMessage: message => {
      // TODO load sent message into UI data store
    }
  }
};
</script>
