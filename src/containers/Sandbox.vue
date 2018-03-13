<template lang="pug">
  div
    h1 Sandbox
    div Can update module with username pilou: {{ $can('update', {type:'module', username:'pilou'}) }}
    div Cache size: {{cacheSize}}
</template>

<script>
  import {TYPE_INTROSPECTION} from '../config/queries'
  import localforage from 'localforage'
  export default {
    name: 'sandbox',
    data () {
      return {
        bidip: [],
        cache: []
      }
    },
    asyncComputed: {
      cacheSize () {
        return localforage.getItem('apollo-cache-persist').then((cache) => {
          return Buffer.byteLength(cache, 'utf8')
        })
      }
    },
    mounted () {
      localforage.getItem('apollo-cache-persist').then((cache) => {
        let json = JSON.parse(cache)
        this.cache = Object.keys(json).map((k) => ({name: k, data: json[k]}))
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
