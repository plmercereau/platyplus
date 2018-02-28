<template lang="pug">
  div
    h1 Synchronisation queue
    v-data-table(:headers="headers", :items="mutationsQueue", hide-actions)
      template(slot="no-data")
        div Nothing to synchronise
      template(slot="items", slot-scope="props")
        td {{props.item.itemName}}
        td {{props.item.attempts}}
        td {{props.item.lastAttempt | moment("DD/MM/YYYY, hh:mm:ss")}}
        td {{props.item.formData}}
</template>

<script>
  export default {
    name: 'sync-queue',
    data () {
      return {
        headers: [
          {
            text: 'Item type',
            align: 'left',
            sortable: true,
            value: 'itemType'
          },
          {
            text: 'Attempts',
            sortable: true,
            value: 'attempts'
          },
          {
            text: 'Last attempt',
            sortable: true,
            value: 'last-attempt'
          },
          { text: 'Form data',
            value: 'formData',
            sortable: false
          }
        ]
      }
    },
    computed: {
      mutationsQueue () {
        return this.$store.state.graphqlModule.mutationsQueue
      }
    }
  }
</script>

<style scoped>

</style>
