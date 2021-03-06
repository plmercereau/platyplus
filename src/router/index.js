import Vue from 'vue'
import Router from 'vue-router'

import defineAbilitiesFor from '../constants/ability'

import Sandbox from '../containers/Sandbox'
import ModuleList from '../containers/ModuleList'
import Module from '../containers/Module'
import Stage from '../containers/Stage'
import Home from '../containers/Home'
import Login from '../containers/Login'
import store from '../store'
import {AUTH_TOKEN} from '../constants/settings'
import * as types from '../store/mutation-types'
import apolloClient from '../plugins/apollo-client'
import {ME_QUERY} from '../constants/graphql'

Vue.use(Router)

/** Definition of the routes of the application */
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: Login,
      meta: {
        title: 'Login',
        type: 'auth',
        action: 'login'
      }
    },
    {
      path: '/sandbox',
      component: Sandbox,
      meta: {
        title: 'Sandbox',
        type: 'sandbox'
      }
    },
    {
      path: '/home',
      component: Home,
      meta: {
        title: 'Home',
        type: 'home'
      }
    },
    {
      path: '/modules',
      component: ModuleList,
      meta: {
        title: 'Modules',
        type: 'module'
      }
    },
    {
      path: '/modules/create',
      component: Module,
      props: { create: true },
      meta: {
        title: 'Module',
        type: 'module',
        action: 'create'
      }
    },
    {
      path: '/modules/:moduleId',
      component: Module,
      meta: {
        title: 'Module',
        type: 'module',
        action: 'read'
      }
    },
    {
      path: '/modules/:moduleId/stages/create',
      props: { create: true },
      component: Stage,
      meta: {
        title: 'Stage'
      }
    },
    {
      path: '/modules/:moduleId/stages/:stageId',
      component: Stage,
      meta: {
        title: 'Stage'
      }
    }
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => { // TODO refactor: this is ugly
  // By default: if no permission is detailed for a path, then give action
  if (!to.meta.type) return next()

  if (localStorage.getItem(AUTH_TOKEN) && store.state.auth.user.username === '') { // TODO DRY as used elsewhere
    apolloClient.query({query: ME_QUERY}).then((res) => {
      store.commit(types.SET_USER, res.data.me)
      let ability = defineAbilitiesFor(store.state.auth.user)
      if (ability.can(to.meta.action || 'route', {type: to.meta.type})) return next()
    }) // TODO catch errors
  } else {
    let ability = defineAbilitiesFor(store.state.auth.user)
    if (ability.can(to.meta.action || 'route', {type: to.meta.type})) return next()
  }
})

export default router
