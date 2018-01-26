<template>
  <div>
    <v-container v-if="loading" grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <v-progress-circular indeterminate color="primary" v-bind:size="32"></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container grid-list-md v-if="!loading" transition="fade">
      <v-breadcrumbs large>
        <v-icon slot="divider">chevron_right</v-icon>
        <v-breadcrumbs-item to="/modules">
          Modules
        </v-breadcrumbs-item>
        <v-breadcrumbs-item :to="'/modules/' + module.id">
          {{module.name}}
        </v-breadcrumbs-item>
        <v-breadcrumbs-item>
          {{stage.name || 'New'}}
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-btn v-if="!edit" @click="edit=!edit">Edit</v-btn>
      <v-btn v-if="edit" @click="upsert()">Save</v-btn>
      <v-btn v-if="edit" @click="reset">reset</v-btn>
      <v-btn v-if="edit" @click="cancel">Cancel</v-btn>
      <v-tabs v-model="currentTab">
        <v-tabs-bar>
          <v-tabs-item
            v-for="tab in tabs"
            :key="tab"
            :href="'#' + tab"
            ripple
          >
            {{ tab }}
          </v-tabs-item>
          <v-tabs-slider></v-tabs-slider>
        </v-tabs-bar>
        <v-tabs-items>
          <v-tabs-content key="General" id="General">
            <v-card>
              <v-card-text>
                <v-form v-if="edit" ref="stageForm">
                  <v-text-field
                    label="Name"
                    v-model="formData.stage.name"
                    :counter="20"
                    data-vv-name="name"
                    required
                    v-validate="'required|min:3|max:20'"
                    :error-messages="errors.collect('name')"
                  ></v-text-field>
                  <v-text-field
                    label="Short description"
                    v-model="formData.stage.shortDescription"
                    :counter="280"
                    multi-line rows="2" auto-grow
                    data-vv-name="shortDescription"
                    data-vv-as="short description"
                    required
                    v-validate="'required|min:10|max:280'"
                    :error-messages="errors.collect('shortDescription')"
                  ></v-text-field>
                </v-form>
                <p v-if="!edit">
                  <i>{{stage.shortDescription}}</i>
                </p>
              </v-card-text>
            </v-card>
          </v-tabs-content>
          <v-tabs-content key="Next Stages" id="Next Stages">
            <v-card>
              <v-card-text>
                <v-list subheader>
                  <v-list-tile v-for="s in module.stages.edges"
                               v-bind:key="s.node.id"
                               @click="">
                    <v-list-tile-content>
                      <v-list-tile-title>{{s.node.name}}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-checkbox :disabled="!edit" v-model="formData.stage.nextStagesIds"
                                  :value="s.node.id"></v-checkbox>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider></v-divider>
                </v-list>
              </v-card-text>
            </v-card>
          </v-tabs-content>
          <v-tabs-content key="Observation Forms" id="Observation Forms">
            <v-card>
              <v-card-text>
                List of observation forms
                <v-list>
                  <v-list-tile @click="">
                    <v-list-tile-content>
                      <v-list-tile-title>Some observation</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-icon>chevron_right</v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider></v-divider>
                </v-list>
              </v-card-text>
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </v-container>
  </div>
</template>

<script>
  import {SINGLE_MODULE_QUERY, SINGLE_STAGE_QUERY, UPSERT_STAGE_MUTATION} from '../constants/graphql'
  import {dataItemMixin, itemManager} from '../mixins/dataItem'

  const stageConfig = {
    singleQuery: SINGLE_STAGE_QUERY,
    upsertMutation: UPSERT_STAGE_MUTATION,
    formDataName: 'stage', // default value
    formRefName: 'stageForm' // default value
  }
  const moduleConfig = {
    singleQuery: SINGLE_MODULE_QUERY
  }

  export default {
    name: 'stage',
    mixins: [dataItemMixin],
    data () {
      return {
        tabs: ['General', 'Next Stages', 'Observation Forms'], // TODO set the tab as a param sent through the router?
        currentTab: 'General'
      }
    },
    apollo: {
      ...itemManager(stageConfig),
      ...itemManager(moduleConfig)
    }
  }
</script>

<style scoped>

</style>
