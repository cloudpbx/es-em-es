<template >
  <div style="width:100%; height:100%">
    <v-container class="grey lighten-5">
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

import contactList from "./contactList";

export default {
  name: "appBody",
  components: {
    contactList
  },

  data() {
    return {
      text: null
    };
  },
  methods: {
    test() {
      console.log(this.text);
    }
  }
};
</script>
