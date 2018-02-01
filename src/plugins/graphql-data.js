import * as types from '../store/mutation-types'
import _ from 'lodash'
import {QUEUE_SCHEDULE} from '../constants/settings'
import {firstAttribute} from '../utils'

const GraphQLData = {
  install (Vue, {store, apolloClient}) {
    console.log('GraphQLData plugin is loaded')
    Vue.processQueue = () => {
      setImmediate(function () {
        const queue = store.state.graphqlQueue.mutationsQueue
        if (!store.state.graphqlQueue.mutationsQueueLock && !_.isEmpty(queue)) {
          store.commit(types.LOCK_MUTATION_QUEUE)
          let cursor = queue[0]
          Vue.prototype.upsertMutation(cursor.config, cursor.formData).then((res) => {
            store.commit(types.SHIFT_MUTATION)
            setImmediate(Vue.processQueue())
          }).catch((e) => {
            console.log('erreur dans la queue - upsert')
          })
          store.commit(types.UNLOCK_MUTATION_QUEUE)
        }
      })
    }

    Vue.pushToQueue = (config, formData) => {
      store.commit(types.PUSH_MUTATION, {id: `${config.itemName}#${formData.id}`, config, formData})
    }

    Vue.prototype.upsertMutation = async (config, formData) => {
      let collectionQuery = config.collectionQuery
      return apolloClient.mutate({
        mutation: config.upsertMutation,
        variables: formData,
        update (store, updatedData) {
          // TODO create cache query when we just created an item i.e. when the colleciton query is  not existing?
          // TODO check if config.collectionQuery exists
          // TODO reload mode when saving a stage, or update module.stages in the cache?
          try {
            const data = store.readQuery({ query: collectionQuery }) // TODO sort by name
            let updatedNode = firstAttribute(updatedData.data, 2)
            let item = firstAttribute(data)
            let foundIndex = item['edges'].findIndex((element) => {
              return element.node.id === updatedNode.id
            })
            let newEdge = {
              node: updatedNode,
              __typename: `${updatedNode.__typename}Edge`
            }
            if (foundIndex > -1) item['edges'].splice(foundIndex, 1, newEdge)
            else item['edges'].push(newEdge)
            store.writeQuery({ query: collectionQuery, data })
          } catch (e) {
            // console.log('Update error')
          }
        }
      }).then((res) => {
        return res
      }).catch((e) => {
        Vue.pushToQueue(config, formData)
        throw e.message
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
