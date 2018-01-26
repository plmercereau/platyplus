<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <v-progress-circular indeterminate color="primary" v-bind:size="32"></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'loading-page'
  }
</script>

<style scoped>
</style>
