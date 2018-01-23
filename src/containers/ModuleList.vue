<template>
  <v-layout row wrap>
      <module-item
        v-for="(module, index) in modules.edges"
        :key="module.node.id"
        :module="module.node"
        :index="index">
      </module-item>
  </v-layout>
</template>

<script>
  import { ALL_MODULES_QUERY } from '../constants/graphql'
  import ModuleItem from '../components/ModuleItem'
  export default {
    name: 'ModuleList',
    data () {
      return {
        modules: [],
        loading: 0
      }
    },
    computed: {
    },
    components: {
      ModuleItem
    },
    methods: {
    },
    apollo: {
      modules: {
        query: ALL_MODULES_QUERY,
        update (data) {
          // this.count = data._allLinksMeta.count
          return data.modules
        }
      }
    }
    // beforeMount () {
    //   this.$store.commit('setTitle', {title: 'Modules'})
    // }
  }
</script>
