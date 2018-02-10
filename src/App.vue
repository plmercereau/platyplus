<template lang="pug">
  v-app(id="app" dark)
    app-navigation
    app-tool-bar(:title="$store.state.title")
    v-content
      v-container(fluid style="min-height: 0;" grid-list-lg)
        transition(name="fade" mode="out-in")
          keep-alive
            router-view
    v-footer(app fixed)
      span &copy; 2018
</template>

<script>
  import AppNavigation from './components/AppNavigation'
  import AppToolBar from './components/AppToolBar'
  export default {
    name: 'app',
    components: {
      AppToolBar,
      AppNavigation
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
