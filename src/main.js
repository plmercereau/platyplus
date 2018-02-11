// Vue imports
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import router from './router'
import store from './store'
import Meta from 'vue-meta'
import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate'
import 'vuetify/dist/vuetify.min.css'
import VueKindergarten from 'vue-kindergarten'
// Component imports
import App from './App'

import GraphQLHelper from './plugins/graphql-helper'
import apolloClient from './plugins/apollo-client'
import AuthPlugin from './plugins/auth'
import child from './child'

Vue.config.productionTip = false

Vue.use(Meta) // TODO still being used?

Vue.use(VeeValidate)

Vue.use(VueApollo, {apolloClient})

Vue.use(GraphQLHelper)

Vue.use(AuthPlugin)

Vue.use(VueKindergarten, {child})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $loadingKey: 'loading'
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
  apolloProvider,
  router,
  template: '<App/>',
  components: { App }
})
