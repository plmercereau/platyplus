import * as types from '../store/mutation-types'
import _ from 'lodash'
import {QUEUE_SCHEDULE} from '../constants/settings'

const GraphQLData = {
  install (Vue, {store}) {
    console.log('GraphQLData plugin is loaded')
    Vue.processQueue = () => {
      setImmediate(function () {
        const queue = store.state.graphqlQueue.mutationsQueue
        if (!store.state.graphqlQueue.mutationsQueueLock && !_.isEmpty(queue)) {
          store.commit(types.LOCK_MUTATION_QUEUE)
          let cursor = queue[0]
          console.log(cursor.id) // TODO process the gql mutation
          store.commit(types.SHIFT_MUTATION)
          store.commit(types.UNLOCK_MUTATION_QUEUE)
          setImmediate(Vue.processQueue())
        }
      })
    }

    setInterval(Vue.processQueue, QUEUE_SCHEDULE)
    // 2. ajouter une ressource globale
    // Vue.directive('my-directive', {
    //   bind (el, binding, vnode, oldVnode) {
    //     // de la logique de code...
    //   }
    //   ...
    // })

    // 3. injecter des options de composant
    // Vue.mixin({
    //   created: function () {
    //     // de la logique de code...
    //   }
    //   ...
    // })

    // 4. ajouter une méthode d'instance
    // Vue.prototype.$myMethod = function (methodOptions) {
    //   // de la logique de code...
    // }

    // We call Vue.mixin() here to inject functionality into all components.
    // Vue.mixin({
    //   // Anything added to a mixin will be injected into all components.
    //   // In this case, the mounted() method runs when the component is added to the DOM.
    //   mounted () {
    //     console.log('Mounted!')
    //   }
    // })
  }
}
export default GraphQLData
