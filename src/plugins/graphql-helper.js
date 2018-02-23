import store from '../store'
import apolloClient from '../plugins/apollo-client'
import * as types from '../store/mutation-types'
import _ from 'lodash'
import {QUEUE_SCHEDULE} from '../constants/settings'
import {firstAttribute} from '../utils'

const GraphQLHelper = {
  install (Vue) {
    Vue.processQueue = () => {
      setImmediate(function () {
        const queue = store.state.graphqlModule.mutationsQueue
        if (!store.state.graphqlModule.mutationsQueueLock && !_.isEmpty(queue)) {
          store.commit(types.LOCK_MUTATION_QUEUE)
          let cursor = queue[0]
          Vue.prototype.upsertMutation(cursor.formData, cursor.config).then((res) => {
            store.commit(types.SHIFT_MUTATION)
            store.commit(types.UNLOCK_MUTATION_QUEUE)
            store.commit(types.SET_SERVER_STATUS_ONLINE)
            setImmediate(Vue.processQueue())
          }).catch((e) => { // erreur dans la queue - upsert
            store.commit(types.UNLOCK_MUTATION_QUEUE)
            store.commit(types.SET_SERVER_STATUS_OFFLINE)
          })
        }
      })
    }

    setInterval(Vue.processQueue, QUEUE_SCHEDULE)

    Vue.prototype.upsertMutation = async (formData, {collectionQuery, upsertMutation, itemName}) => {
      return apolloClient.mutate({
        mutation: upsertMutation,
        variables: formData,
        update (store, updatedData) {
          // TODO create cache query when we just created an item i.e. when the colleciton query is  not existing?
          if (collectionQuery) {
            try {
              const data = store.readQuery({query: collectionQuery}) // TODO sort by name
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
              store.writeQuery({query: collectionQuery, data})
            } catch (e) {
              console.log('Error in updating the cached collection after a gql mutation')
            }
          }
        }
        // optimisticResponse () { // TODO too complicated with the __typenames...
        //   console.log('Optimistic Response')
        //   console.log(config)
        //   return {
        //     upsertModule: {
        //       module: formToData(formData, config, true),
        //       __typename: 'UpsertModulePayload'
        //     }
        //   }
        // }
      }).then((res) => {
        return res
      }).catch((e) => { // upsertMutation failed
        store.commit(types.PUSH_MUTATION, {formData, config: {collectionQuery, upsertMutation, itemName}})
        store.commit(types.SET_SERVER_STATUS_OFFLINE)
        throw e.message
      })
    }
  }
}
export default GraphQLHelper
