import gql from 'graphql-tag'

export const coreModuleFragment = gql`
  fragment coreModuleFragment on ModuleNode {
    id
    __typename
    name
    shortDescription
  }
`

export const coreStageFragment = gql`
  fragment coreStageFragment on StageNode {
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

export const extendedStageFragment = gql`
  fragment extendedStageFragment on StageNode {
    ...coreStageFragment
    module {
      id
      __typename
      ownedBy {
        id
        __typename
        username
      }
    }
    nextStages {
      edges {
        node {
          id
          __typename
        }
      }
    }
  }
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

export const SINGLE_STAGE_QUERY = gql`
  query stageQuery($id: ID!){
    stage(id:$id) {
      ...extendedStageFragment
    }
  }
  ${extendedStageFragment}
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

export const UPSERT_STAGE_MUTATION = gql`
  mutation upsertStageMutation($id: ID, $moduleId: ID!, $name: String!, $shortDescription: String!, $nextStagesIds: [ID!]) {
    upsertStage(
      input: {
        id: $id
        moduleId: $moduleId
        name: $name
        shortDescription: $shortDescription
        nextStagesIds: $nextStagesIds
      }
    ) {
      stage {
        ...extendedStageFragment
      }
      __typename
    }
  }
  ${extendedStageFragment}
`

export const ALL_LINKS_QUERY = gql`
  query AllLinksQuery($first: Int, $skip: Int, $orderBy: LinkOrderBy) {
    allLinks(first: $first, skip: $skip, orderBy: $orderBy) {
      id
      createdAt
      url
      description
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
    _allLinksMeta {
      count
    }
  }
`

export const ALL_LINKS_SEARCH_QUERY = gql`
  query AllLinksSearchQuery($searchText: String!) {
    allLinks(filter: {
      OR: [{
        url_contains: $searchText
      }, {
        description_contains: $searchText
      }]
    }) {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`

export const coreUserFragment = gql`
  fragment coreUserFragment on UserNode {
    id
    __typename
    username
    isStaff
    isSuperuser
  }
`

export const SIGNIN_USER_MUTATION = gql`
  mutation SigninUserMutation($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password
    ) {
      token
      user {
        ...coreUserFragment
      }
    }
  }
  ${coreUserFragment}
`

export const ME_QUERY = gql`  
  query {
    me {
      ...coreUserFragment
    }
  }
  ${coreUserFragment}
`

export const TYPE_INTROSPECTION = gql`
  query TypeInstrospection($name: String!){
  __type(name: $name) {
    fields {
      name
      type {
        kind
        name
        fields {
          name
          type {
            kind
            name
            fields {
              name
              type {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
}`
