<template lang="pug">
  v-toolbar(app fixed clipped-left)
    v-toolbar-side-icon(@click.stop="$store.commit('toggleDrawer')")
    v-toolbar-title Application name
    v-spacer
    div {{me.username}}
    div(v-if="$store.state.graphqlModule.onlineServer") Server is online
    div(v-if="!$store.state.graphqlModule.onlineServer") Server is offline
    v-btn(icon)
      v-icon search
    v-btn(icon)
      v-icon apps
    v-btn(icon)
      v-icon refresh
    v-btn(icon)
      v-icon more_vert
</template>

<script>
  import gql from 'graphql-tag'
  export default {
    name: 'AppToolBar',
    data () {
      return {
        me: []
      }
    },
    apollo: {
      me: {
        query: gql`query {
          me {
            id
            username
          }
        }`,
        skip () {
          return !this.$root.$data
        }
      }
    }
  }
</script>
