<template>
  <v-navigation-drawer
    clipped
    fixed
    v-model="$store.state.drawer"
    app
  >
    <v-list dense>
      <v-list-tile to="/home">
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            Home
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-list-tile to="/modules">
        <v-list-tile-action>
          <v-icon>contact_mail</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            Modules
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile to="/top">
        <v-list-tile-action>
          <v-icon>contact_mail</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            Other (top)
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants/settings'
  export default {
    name: 'AppNavigation',
    computed: {
      userId () {
        return this.$root.$data.userId
      }
    },
    methods: {
      logout () {
        localStorage.removeItem(GC_USER_ID)
        localStorage.removeItem(GC_AUTH_TOKEN)
        this.$root.$data.userId = localStorage.getItem(GC_USER_ID)
      }
    }
  }
</script>
