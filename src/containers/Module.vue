<template lang="pug">
  div
    loading-page(v-if="status === 'loading'")
    errors-page(v-if="status === 'error'")
    v-container(v-if="status === 'ok'" grid-list-md)
      v-breadcrumbs(large)
        v-icon(slot="divider") chevron_right
        v-breadcrumbs-item(to="/modules", exact) Modules
        v-breadcrumbs-item {{module.name || 'New'}}
      v-btn(v-if="!edit && $can('edit', module)", @click="edit=!edit") Edit
      v-btn(v-if="edit && $can('edit', module)", @click="upsertForm") Save
      v-btn(v-if="edit && $can('edit', module)", @click="reset") Reset
      v-btn(v-if="edit && $can('edit', module)", @click="cancel") Cancel
      v-btn(v-if="$can('edit', module)", @click="refetchAll") Refetch all
      v-tabs(v-model="currentTab")
        v-tab(v-for="tab in tabs", :key="tab", :href="'#' + tab", ripple) {{ tab }}
        v-tab-item(key="General" id="General")
          v-card
            v-card-text
              p(v-if="!edit")
                i {{module.shortDescription}}
              v-form(v-if="edit" ref="moduleForm")
                v-text-field(label="Name", v-model="formData.module.name", :counter="20", data-vv-name="name", required, v-validate="'required|min:3|max:20'", :error-messages="errors.collect('name')")
                v-text-field(label="Short description", v-model="formData.module.shortDescription", :counter="280", multi-line rows="2",  auto-grow, data-vv-name="shortDescription", data-vv-as="short description", required, v-validate="'required|min:10|max:280'", :error-messages="errors.collect('shortDescription')")
              i TODO checkbox or action "make multi-stages". If in create mode, then radio button
        v-tab-item(v-if="!create", key="Stages", id="Stages")
          v-card
            v-card-text
              v-list(subheader)
                v-list-tile(v-for="stage in module.stages.edges", v-bind:key="stage.node.id", @click="", :to="'/modules/' + module.id + '/stages/' + stage.node.id")
                  v-list-tile-content
                    v-list-tile-title {{stage.node.name}}
                  v-list-tile-action
                    v-icon chevron_right
                v-divider
                v-list-tile(v-if="$can('create-child', module)", :to="'/modules/' + module.id + '/stages/create'")
                  v-list-tile-content
                    v-list-tile-title
                      i Add new stage
                  v-list-tile-action
                    v-icon add
        v-tab-item(key="Deployments", id="Deployments")
          v-card
            v-card-text
              |List of org units where it is possible to use the module. One org Unit per line
              br
              |One icon to tell the module is available in all child org units (then the children should'nt appear in the list)
              br
              |One icon (check?) to tell the module is deployed
              br
              |Actions: deploy/undeploy/remove access
              br
              i TODO: rename this tab into "Usages" of "Availability" or "Authorisations"
              v-list
                v-list-tile(@click="")
                  v-list-tile-content
                    v-list-tile-title Some place
                  v-list-tile-action
                    v-icon chevron_right
                v-divider
                v-list-tile(@click="")
                  v-list-tile-content
                    v-list-tile-title
                      i Add an Org Unit to the access list
                  v-list-tile-action
                    v-icon add
                v-divider
</template>

<script>
  import {dataItemMixin} from '../mixins/dataItem'
  import {itemManager} from '../utils/graphql'
  import LoadingPage from '../components/LoadingPage'
  import ErrorsPage from '../components/ErrorsPage'
  import {DATA_ITEMS_CONFIG} from '../config/queries'

  const moduleConfig = DATA_ITEMS_CONFIG.module

  export default {
    name: 'module',
    mixins: [dataItemMixin],
    components: {LoadingPage, ErrorsPage},
    data () {
      return {
        tabs: ['General', 'Global Data Elements', 'Stages', 'Customisations', 'Deployments'],
        currentTab: 'General',
        module: {}
      }
    },
    apollo: {
      module: itemManager(moduleConfig)
    }
  }
</script>

<style>

</style>
