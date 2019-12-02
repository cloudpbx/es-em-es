<template>
  <v-container>
    <v-container class="grey lighten-5">
      <v-timeline
      :align-top="alignTop"
      :dense="dense"
      :reverse="reverse"
    >
      <v-timeline-item
        v-for="message in history"
        :key="message.sms_id"
        :fill-dot="fillDot"
        :hide-dot="hideDot"
        :icon="icon ? 'mdi-star' : ''"
        :icon-color=" iconColor ? 'deep-orange' : ''"
        :left="message.direction==='inbound'"
        :right="message.direction==='outbound'"
        :small="small"
      >
        <template v-slot:icon>
          <v-avatar v-if="avatar">
            <img src="http://i.pravatar.cc/64">
          </v-avatar>
        </template>
        <!--<span slot="opposite">Tus eu perfecto</span>-->
        <v-card class="elevation-2">
          <v-card-title class="headline">{{ message.time }}</v-card-title>
          <v-card-text>
            {{ message.body }}
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>

    </v-container>
  </v-container>
</template>

<script>
/* eslint-disable */

export default {
  props: ['history'],
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
