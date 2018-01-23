import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    drawer: undefined,
    moduleTab: 'General',
    tabs: {
      stage: 'General'
    },
    stageTab: 'General' // TODO remove
    // title: 'Default'
  },
  mutations: {
    toggleDrawer (state) {
      state.drawer = !state.drawer
    },
    setModuleTab (state, payload) {
      state.moduleTab = payload
    },
    setTab (state, payload) {
      state.tabs[payload.component] = payload.tab
    }
    // setTitle (state, payload) {
    //   state.title = payload.title
    // }
  }
})
export default store
