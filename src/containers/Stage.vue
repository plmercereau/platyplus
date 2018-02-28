<template lang="pug">
  div
    loading-page(v-if="status === 'loading'")
    errors-page(v-if="status === 'error'")
    v-container(v-if="status === 'ok'", grid-list-md)
      v-breadcrumbs(large)
        v-icon(slot="divider") chevron_right
        v-breadcrumbs-item(to="/modules") Modules
        v-breadcrumbs-item(:to="'/modules/' + module.id") {{module.name}}
        v-breadcrumbs-item {{stage.name || 'New'}}
      v-btn(v-if="!edit && $can('edit', stage)", @click="edit=!edit") Edit
      v-btn(v-if="edit && $can('edit', stage)", @click="upsertForm") Save
      v-btn(v-if="edit && $can('edit', stage)", @click="reset") Reset
      v-btn(v-if="edit && $can('edit', stage)", @click="cancel") Cancel
      v-tabs(v-model="currentTab")
        <!--TODO hide v-if="!create" Stages when module being created-->
        v-tab(v-for="tab in tabs", :key="tab", :href="'#' + tab", ripple) {{ tab }}
        v-tab-item(key="General", id="General")
          v-card
            v-card-text
              p(v-if="!edit")
                i {{stage.shortDescription}}
              v-form(v-if="edit" ref="stageForm")
                v-text-field(label="Name", v-model="formData.stage.name", :counter="20", data-vv-name="name", required, v-validate="'required|min:3|max:20'", :error-messages="errors.collect('name')")
                v-text-field(label="Short description", v-model="formData.stage.shortDescription", :counter="280", multi-line rows="2",  auto-grow, data-vv-name="shortDescription", data-vv-as="short description", required, v-validate="'required|min:10|max:280'", :error-messages="errors.collect('shortDescription')")
        v-tab-item(v-if="!create", key="Next Stages", id="Next Stages")
          v-card
            v-card-text
              v-list(subheader)
                v-list-tile(v-for="cursor in module.stages.edges", v-bind:key="cursor.node.id", @click="")
                  v-list-tile-content
                    v-list-tile-title {{cursor.node.name}}
                  v-list-tile-action
                    v-checkbox(:disabled="!edit", v-model="formData.stage.nextStagesIds", :value="cursor.node.id")
                v-divider
        v-tab-item(key="Observation Forms", id="Observation Forms")
          v-card
            v-card-text List of observation forms
              v-list
                v-list-tile(@click="")
                  v-list-tile-content
                    v-list-tile-title Some observation
                  v-list-tile-action
                    v-icon chevron_right
                v-divider
                v-list-tile(@click="")
                  v-list-tile-content
                    v-list-tile-title
                      i Add an observation form
                  v-list-tile-action
                    v-icon add
                v-divider
</template>

<script>
  import {dataItemMixin, itemManager} from '../mixins/dataItem'
  import LoadingPage from '../components/LoadingPage'
  import ErrorsPage from '../components/ErrorsPage'
  import {DATA_ITEMS_CONFIG} from '../constants/settings'

  export default {
    name: 'stage',
    mixins: [dataItemMixin],
    components: {LoadingPage, ErrorsPage},
    data () {
      return {
        tabs: ['General', 'Next Stages', 'Observation Forms'], // TODO set the tab as a param sent through the router?
        currentTab: 'General',
        stage: {},
        module: {}
      }
    },
    apollo: {
      stage: itemManager(DATA_ITEMS_CONFIG.stage),
      module: itemManager(DATA_ITEMS_CONFIG.module)
    }
  }
</script>

<style scoped>

</style>
