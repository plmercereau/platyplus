import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './actions'
import graphqlModule from './modules/graphql'
import auth from './modules/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
  // actions,
  modules: {
    graphqlModule,
    auth
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
