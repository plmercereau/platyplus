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

import GraphQLHelper from './plugins/graphql-helper'
import apolloClient from './plugins/apollo-client'
import AuthPlugin from './plugins/auth'

Vue.config.productionTip = false

Vue.use(Meta) // TODO still being used?

Vue.use(VeeValidate)

Vue.use(VueApollo, {apolloClient})

Vue.use(GraphQLHelper)

Vue.use(AuthPlugin)

/** Creates an Apollo Provider with a global error hanlder that is actually not used */
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

/* eslint-disable no-new */
window.vm = new Vue({
  // fragments,
  el: '#app',
  store, // Vuex
  // apolloProvider,
  provide: apolloProvider.provide(),
  router,
  template: '<App/>',
  components: { App }
})
