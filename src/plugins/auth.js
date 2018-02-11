import * as types from '../store/mutation-types'
import router from '../router'
import store from '../store'
import apolloClient from '../plugins/apollo-client'
import {AUTH_TOKEN} from '../constants/settings'
import {ME_QUERY, SIGNIN_USER_MUTATION} from '../constants/graphql'

const AuthPlugin = {
  install (Vue) {
    if (localStorage.getItem(AUTH_TOKEN)) {
      apolloClient.query({query: ME_QUERY}).then((res) => {
        store.commit(types.SET_USER, res.data.me)
      })
    }

    Vue.mixin({
      computed: {
        user () {
          return store.state.auth.user
        }
      }
    })

    Vue.prototype.login = (username, password) => {
      apolloClient.mutate({
        mutation: SIGNIN_USER_MUTATION,
        variables: { username, password }
      }).then(({data}) => {
        localStorage.setItem(AUTH_TOKEN, data.login.token)
        store.commit(types.SET_USER, data.login.user)
        router.push({path: '/'})
      }).catch((e) => {
        this.loginError = e // TODO revoir
      })
    }
    Vue.prototype.logout = () => {
      localStorage.removeItem(AUTH_TOKEN)
      store.commit(types.CLEAR_USER)
      apolloClient.resetStore() // TODO https://github.com/apollographql/apollo-client/issues/2774
      router.push({path: '/'})
    }
  }
}
export default AuthPlugin
