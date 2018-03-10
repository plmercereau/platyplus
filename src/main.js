// Vue imports
import localforage from 'localforage'
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import router from './router'
import store from './store'
import Meta from 'vue-meta'
import Vuetify from 'vuetify'
import VueMoment from 'vue-moment'
import VeeValidate from 'vee-validate'
import 'vuetify/dist/vuetify.min.css'
import AsyncComputed from 'vue-async-computed'

// Component imports
import App from './App'
import GraphQLHelper from './plugins/graphql-helper'
import apolloClient from './plugins/apollo-client'
import AuthPlugin from './plugins/auth'

localforage.config({
  name: 'platyplus'
})

Vue.config.productionTip = false

Vue.use(Meta) // TODO still being used?
Vue.use(VeeValidate)
Vue.use(VueApollo, {apolloClient})
Vue.use(GraphQLHelper)
Vue.use(AuthPlugin)
Vue.use(Vuetify, {theme: {}})
Vue.use(VueMoment)
Vue.use(AsyncComputed)

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
