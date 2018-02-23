<template>
  <v-flex xs12>
    <v-card>
      <!--<v-card-media src="/static/img/icons/apple-touch-icon.png" height="200px">-->
      <!--</v-card-media>-->
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">{{module.name}}</h3>
          <i>{{module.shortDescription}}</i>
        </div>
      </v-card-title>
      <v-card-actions>
        <v-btn v-if="$can('read',module)" flat color="orange" :to="'/modules/' + module.id">Explore</v-btn>
        <v-btn flat color="orange">Deploy</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
  export default {
    name: 'ModuleItem',
    props: ['module']
  }
</script>

<style scoped>
</style>
