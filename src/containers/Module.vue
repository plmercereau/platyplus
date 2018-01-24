<template>
  <div>
    <v-breadcrumbs large>
      <v-icon slot="divider">chevron_right</v-icon>
      <v-breadcrumbs-item to="/modules">
        Modules
      </v-breadcrumbs-item>
      <v-breadcrumbs-item>
        {{itemData.name || 'New'}}
      </v-breadcrumbs-item>
    </v-breadcrumbs>
    <v-btn v-if="!edit" @click="edit=!edit">Edit</v-btn>
    <v-btn v-if="edit" @click="upsert">Save</v-btn>
    <v-btn v-if="edit" @click="reset">reset</v-btn>
    <v-btn v-if="edit" @click="cancel">Cancel</v-btn>
    <v-tabs v-model="$store.state.moduleTab">
      <v-tabs-bar>
<!--TODO hide v-if="!create" Stages when module being created-->
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
        <v-tabs-content key="General" id="General" @click.stop="$store.commit('setModuleTab', 'General')">
          <v-card>
            <v-card-text>
              <p v-if="!edit">
                <i>{{itemData.shortDescription}}</i>
              </p>
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
            </v-card-text>
          </v-card>
        </v-tabs-content>
        <v-tabs-content v-if="!create" key="Stages" id="Stages" @click.stop="$store.commit('setModuleTab', 'Stages')">
          <v-card>
            <v-card-text>
              <v-list subheader>
                <v-list-tile v-for="stage in itemData.stages.edges"
                             v-bind:key="stage.node.id"
                             @click=""
                             :to="'/modules/' + itemData.id + '/stages/' + stage.node.id">
                  <v-list-tile-content>
                    <v-list-tile-title>{{stage.node.name}}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-icon>chevron_right</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile
                             :to="'/modules/' + itemData.id + '/stages/create'">
                  <v-list-tile-content>
                    <v-list-tile-title><i>Add new stage</i></v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-icon>add</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-tabs-content>
        <v-tabs-content key="Deployments" id="Deployments" @click.stop="$store.commit('setModuleTab', 'Deployments')">
          <v-card>
            <v-card-text>
              List of org units where it is possible to use the module. One org Unit per line<br/>
              One icon to tell the module is available in all child org units (then the children should'nt appear in the list).<br/>
              One icon (check?) to tell the module is deployed<br/>
              Actions: deploy/undeploy/remove access<br/>
              <v-list>
                <v-list-tile @click="">
                  <v-list-tile-content>
                    <v-list-tile-title>Some place</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-icon>chevron_right</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile @click="">
                  <v-list-tile-content>
                    <v-list-tile-title><i>Add an Org Unit to the access list</i></v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-icon>add</v-icon>
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
  import {ALL_MODULES_QUERY, SINGLE_MODULE_QUERY, UPSERT_MODULE_MUTATION} from '../constants/graphql'
  import {formMixin, singleQuery, moduleData} from '../mixins/form'
  import EditToolBar from '../components/EditToolBar'

  export default {
    components: {EditToolBar},
    name: 'Module',
    mixins: [formMixin],
    data () {
      return {
        itemData: moduleData,
        tabs: ['General', 'Stages', 'Deployments']
      }
    },
    methods: {
      upsert () {
        this._upsert(UPSERT_MODULE_MUTATION, ALL_MODULES_QUERY)
      }
    },
    apollo: {
      itemData: singleQuery(SINGLE_MODULE_QUERY)
    }
  }
</script>
