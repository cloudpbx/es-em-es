<template>
  <v-card height="100%" width="350">
    <v-list-item @click="test()" style="height:100px">
      <v-list-item-avatar>
        <v-img class="grey lighten-1 white--text"></v-img>
      </v-list-item-avatar>

      <v-list-item-title text-center class="title">New Message</v-list-item-title>
    </v-list-item>
    <v-divider></v-divider>

    <v-list v-for="n in (Object.keys(data))" :key="n">
      <v-list-item style="height:100px" @click="$emit('selected', n)">
        <v-list-item-avatar>
          <v-img class="grey lighten-1 white--text"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title text-center class="title">{{n}}</v-list-item-title>
          <v-list-item-content text-center>{{data[n][0]["body"]}}</v-list-item-content>
          <!-- <v-list-item-title text-center class="title">{{Object.keys(data)[n-1]}}</v-list-item-title>
          <v-list-item-content text-center>{{data[Object.keys(data)[n-1]]}}</v-list-item-content>-->
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
      console.log("asdasda");
    }
  },
  computed: {
    mostRecent: function() {
      return mockdata[this.selectedNumber];
    }
  },
  mounted() {
    console.log("mounted");

    // for key in dict, sort its value(list) by time descending
    for (var key in this.data) {
      this.data[key].sort(function(a, b) {
        return parseFloat(b.time) - parseFloat(a.time);
      });
    }
    console.log(this.data);
  }
};
</script>
