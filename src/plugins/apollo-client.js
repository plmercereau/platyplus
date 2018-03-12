import localforage from 'localforage'
import {WebSocketLink} from 'apollo-link-ws/lib/index'
import {AUTH_TOKEN} from '../config'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache } from 'apollo-cache-persist'
import {getMainDefinition} from 'apollo-utilities'
import ApolloClient from 'apollo-client/index'
import { onError } from 'apollo-link-error'
import router from '../router'
import * as types from '../store/mutation-types'
import store from '../store'
import {concat, split} from 'apollo-link'
import { setContext } from 'apollo-link-context'
import {HttpLink} from 'apollo-link-http'

const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_API || 'http://localhost:8000/graphql/',
  // fetch: fetch, // TODO test without this
  options: {
    mode: 'no-cors'
  }
})

const authMiddleware = setContext(operation =>
  localforage.getItem(AUTH_TOKEN).then(token => {
    return {
      headers: {
        authorization: token ? `JWT ${token}` : null
      }
    }
  })
)

const errorLink = onError((error) => {
  console.log(error)
  if (error.networkError && error.networkError.statusCode === 401) {
    console.log('Error 401')
    localforage.removeItem(AUTH_TOKEN).then(() => {
      store.commit(types.CLEAR_USER)
      router.replace('/login')
    })
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

const cache = new InMemoryCache({
  // dataIdFromObject: o => o.uuid // TODO check what is means
})

persistCache({
  cache,
  storage: localforage
})

const apolloClient = new ApolloClient({
  link: concat(authMiddleware, uriLinks),
  // addTypename: true,
  cache,
  connectToDevTools: true
})

export default apolloClient
