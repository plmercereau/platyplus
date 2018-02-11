import { HeadGoverness } from 'vue-kindergarten'

export default class RouteGoverness extends HeadGoverness {
  guard (action, { next }) {
    return this.isAllowed(action) ? next() : next('/') // TODO wrongly redirects to '/' when the path is loaded without history
  }
}
