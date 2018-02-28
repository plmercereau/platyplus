<template lang="pug">
  v-navigation-drawer(clipped fixed v-model="$store.state.drawer" app)
    v-list(dense)
      v-list-tile(v-if="$can('login','auth')", to="/login")
        v-list-tile-action
          v-icon input
        v-list-tile-content
          v-list-tile-title Login
      v-divider
      v-list-tile(v-if="$can('logout','auth')", v-on:click="logout()")
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
      v-list-tile(v-if="$can('route','module')", to="/modules")
        v-list-tile-action
          v-icon contact_mail
        v-list-tile-content
          v-list-tile-title Modules
      v-divider
      v-list-tile(v-if="$can('route','sync-queue')",to="/sync-queue")
        v-list-tile-action
          v-icon sync
        v-list-tile-content
          v-list-tile-title Synchronisation queue
      v-list-tile(v-if="$can('route','sandbox')",to="/sandbox")
        v-list-tile-action
          v-icon play_for_work
        v-list-tile-content
          v-list-tile-title Sandbox
</template>

<script>
  export default {
    name: 'AppNavigation'
  }
</script>
