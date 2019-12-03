<template>
  <v-container style="width:65%; height:70%;" class="overflow-y-auto">
    <v-container
      class="d-flex"
      v-for="message in history"
      :key="message.sms_id"
    >
      <v-card
        class="mx-auto"
        max-width="700"
        style="margin-left:0px !important; width:400px; background:white;"
        v-if="message.direction==='inbound'"
      >
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">{{ message.time }}</v-list-item-title>
              <v-list-item-subtitle style="text-align:left; color:black;">{{ message.body }}</v-list-item-subtitle>
              <v-list-item-subtitle style="text-align:left; color:gray;">{{ message.time }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>

        <v-card
          class="mx-auto flex-row-reverse"
          max-width="700"
          style="margin-right:0px !important; width:400px; background:blue;"
          v-else
        >
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1" style="text-align:right; color:white;">{{ message.time }}</v-list-item-title>
              <v-list-item-subtitle style="text-align:right; color:white;">{{ message.body }}</v-list-item-subtitle>
              <v-list-item-subtitle style="text-align:right; color:white;">{{ message.time }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
/* eslint-disable */

export default {
  props: ['history'],
  data() {
    return {
      text: null,
      hideDot: true
    };
  },
  methods: {
    test() {
      console.log(this.text);
      this.text="";
    }
  }
};
</script>
