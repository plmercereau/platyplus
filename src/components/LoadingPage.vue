<template lang="pug">
  v-container(grid-list-md, text-xs-center)
    v-layout(row wrap)
      v-flex(xs12)
        v-progress-circular(indeterminate, color="primary", v-bind:size="32")
</template>

<script>
  export default {
    name: 'loading-page'
  }
</script>

<style scoped>
</style>
