<template >
  <div style="width:100%; height:100%">
    <v-container class="grey lighten-5">
      <messageWindow :history="selectedPhoneHistory" />
    </v-container>

    <contactList @selected="selectedConversation" style="position:absolute; right:250px; top:5px;" />
  </div>
</template>

<script>
/* eslint-disable */

import messageWindow from "./messageWindow";
import contactList from "./contactList";
import { mockdata } from "./recieve";

export default {
  components: {
    messageWindow,
    contactList
  },

  data() {
    return {
      text: null,
      selectedNumber: ""
    };
  },
  computed: {
    selectedPhoneHistory: function() {
      return mockdata[this.selectedNumber];
    }
  },
  methods: {
    selectedConversation(n) {
      this.selectedNumber = n;
    }
  }
};
</script>
