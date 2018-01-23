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
    nextStages {
      edges {
        node {
          id
        }
      }
    }
  }
`

export const extendedModuleFragment = gql`
  fragment extendedModuleFragment on ModuleNode {
    ...coreModuleFragment
    created
    ownedBy {
      id
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

export const UPSERT_STAGE_MUTATION = gql`
  mutation upsertStageMutation($id: ID, $moduleId: ID!, $name: String!, $shortDescription: String!, $nextStages: [ID!]) {
    upsertStage(
      input: {
        id: $id
        moduleId: $moduleId
        name: $name
        shortDescription: $shortDescription
        nextStages: $nextStages
      }
    ) {
      stage {
        ...coreStageFragment
      }
      __typename
    }
  }
  ${coreStageFragment}
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

export const CREATE_LINK_MUTATION = gql`
  mutation CreateLinkMutation($description: String!, $url: String!, $postedById: ID!) {
    createLink(
      description: $description,
      url: $url,
      postedById: $postedById
    ) {
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
      }
    }
  }
`

export const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($name: String!, $email: String!, $password: String!) {
    createUser(
      name: $name,
      authProvider: {
        email: {
          email: $email,
          password: $password
        }
      }
    ) {
      id
    }
    signinUser(email: {
      email: $email,
      password: $password
    }) {
      token
      user {
        id
      }
    }
  }
`

export const CREATE_VOTE_MUTATION = gql`
  mutation CreateVoteMutation($userId: ID!, $linkId: ID!) {
    createVote(userId: $userId, linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

export const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    Link(filter: {
      mutation_in: [CREATED]
    }) {
      node {
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
  }
`

export const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    Vote(filter: {
      mutation_in: [CREATED]
    }) {
      node {
        id
        link {
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
        user {
          id
        }
      }
    }
  }
`

export const SIGNIN_USER_MUTATION = gql`
  mutation SigninUserMutation($email: String!, $password: String!) {
    signinUser(email: {
      email: $email,
      password: $password
    }) {
      token
      user {
        id
      }
    }
  }
`
