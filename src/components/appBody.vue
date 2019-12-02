<template >
  <div style="width:100%; height:100%">
    <v-container class="grey lighten-5">
      <messageWindow :history="selectedPhoneHistory" />

      <v-form @submit.prevent="test">
        <v-text-field v-model="text"></v-text-field>

        <v-btn color="gray" type="submit">Test</v-btn>
      </v-form>
    </v-container>

    <contactList style="position:absolute; right:250px; top:0;" />
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
      selectedPhoneHistory: mockdata["+15555555"]
    };
  },
  methods: {
    test() {
      console.log(this.text);
    }
  }
};
</script>
