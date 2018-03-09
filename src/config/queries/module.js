import gql from 'graphql-tag'
import {coreStageFragment} from './stage'

export const coreModuleFragment = gql`
  fragment coreModuleFragment on ModuleNode {
    id
    __typename
    name
    shortDescription
  }
`

export const extendedModuleFragment = gql`
  fragment extendedModuleFragment on ModuleNode {
    ...coreModuleFragment
    created
    ownedBy {
      id
      __typename
      username
    }
    stages {
      edges {
        node {
          ...coreStageFragment
        }
      }
    }
  }
  ${coreModuleFragment}
  ${coreStageFragment}
`

// TODO sort by name
export const ALL_MODULES_QUERY = gql`
  query AllModulesQuery {
    modules {
      edges {
        node {
          ...coreModuleFragment
        }
      }
    }
  }
  ${coreModuleFragment}
`

export const SINGLE_MODULE_QUERY = gql`
  query moduleQuery($id: ID!){
    module(id:$id) {
      ...extendedModuleFragment
    }
  }
  ${extendedModuleFragment}
`

export const UPSERT_MODULE_MUTATION = gql`
  mutation upsertModuleMutation($id: ID, $name: String!, $shortDescription: String!) {
    upsertModule(
      input: {
        id: $id,
        name: $name,
        shortDescription: $shortDescription
      }
    ) {
      module {
        ...extendedModuleFragment
      }
      __typename
    }
  }
  ${extendedModuleFragment}
`
