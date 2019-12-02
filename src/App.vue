<template>
  <v-app>
    <v-app-bar
      app
      elevation="1"
      color="white"
      style="height:75px; border-bottom: 1px gray solid"
    >
      <div class="d-flex align-center title">
        <b>CORVUM</b>
      </div>

      <v-spacer></v-spacer>

      <v-btn color="gray">
        <v-icon>mdi-open-in-new</v-icon>
        <span class="mr-2">Name</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <navBar />
      <appBody style="position:absolute; left:256px; top:10px;" />
    </v-content>
  </v-app>
</template>

<script>
import appBody from "./components/appBody";
import navBar from "./components/navbar";

export default {
  name: "App",

  components: {
    appBody,
    navBar
  },

  data() {
    return {};
  }
};
</script>
