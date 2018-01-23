import {SINGLE_MODULE_QUERY} from './graphql'
import _ from 'lodash'

export function singleQuery (query, subCollectionItemForm, subCollectionSelectField) {
  return {
    query: query,
    variables () {
      return {
        id: this.$route.params.id
      }
    },
    update (data) {
      let itemName = query.definitions[0].selectionSet.selections[0].name.value
      if (subCollectionItemForm) {
        if (!this.create) {
          this.itemData = data[itemName][subCollectionItemForm].edges.find((edge) => {
            return edge.node.id === this.$route.params.idSubItem
          }).node
        }
        this.form = _.cloneDeep(this.itemData)
      } else {
        this.form = _.cloneDeep(data[itemName])
      }
      if (subCollectionSelectField && !this.create) {
        let collection = this.form[subCollectionSelectField.name].edges.map(el => {
          return el.node[subCollectionSelectField.key]
        })
        this[`${subCollectionSelectField.name}Ids`] = _.clone(collection)
      }
      return data[itemName]
    },
    skip () {
      return (!subCollectionItemForm && this.create)
    }
  }
}

export const singleModuleQuery = singleQuery(SINGLE_MODULE_QUERY)
export const singleModuleSingleStageQuery = singleQuery(SINGLE_MODULE_QUERY, 'stages', {name: 'nextStages', key: 'id'})

export const moduleData = {
  stages: {}
}

export const stageData = {
  nextStages: {}
}
