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

import { GC_USER_ID } from './constants/settings'
import GraphQLData from './plugins/graphql-data'
import apolloClient from './plugins/apollo-client'

Vue.config.productionTip = false
const userId = localStorage.getItem(GC_USER_ID)

Vue.use(Meta) // TODO still being used?

Vue.use(VeeValidate)

Vue.use(VueApollo, {apolloClient})

Vue.use(GraphQLData, {store, apolloClient})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $loadingKey: 'loading'
  }
  // errorHandler (error) {
  // console.log('Global error handler')
  // console.log(error)
  // }
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

// INFO used for accessing methods of parent mixin
// Vue.prototype.$super = function (options) {
//   return new Proxy(options, {
//     get: (options, name) => {
//       if (options.methods && name in options.methods) {
//         return options.methods[name].bind(this)
//       }
//     }
//   })
// }

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
