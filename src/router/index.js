import Vue from 'vue'
import Router from 'vue-router'

import Sandbox from '@/containers/Sandbox'
import ModuleList from '@/containers/ModuleList'
import Module from '@/containers/Module'
import Stage from '@/containers/Stage'
import Home from '@/containers/Home'
import Login from '@/containers/Login'

Vue.use(Router)

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
        title: 'Login'
      }
    },
    {
      path: '/sandbox',
      component: Sandbox,
      meta: {
        title: 'Sandbox'
      }
    },
    {
      path: '/home',
      component: Home,
      meta: {
        title: 'Home'
      }
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
      path: '/modules/:moduleId',
      component: Module,
      meta: {
        title: 'Module'
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

// router.beforeEach((to, from, next) => {
//   return next()
// })

export default router
