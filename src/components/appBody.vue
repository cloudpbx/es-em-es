<template >
  <div style="width:100%; height:100%">
    <selectedUser
      :v-show="selected"
      :number="selectedNumber"
      style="position:absolute; left:0px; top:5px;"
    />
    <v-container class="grey lighten-5">
      <messageWindow :history="selectedPhoneHistory" style="position:absolute; left:0; top:100px;" />
      <messageInput style="position:absolute; left:0; bottom:0;"/>
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
      selected: false
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
  }
};
</script>
