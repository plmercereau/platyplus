// Apollo imports
import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink, concat, split } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

// Vue imports
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import router from './router'
import store from './store'
import Meta from 'vue-meta'
import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate'
import 'vuetify/dist/vuetify.min.css'

// Component imports
import App from './App'

import { GC_USER_ID, GC_AUTH_TOKEN } from './constants/settings'

const httpLink = new HttpLink({
  uri: 'http://localhost:8000/graphql/',
  options: {
    mode: 'no-cors'
  }
})

const token = localStorage.getItem(GC_AUTH_TOKEN) || null
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: `Bearer ${token}`
    }
  })
  return forward(operation)
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

const apolloClient = new ApolloClient({
  link: concat(authMiddleware, link),
  cache: new InMemoryCache()
})

Vue.use(VueApollo)

Vue.config.productionTip = false

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $loadingKey: 'loading'
  },
  errorHandler (error) {
    console.log('Global error handler')
    console.error(error)
  }
})

const userId = localStorage.getItem(GC_USER_ID)

Vue.use(Vuetify, {
  theme: {
    // primary: '#795548',
    // secondary: '#757575',
    // accent: '#FF5252',
    // error: '#FF5252',
    // info: '#2196F3',
    // success: '#4CAF50',
    // warning: '#FFC107'
  }
})

Vue.use(Meta) // TODO still being used?

Vue.use(VeeValidate)

Vue.prototype.$super = function (options) {
  return new Proxy(options, {
    get: (options, name) => {
      if (options.methods && name in options.methods) {
        return options.methods[name].bind(this)
      }
    }
  })
}

/* eslint-disable no-new */
window.vm = new Vue({
  // fragments,
  el: '#app',
  store, // Vuex
  apolloProvider,
  router,
  data: {
    userId
  },
  template: '<App/>',
  components: { App }
})
