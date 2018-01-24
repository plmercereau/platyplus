import Vue from 'vue'
import Router from 'vue-router'

import AppLogin from '../components/AppLogin'
import CreateLink from '../components/CreateLink'
import LinkList from '../components/LinkList'
import ModuleList from '../containers/ModuleList'
// import Module from '../components/Module'
import Module from '../containers/Module'
import Stage from '../containers/Stage'
import Home from '../containers/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home',
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/create',
      component: CreateLink
    },
    {
      path: '/login',
      component: AppLogin
    },
    {
      path: '/new/:page',
      component: LinkList,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/top',
      component: LinkList
    },
    {
      path: '/modules',
      component: ModuleList,
      meta: {
        title: 'Modules'
      }
    },
    {
      path: '/modules/create',
      component: Module,
      props: { create: true },
      meta: {
        title: 'Module'
      }
    },
    {
      path: '/modules/:id',
      component: Module,
      meta: {
        title: 'Module'
      }
    },
    {
      path: '/modules/:id/stages/create',
      props: { create: true },
      component: Stage,
      meta: {
        title: 'Stage'
      }
    },
    {
      path: '/modules/:moduleId/stages/:id',
      component: Stage,
      meta: {
        title: 'Stage'
      }
    }
  ],
  mode: 'history'
})
