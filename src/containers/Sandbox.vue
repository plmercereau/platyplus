<template lang="pug">
  div
    h1 Sandbox
    div {{ $can('update', {type:'module', username:'pilou'}) }}
    div {{test}}
    div {{test.ownedBy}}
</template>

<script>
  import {TYPE_INTROSPECTION, DATA_ITEMS_CONFIG} from '../config'
  import {modelToObject} from '../utils/graphql'
  export default {
    name: 'sandbox',
    data () {
      return {
        bidip: [],
        test: {}
      }
    },
    mounted () {
      modelToObject(DATA_ITEMS_CONFIG.module).then(data => {
        console.log(data)
      })
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
