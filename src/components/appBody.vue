<template >
  <div style="width:100%; height:100%">
    <selectedUser
      :v-show="selected"
      :number="selectedNumber"
      style="position:absolute; left:0px; top:5px;"
    />
    <v-container class="grey lighten-5">
      <messageWindow :history="selectedPhoneHistory" style="position:absolute; left:0; top:100px;" />
      <v-container grey lighten-2 style="position:absolute; left:0; bottom:0; display:inline-flex; align-items:center; width:70%;">
          <v-form
            @submit.prevent="test"
            style="width:50%;"
          >
              <v-text-field label="number" :disabled="this.selectedNumber.length > 0" v-model="number"></v-text-field>
              <v-textarea
                v-model="message"
                label="message"
                filled
                outlined
                background-color="white"
                rows="2"
                row-height="20"
              ></v-textarea>
              <v-btn medium color="primary" type="submit">SEND</v-btn>
          </v-form>
      </v-container>

    </v-container>

    <contactList @selected="selectedConversation" @nothingSelected="handleNothingSelected" style="position:absolute; right:250px; top:5px;" />
  </div>
</template>

<script>
/* eslint-disable */

import messageWindow from "./messageWindow";
import contactList from "./contactList";
import selectedUser from "./selectedUser";
import { mockdata } from "./recieve";

export default {
  components: {
    messageWindow,
    contactList,
    selectedUser
  },

  data() {
    return {
      text: null,
      selectedNumber: "",
      selected: false,
      message: null,
      number: ""
    };
  },
  computed: {
    selectedPhoneHistory: function() {
      this.selected = true;
      return mockdata[this.selectedNumber];
    }
  },
  methods: {
    handleNothingSelected() {
      this.selected = false;
      this.number = "";
      this.selectedNumber="";
    },
    selectedConversation(n) {
      this.selectedNumber = n;
      this.number = n;
    },
    test() {
      console.log(this.message+" "+this.number);
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
    this.$socket.emit("phoneNumber", {
        phoneNumber: "+17786542857",
      });
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
      console.log(message)
    },
    sentFinalized: message => {
      // TODO load sent message into UI data store
    },
    sendFailed: message => {
      console.log(message)
    }
  }
};
</script>
