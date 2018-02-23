import Vue from 'vue'
import Vuex from 'vuex'
import graphqlModule from './modules/graphql'
import auth from './modules/auth'
import * as types from './mutation-types'

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
    [types.TOGGLE_DRAWER] (state) {
      state.drawer = !state.drawer
    },
    [types.HIDE_DRAWER] (state) {
      state.drawer = false
    }
  }
})
export default store
