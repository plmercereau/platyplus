<template>
  <v-container>
    Some serverErrors occurred in loading the page:
    <ul>
      <li v-for="error in errors">
        {{error}}
      </li>
    </ul>
    <!--<v-btn @click="refetch">Try again</v-btn>-->
  </v-container>
</template>

<script>
    export default {
      name: 'serverErrors-page',
      props: {
        errors: Array
      }
      // methods: { // TODO implement
      //   refetch () {
      //     this.$parent.refetch('module') // How do I call a parent method?
      //   }
      // }
    }
</script>

<style scoped>

</style>
