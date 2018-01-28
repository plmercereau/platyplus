<template>
  <v-container>
    Some serverErrors occurred in loading the page.
    <v-btn @click="refetch">Try again</v-btn>
  </v-container>
</template>

<script>
    export default {
      name: 'serverErrors-page',
      methods: {
        refetch () {
          this.$parent.refetchAll() // INFO check is the use of this.$parent is recommended
        }
      }
    }
</script>

<style scoped>

</style>
