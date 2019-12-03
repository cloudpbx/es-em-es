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
          <v-list-item-content
            v-if="data[n][data[n].length-1]['direction'] === 'outbound'"
            text-center
          >You: {{data[n][data[n].length -1]["body"]}}</v-list-item-content>
          <v-list-item-content v-else text-center>{{data[n][data[n].length -1]["body"]}}</v-list-item-content>
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
  mounted() {}
};
</script>
