import gql from 'graphql-tag'

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
