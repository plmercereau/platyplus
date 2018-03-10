import gql from 'graphql-tag'

export const coreStageFragment = gql`
  fragment coreStageFragment on StageNode {
    id
    name
    shortDescription
  }
`

export const extendedStageFragment = gql`
  fragment extendedStageFragment on StageNode {
    ...coreStageFragment
    module {
      id
      ownedBy {
        id
        username
      }
    }
    nextStages {
      edges {
        node {
          id
        }
      }
    }
  }
  ${coreStageFragment}
`
export const SINGLE_STAGE_QUERY = gql`
  query stageQuery($id: ID!){
    stage(id:$id) {
      ...extendedStageFragment
    }
  }
  ${extendedStageFragment}
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
    }
  }
  ${extendedStageFragment}
`
