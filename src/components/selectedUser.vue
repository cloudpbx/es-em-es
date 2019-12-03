<template>
  <v-toolbar height="100" width="95%">
    <v-list-item-avatar>
      <v-img class="grey lighten-1 white--text"></v-img>
    </v-list-item-avatar>
    <v-toolbar-title>{{number}}</v-toolbar-title>
  </v-toolbar>
</template>

<script>
/* eslint-disable */
import { mockdata } from "./recieve";
export default {
  props: ["number"],

  data() {
    return {
      data: mockdata
    };
  },
  methods: {
    test() {}
  },
  computed: {},
  mounted() {}
};
</script>
