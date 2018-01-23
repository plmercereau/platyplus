<template>
  <v-app id="app" dark>
      <app-navigation></app-navigation>
      <app-tool-bar :title="$store.state.title"></app-tool-bar>
      <v-content>
        <v-container fluid
                     style="min-height: 0;"
                     grid-list-lg>
          <transition name="fade">
            <router-view></router-view>
          </transition>
        </v-container>
      </v-content>
      <v-footer app fixed>
        <span>&copy; 2018</span>
      </v-footer>
    </v-app>
</template>

<script>
  import AppHeader from './components/AppHeader'
  import AppNavigation from './components/AppNavigation'
  import AppToolBar from './components/AppToolBar'
  export default {
    name: 'app',
    components: {
      AppToolBar,
      AppNavigation,
      AppHeader
    },
    metaInfo () {
      return {
        title: this.$route.meta.title,
        titleTemplate: '%s | My Awesome Webapp'
      }
    }
  }
</script>
<style>
  .fade-enter-active, .fade-leave-active {
    transition-property: opacity;
    transition-duration: .10s;
  }

  .fade-enter-active {
    transition-delay: .10s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

</style>
