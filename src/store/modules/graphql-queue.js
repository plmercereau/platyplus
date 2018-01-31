import * as types from '../mutation-types'

// initial state
const state = {
  mutationsQueue: [],
  mutationsQueueInterval: null,
  mutationsQueueLock: null
}

// getters
const getters = {
}

// actions
const actions = {
  // TODO: https://github.com/Akryum/vue-apollo/issues/7#issuecomment-251580141
}

// mutations
const mutations = {
  [types.PUSH_MUTATION] (state, mutation) {
    // state.checkoutStatus = null
    const record = state.mutationsQueue.find(cursor => cursor.id === mutation.id)
    if (!record) {
      state.mutationsQueue.push(mutation)
    }
  },
  [types.SHIFT_MUTATION] (state) {
    state.mutationsQueue.shift()
  },
  [types.UNLOCK_MUTATION_QUEUE] (state) {
    state.mutationsQueueLock = false
  },
  [types.LOCK_MUTATION_QUEUE] (state) {
    state.mutationsQueueLock = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
