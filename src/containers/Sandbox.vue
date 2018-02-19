<template lang="pug">
  div
    h1 Sandbox
    div {{ $can('update', {type:'module', username:'pilou'}) }}
</template>

<script>
  import {TYPE_INTROSPECTION} from '../constants/graphql'
  export default {
    name: 'sandbox',
    data () {
      return {
        bidip: []
      }
    },
    apollo: {
      // Simple query that will update the 'hello' vue property
      bidip: {
        query: TYPE_INTROSPECTION,
        variables: {
          name: 'ModuleNode'
        },
        update (data) {
          return data.__type
        }
      }
    }
  }
</script>

<style scoped>

</style>
