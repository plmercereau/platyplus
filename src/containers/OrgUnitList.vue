<template lang="pug">
  div
    v-btn(v-if="$can('create', 'module')", to="/modules/create") New module
    v-layout(row wrap)
      module-item(v-for="(module, index) in modules.edges", :key="module.node.id", :module="module.node", :index="index")
</template>

<script>
  import { ALL_MODULES_QUERY } from '../config'
  import ModuleItem from '../components/ModuleItem'
  export default {
    name: 'ModuleList',
    components: {
      ModuleItem
    },
    data () {
      return {
        modules: [],
        loading: 0
      }
    },
    apollo: {
      modules: {
        query: ALL_MODULES_QUERY,
        update (data) {
          return data.modules
        }
      }
    }
    // beforeMount () {
    //   this.$store.commit('setTitle', {title: 'Modules'})
    // }
  }
</script>
