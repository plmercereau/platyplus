<template lang="pug">
  v-navigation-drawer(clipped fixed v-model="$store.state.drawer" app)
    v-list(dense)
      v-list-tile(v-if="!userId", to="/login")
        v-list-tile-action
          v-icon input
        v-list-tile-content
          v-list-tile-title Login
      v-divider
      v-list-tile(v-if="userId", v-on:click="logout()")
        v-list-tile-action
          v-icon exit_to_app
        v-list-tile-content
          v-list-tile-title Logout
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
    methods: {
      logout () { // TODO move to plugin/mixin
        localStorage.removeItem(USER_ID)
        localStorage.removeItem(AUTH_TOKEN)
        this.$root.$data.gqlUserId = localStorage.getItem(USER_ID)
        this.$apollo.getClient().resetStore() // TODO https://github.com/apollographql/apollo-client/issues/2774
        this.$router.push({path: '/'})
      }
    }
  }
</script>
