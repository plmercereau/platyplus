import * as types from '../mutation-types'
import Vue from 'vue'

const initialState = {
  user: {
    id: null,
    username: '',
    email: ''
  }
}

const state = Vue.util.extend({}, initialState)

// getters
const getters = {
  isAnonymous (state) { // TODO remove, useless
    return !state.user.id
  }
}

// actions
const actions = {
  // TODO: https://github.com/Akryum/vue-apollo/issues/7#issuecomment-251580141
}

// mutations
const mutations = {
  [types.SET_USER] (state, user) {
    if (user) {
      state.user = Object.assign({}, state.user, user)
    }
  },
  [types.CLEAR_USER] (state) {
    state.user = Object.assign({}, initialState.user)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
