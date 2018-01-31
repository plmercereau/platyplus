import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './actions'
import graphqlQueue from './modules/graphql-queue'

Vue.use(Vuex)

const store = new Vuex.Store({
  // actions,
  modules: {
    graphqlQueue
  },
  state: {
    drawer: undefined
  },
  mutations: {
    toggleDrawer (state) {
      state.drawer = !state.drawer
    }
  }
})
export default store
