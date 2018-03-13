import localforage from 'localforage'
import * as types from '../store/mutation-types'
import router from '../router'
import store from '../store'
import apolloClient from '../plugins/apollo-client'
import {AUTH_TOKEN} from '../config/settings'
import {ME_QUERY, SIGNIN_USER_MUTATION} from '../config/queries/user'
import {defineAbilitiesFor} from '../config'
import {loadDefaultCache} from '../utils/graphql'

const AuthPlugin = {
  install (Vue) {
    localforage.getItem(AUTH_TOKEN).then((token) => {
      if (token) {
        apolloClient.query({query: ME_QUERY}).then((res) => {
          store.commit(types.SET_USER, res.data.me)
        })
        loadDefaultCache()
      }
    })

    Vue.mixin({
      computed: {
        user () {
          return store.state.auth.user
        }
      }
    })

    // if keep-alive: does not reload even when page is in cache
    // TODO subobtimal as call too often and not kept in memory...
    Vue.prototype.$can = function (action, subject) {
      let ability = defineAbilitiesFor(store.state.auth.user)
      return ability.can(action, subject)
    }

    Vue.prototype.login = (username, password) => {
      apolloClient.mutate({
        mutation: SIGNIN_USER_MUTATION,
        variables: { username, password }
      }).then(({data}) => {
        localforage.setItem(AUTH_TOKEN, data.login.token).then(() => {
          store.commit(types.SET_USER, data.login.user)
          router.push({path: '/'})
        })
      }).catch((e) => {
        this.loginError = e // TODO revoir
      })
    }
    Vue.prototype.logout = () => {
      localforage.clear().then(() => {
        store.commit(types.CLEAR_USER)
        store.commit(types.HIDE_DRAWER)
        apolloClient.resetStore() // TODO https://github.com/apollographql/apollo-client/issues/2774
        router.push({path: '/'})
      })
    }
  }
}
export default AuthPlugin
