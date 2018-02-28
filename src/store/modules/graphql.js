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
  [types.PUSH_MUTATION] (state, {itemName, formData}) {
    const index = state.mutationsQueue.findIndex((cursor) => {
      return ((itemName === cursor.itemName) && (formData.id === cursor.formData.id))
    })
    if (index > -1) { // the mutation in arg replaces the existing one
      let attempts = (state.mutationsQueue[index].attempts || 0) + 1
      state.mutationsQueue.splice(index, 1, {itemName, attempts, lastAttempt: Date(), formData})
    } else {
      state.mutationsQueue.push({itemName, attempts: 1, lastAttempt: Date(), formData})
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
