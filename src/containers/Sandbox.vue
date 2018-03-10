<template lang="pug">
  div
    h1 Sandbox
    div {{ $can('update', {type:'module', username:'pilou'}) }}
    div {{localForageKeys}}
    v-data-table(:items="cache", hide-actions)
      template(slot="headers", slot-scope="props")
        tr
          th bidon
          th Type Name
          th ID
      template(slot="no-data")
        i Cache is empty
      template(slot="items", slot-scope="props")
        td {{props.item.name}}
        td {{props.item.data.__typename}}
        td {{props.item.data.id}}

</template>

<script>
  import {TYPE_INTROSPECTION} from '../config'
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
      localForageKeys () {
        return localforage.keys()
      },
      apolloCachePersist () {
        return localforage.getItem('apollo-cache-persist')
      }
    },
    mounted () {
      localforage.getItem('apollo-cache-persist').then((cache) => {
        let json = JSON.parse(cache)
        console.log(json)
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
