import Vue from 'vue'
import Router from 'vue-router'
import { createSandbox } from 'vue-kindergarten'

import child from '../child'
import RouteGoverness from './route-governess'
import userPerimeter from '../perimeters/user-perimeter'

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
        title: 'Modules',
        perimeter: userPerimeter
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

router.beforeEach((to, from, next) => {
  to.matched.forEach((routeRecord) => {
    const perimeter = routeRecord.meta.perimeter
    const Governess = routeRecord.meta.governess || RouteGoverness
    const action = routeRecord.meta.perimeterAction || 'route'

    if (perimeter) {
      const sandbox = createSandbox(child(), {
        governess: new Governess(),
        perimeters: [
          perimeter
        ]
      })
      return sandbox.guard(action, { to, from, next })
    }
    return next()
  })
})

export default router
