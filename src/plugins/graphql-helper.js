import store from '../store'
import apolloClient from '../plugins/apollo-client'
import * as types from '../store/mutation-types'
import _ from 'lodash'
import {DATA_ITEMS_CONFIG} from '../config/queries'
import {QUEUE_SCHEDULE} from '../config'
import {loadDefaultCache, firstAttribute, formToData} from '../utils/graphql'

const GraphQLHelper = {
  install (Vue) {
    loadDefaultCache()

    Vue.processQueue = () => {
      setImmediate(function () {
        const queue = store.state.graphqlModule.mutationsQueue
        if (!store.state.graphqlModule.mutationsQueueLock && !_.isEmpty(queue)) {
          store.commit(types.LOCK_MUTATION_QUEUE)
          let cursor = queue[0]
          let config = DATA_ITEMS_CONFIG[cursor.itemName]
          Vue.prototype.upsertMutation(cursor.formData, config).then((res) => {
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
      let upsertName = `upsert${_.upperFirst(itemName)}` // TODO could be guessed in browsing upsertMutation
      return formToData(formData, {itemName, upsertMutation}, true).then((optimisticData) => {
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
          },
          optimisticResponse: {
            [upsertName]: {
              [itemName]: optimisticData,
              __typename: `${_.upperFirst(upsertName)}Payload` // TODO could be guessed with gql introspection
            }
          }
        }).then((res) => {
          return res
        }).catch((e) => { // upsertMutation failed
          store.commit(types.PUSH_MUTATION, {formData, itemName})
          store.commit(types.SET_SERVER_STATUS_OFFLINE)
          throw e.message
        })
      })
    }
  }
}
export default GraphQLHelper
