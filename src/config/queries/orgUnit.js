import gql from 'graphql-tag'

export const coreOrgUnitFragment = gql`
  fragment coreOrgUnitFragment on OrgUnitNode {
    id
    name
    shortDescription
  }
`

export const extendedOrgUnitFragment = gql`
  fragment extendedOrgUnitFragment on OrgUnitNode {
    ...coreOrgUnitFragment
    ancestors {
      edges {
        node {
          id
          name
        }
      }
    }
    parent {
      id
      name
    }
    children {
      edges {
        node {
          id
          name
        }
      }
    }
  }
  ${coreOrgUnitFragment}
`

export const ROOT_ORG_UNITS_QUERY = gql`
  query rootOrgUnitsQuery {
    rootOrgUnits {
      edges {
        node {
          ...extendedOrgUnitFragment
        }
      }
    }
  }
  ${extendedOrgUnitFragment}
`

export const SINGLE_ORG_UNIT_QUERY = gql`
  query orgUnitQuery($id: ID!){
    orgUnit(id:$id) {
      ...extendedOrgUnitFragment
    }
  }
  ${extendedOrgUnitFragment}
`
