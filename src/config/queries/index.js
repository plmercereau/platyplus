import gql from 'graphql-tag'
import * as moduleQueries from './module'
import * as stageQueries from './stage'
import * as orgUnitQueries from './orgUnit'

export * from './module'
export * from './stage'
export * from './user'
export * from './orgUnit'

export const TYPE_INTROSPECTION = gql`
  query TypeInstrospection($name: String!){
    __type(name: $name) {
      fields {
        name
        type {
          name
          kind
          interfaces {
            name
          }
        }
      }
    }
  }`

export const DATA_ITEMS_CONFIG = {
  orgUnit: {
    itemName: 'orgUnit',
    singleQuery: orgUnitQueries.SINGLE_ORG_UNIT_QUERY,
    upsertMutation: null, // TODO
    collectionQuery: orgUnitQueries.ROOT_ORG_UNITS_QUERY // TODO
  },
  module: {
    itemName: 'module',
    singleQuery: moduleQueries.SINGLE_MODULE_QUERY,
    upsertMutation: moduleQueries.UPSERT_MODULE_MUTATION,
    collectionQuery: moduleQueries.ALL_MODULES_QUERY
  },
  stage: {
    itemName: 'stage',
    singleQuery: stageQueries.SINGLE_STAGE_QUERY,
    upsertMutation: stageQueries.UPSERT_STAGE_MUTATION,
    formDataName: 'stage', // default value
    formRefName: 'stageForm' // default value
  }

}
