import * as types from '../mutation-types'

// initial state
const state = {
  onlineServer: true,
  mutationsQueue: [],
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
  [types.PUSH_MUTATION] (state, {formData, config}) {
    const index = state.mutationsQueue.findIndex(({cFormData, cConfig}) => {
      return ((config.itemName === cConfig.itemName) && (formData.id === cFormData.id))
    })
    if (index > -1) { // the mutation in arg replaces the existing one
      state.splice(index, 1, {formData, config})
    } else {
      state.mutationsQueue.push({formData, config})
    }
  },
  [types.SHIFT_MUTATION] (state, mutation) {
    if (mutation) {
      console.log('todo') // TODO removes the mutation
    } else {
      state.mutationsQueue.shift()
    }
  },
  [types.UNLOCK_MUTATION_QUEUE] (state) {
    state.mutationsQueueLock = false
  },
  [types.LOCK_MUTATION_QUEUE] (state) {
    state.mutationsQueueLock = true
  },
  [types.SET_SERVER_STATUS_OFFLINE] (state) {
    state.onlineServer = false
  },
  [types.SET_SERVER_STATUS_ONLINE] (state) {
    state.onlineServer = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
