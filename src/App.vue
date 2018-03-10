<template lang="pug">
  v-app(id="app" dark)
    app-navigation
    app-tool-bar(:title="$store.state.title")
    v-content
      v-container(fluid style="min-height: 0;" grid-list-lg)
        keep-alive
          router-view(:key="$route.fullPath", v-if="$route.meta.keepAlive")
        router-view(:key="$route.fullPath", v-if="!$route.meta.keepAlive")
    v-footer(app fixed)
      span &copy; 2018 -&nbsp;
      span Icons made by&nbsp;
        a(href="http://www.freepik.com" title="Freepik") Freepik
        |  from&nbsp;
        a(href="https://www.flaticon.com/" title="Flaticon") www.flaticon.com
        |  is licensed by&nbsp;
        a(href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank") CC 3.0 BY
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
