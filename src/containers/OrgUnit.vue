<template lang="pug">
  div
    loading-page(v-if="status === 'loading'")
    errors-page(v-if="status === 'error'")
    v-container(v-if="status === 'ok'" grid-list-md)
      v-breadcrumbs(large)
        v-icon(slot="divider") chevron_right
        v-breadcrumbs-item(to="/org-units", exact) Org Units
        v-breadcrumbs-item(v-if="orgUnit.id && orgUnit.ancestors", v-for="ancestor in orgUnit.ancestors.edges", :to="'/org-units/' + ancestor.node.id") {{ancestor.node.name}}
        v-breadcrumbs-item(v-if="orgUnit.id", :to="'/org-units/' + orgUnit.id") {{orgUnit.name}}
      v-btn(v-if="$can('create', 'orgUnit')", to="/org-units/create") New root organisational unit
      v-btn(v-if="!edit && $can('edit', orgUnit)", @click="edit=!edit") Edit
      v-btn(v-if="edit && $can('edit', orgUnit)", @click="upsertForm") Save
      v-btn(v-if="edit && $can('edit', orgUnit)", @click="reset") Reset
      v-btn(v-if="edit && $can('edit', orgUnit)", @click="cancel") Cancel
      v-tabs(v-model="currentTab")
        v-tab(v-for="tab in tabs", :key="tab", :href="'#' + tab", ripple) {{ tab }}
        v-tab-item(key="General" id="General")
          p {{orgUnit.name}}
        v-tab-item(key="Children" id="Children")
          v-list
            template(v-for="(curs, index) in children")
              v-list-tile(:to="'/org-units/' + curs.node.id", @click="")
                v-list-tile-content {{curs.node.name}}
        v-tab-item(key="Members" id="Members")
        v-tab-item(key="Deployments" id="Deployments")


</template>

<script>
  import {dataItemMixin} from '../mixins/dataItem'
  import {itemManager} from '../utils/graphql'
  import LoadingPage from '../components/LoadingPage'
  import ErrorsPage from '../components/ErrorsPage'
  import {DATA_ITEMS_CONFIG} from '../config'

  const orgUnitConfig = DATA_ITEMS_CONFIG.orgUnit

  export default {
    name: 'orgUnit',
    mixins: [dataItemMixin],
    components: {LoadingPage, ErrorsPage},
    data () {
      return {
        tabs: ['General', 'Children', 'Members', 'Deployments'],
        currentTab: 'Children',
        orgUnit: {},
        rootOrgUnits: []
      }
    },
    computed: {
      children () {
        return this.orgUnit.id ? this.orgUnit.children.edges : this.rootOrgUnits.edges
      }
    },
    apollo: {
      rootOrgUnits: {
        query: orgUnitConfig.collectionQuery
      },
      orgUnit: itemManager(orgUnitConfig)
    }
  }
</script>

<style>

</style>
