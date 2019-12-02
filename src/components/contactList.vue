<template>
  <v-card height="100%" width="300">
    <v-list v-for="n in (Object.keys(data))" :key="n">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title text-center class="title">{{n}}</v-list-item-title>
          <v-list-item-content text-center>{{n[0]}}</v-list-item-content>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
    </v-list>
  </v-card>
</template>

<script>
/* eslint-disable */
import { mockdata } from "./recieve";
export default {
  data() {
    return {
      data: mockdata,
      numberdata: []
    };
  },
  methods: {
    test() {
      console.log(this.text);
    }
  }
};
</script>
