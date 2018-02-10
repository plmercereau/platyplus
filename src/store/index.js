import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './actions'
import graphqlModule from './modules/graphql'

Vue.use(Vuex)

const store = new Vuex.Store({
  // actions,
  modules: {
    graphqlModule
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
