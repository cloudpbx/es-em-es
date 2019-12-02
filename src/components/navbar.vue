<template>
<v-card
    height="100%"
    width="256"
    style="margin:0 !important"
  >
    <v-navigation-drawer permanent>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title text-center class="title">
            Application
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
        <v-list-item>
        <v-list-item-content>
          <v-list-item-title text-center class="title">
            Application
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>  <v-list-item>
        <v-list-item-content>
          <v-list-item-title text-center class="title">
            Application
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Photos', icon: 'mdi-image' },
        { title: 'About', icon: 'mdi-help-box' }
      ],
      right: null
    }
  }
}
</script>
