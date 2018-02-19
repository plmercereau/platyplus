import {WebSocketLink} from 'apollo-link-ws/lib/index'
import {AUTH_TOKEN} from '../constants/settings'
import {ApolloLink, concat, split} from 'apollo-link/lib/index'
import {InMemoryCache} from 'apollo-cache-inmemory/lib/index'
import {getMainDefinition} from 'apollo-utilities/lib/index'
import {HttpLink} from 'apollo-link-http/lib/index'
import ApolloClient from 'apollo-client/index'
// import fetch from 'unfetch'
import { onError } from 'apollo-link-error'
import router from '../router'
import * as types from '../store/mutation-types'
import store from '../store'

const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_API || 'http://localhost:8000/graphql/',
  // fetch: fetch, // TODO test without this
  options: {
    mode: 'no-cors'
  }
})

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = localStorage.getItem(AUTH_TOKEN) || null
  if (token) {
    operation.setContext({
      headers: {
        authorization: `JWT ${token}`
      }
    })
  }
  return forward(operation)
})

const errorLink = onError((error) => {
  if (error.networkError.statusCode === 401) {
    console.log('Error 401')
    localStorage.removeItem(AUTH_TOKEN)
    store.commit(types.CLEAR_USER)
    router.replace('/login')
  }
})

// Set up subscription
const wsLink = new WebSocketLink({ // TODO move to graphene subscriptions
  uri: `wss://subscriptions.graph.cool/v1/cjc51cixb014s0181tzq5yc8t`,
  options: {
    reconnect: true,
    mode: 'no-cors'
  }
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)
const uriLinks = errorLink.concat(link)

const apolloClient = new ApolloClient({
  link: concat(authMiddleware, uriLinks),
  cache: new InMemoryCache({
    // dataIdFromObject: o => o.uuid // TODO check what is means
  }),
  connectToDevTools: true
})

export default apolloClient
