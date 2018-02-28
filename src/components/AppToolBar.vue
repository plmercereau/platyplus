<template lang="pug">
  v-toolbar(app fixed clipped-left)
    v-toolbar-side-icon(@click.stop="toggleDrawer()")
    v-toolbar-title PlatyPlus
    v-spacer
    div(v-if="user.id") {{user.username}}
    div(v-if="$store.state.graphqlModule.onlineServer") Online
    div(v-if="!$store.state.graphqlModule.onlineServer") Offline
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
  import * as types from '../store/mutation-types'

  export default {
    name: 'AppToolBar',
    methods: {
      toggleDrawer () {
        this.$store.commit(types.TOGGLE_DRAWER)
      }
    }
  }
</script>
