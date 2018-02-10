<template lang="pug">
  v-navigation-drawer(clipped fixed v-model="$store.state.drawer" app)
    v-list(dense)
      v-list-tile(to="/login")
        v-list-tile-action
          v-icon input
        v-list-tile-content
          v-list-tile-title Login
      v-divider
      v-list-tile(to="/home")
        v-list-tile-action
          v-icon home
        v-list-tile-content
          v-list-tile-title Home
      v-divider
      v-list-tile(to="/modules")
        v-list-tile-action
          v-icon contact_mail
        v-list-tile-content
          v-list-tile-title Modules
      v-divider
      v-list-tile(to="/sandbox")
        v-list-tile-action
          v-icon play_for_work
        v-list-tile-content
          v-list-tile-title Sandbox
</template>

<script>
  import { USER_ID, AUTH_TOKEN } from '../constants/settings'
  export default {
    name: 'AppNavigation',
    computed: {
      userId () {
        return this.$root.$data.userId
      }
    },
    methods: {
      logout () {
        localStorage.removeItem(USER_ID)
        localStorage.removeItem(AUTH_TOKEN)
        this.$root.$data.userId = localStorage.getItem(USER_ID)
      }
    }
  }
</script>
