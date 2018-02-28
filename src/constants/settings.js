import * as graphql from './graphql'

export const USER_ID = 'userId'
export const AUTH_TOKEN = 'token'
export const LINKS_PER_PAGE = 5
export const REFETCH_INTERVAL = 1000
export const REFETCH_ATTEMPS = 2 // -1 = infinite
export const QUEUE_SCHEDULE = 5000 // interval in ms between two checks of queues to load from/to the server

export const DATA_ITEMS_CONFIG = {
  module: {
    itemName: 'module',
    singleQuery: graphql.SINGLE_MODULE_QUERY,
    upsertMutation: graphql.UPSERT_MODULE_MUTATION,
    collectionQuery: graphql.ALL_MODULES_QUERY
  },
  stage: {
    itemName: 'stage',
    singleQuery: graphql.SINGLE_STAGE_QUERY,
    upsertMutation: graphql.UPSERT_STAGE_MUTATION,
    formDataName: 'stage', // default value
    formRefName: 'stageForm' // default value
  }

}
