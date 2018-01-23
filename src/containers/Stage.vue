<template>
<div>
  <v-breadcrumbs large>
    <v-icon slot="divider">chevron_right</v-icon>
    <v-breadcrumbs-item to="/modules">
      Modules
    </v-breadcrumbs-item>
    <v-breadcrumbs-item :to="'/modules/' + parent.id">
      {{parent.name}}
    </v-breadcrumbs-item>
    <v-breadcrumbs-item>
      {{itemData.name || 'New'}}
    </v-breadcrumbs-item>
  </v-breadcrumbs>
  <v-btn v-if="!edit" @click="edit=!edit">Edit</v-btn>
  <v-btn v-if="edit" @click="upsert">Save</v-btn>
  <v-btn v-if="edit" @click="reset">reset</v-btn>
  <v-btn v-if="edit" @click="cancel">Cancel</v-btn>

  <v-tabs v-model="$store.state.tabs.stage">
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
      <v-tabs-content key="General" id="General" @click.stop="$store.commit('setTab',{component:'stage',tab:'General'})">
        <v-card>
          <v-card-text>
            <v-form v-if="edit" ref="form">
              <v-text-field
                label="Name"
                v-model="form.name"
                :counter="20"
                data-vv-name="name"
                required
                v-validate="'required|min:3|max:20'"
                :error-messages="errors.collect('name')"
              ></v-text-field>
              <v-text-field
                label="Short description"
                v-model="form.shortDescription"
                :counter="280"
                multi-line rows="2" auto-grow
                data-vv-name="shortDescription"
                data-vv-as="short description"
                required
                v-validate="'required|min:10|max:280'"
                :error-messages="errors.collect('shortDescription')"
              ></v-text-field>
              <!--<v-btn :disabled="$validator.errors.any()" @click="upsert">Save</v-btn>-->
            </v-form>
            <p v-if="!edit">
              <i>{{itemData.shortDescription}}</i>
            </p>
          </v-card-text>
        </v-card>
      </v-tabs-content>
      <v-tabs-content key="Next Stages" id="Next Stages" @click.stop="$store.commit('setTab',{componemt:'stage',tab:'Next Stages'})">
        <v-card>
          <v-card-text>
            <v-list subheader>
              <v-list-tile v-for="s in parent.stages.edges"
                           v-bind:key="s.node.id"
                           @click="">
                <v-list-tile-content>
                  <v-list-tile-title>{{s.node.name}}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-checkbox :disabled="!edit" v-model="nextStagesIds" :value="s.node.id"></v-checkbox>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider></v-divider>
            </v-list>
          </v-card-text>
        </v-card>
      </v-tabs-content>
      <v-tabs-content key="Observation Forms" id="Observation Forms" @click.stop="$store.commit('setTab',{component:'stage',tab:'Observation Forms'})">
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
</div>
</template>

<script>
  import {SINGLE_MODULE_QUERY, UPSERT_STAGE_MUTATION} from '../constants/graphql'
  // import {UPSERT_STAGE_MUTATION} from '../constants/graphql'
  import {formMixin} from '../mixins/form'
  import {moduleData, singleModuleSingleStageQuery, stageData} from '../constants/apollo_queries'

  export default {
    name: 'stage',
    mixins: [formMixin],
    data () {
      return {
        parent: moduleData,
        itemData: stageData,
        nextStagesIds: [],
        form: {
        },
        tabs: ['General', 'Next Stages', 'Observation Forms']
      }
    },
    computed: {
      upsert_mutation () {
        return UPSERT_STAGE_MUTATION
      },
      single_item_query () {
        return SINGLE_MODULE_QUERY
      }
    },
    methods: {
      reset () {
        this.$super(formMixin).reset()
        this.nextStagesIds = this.create ? [] : this.itemData.nextStages.edges.map(el => { return el.node.id })
      },
      upsert () {
        this.form.nextStages = this.nextStagesIds
        this.form.moduleId = this.parent.id
        this._upsert(this._updateSingleItem)
      }
    },
    apollo: {
      parent: singleModuleSingleStageQuery
    }
  }
</script>

<style scoped>

</style>
