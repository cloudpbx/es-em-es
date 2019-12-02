<template>
  <v-container>
    <v-container class="grey lighten-5">
    <messageWindow :history="selectedPhoneHistory" />

      <v-form @submit.prevent="test"
        ><v-text-field v-model="text"></v-text-field>

        <v-btn color="gray" type="submit">Test</v-btn>
      </v-form>
    </v-container>
  </v-container>
</template>

<script>
/* eslint-disable */

import messageWindow from "./messageWindow";
import {mockdata} from "./recieve";

export default {
  components: {
    messageWindow
  },

  data() {
    return {
      text: null,
      selectedNumber: "+44444444",
    };
  },
  computed: {
    selectedPhoneHistory: function () {
      return mockdata[this.selectedNumber];
    }
  },
  methods: {
    test() {
      console.log(this.text);
    },
    }

};
</script>
