import _ from 'lodash'
import {firstAttribute} from '../utils'

export const dataItemMixin = {
  props: {
    create: Boolean // available from the url through vue-router config
  },
  data () {
    return {
      config: [],
      formData: [],
      itemData: [], // TODO move all item Datas into this array instead of putting them in the component root?
      edit: this.create // edit mode: turns on/off the forms inputs // TODO move to form level?
    }
  },
  methods: {
    cancel (itemName) { // Leaves the edit mode of the item
      let itName = getItemName(this, itemName)
      if (this.config[itName].create) { // If new item being created, goes to the previous router view
        this.$router.go(-1)
      } else { // If editing a current page, leaves the edit mode of the component
        this.edit = !this.edit
      }
    },
    reset (itemName) { // Resets the form to the value of the initial value of the item
      let itName = getItemName(this, itemName)
      this.$refs[this.config[itName].formRefName].reset()
      this.formData[this.config[itName].formDataName] = dataToForm(this.config[itName].upsertMutation, this[itName])
    },
    upsert (itemName) {
      let itName = getItemName(this, itemName)
      this.$validator.validateAll().then((result) => {
        if (result) {
          let collectionQuery = this.config[itName].collectionQuery
          this.$apollo.mutate({
            mutation: this.config[itName].upsertMutation,
            variables: this.formData[this.config[itName].formDataName],
            update (store, updatedData) {
              // TODO create cache query when we just created an item i.e. when the colleciton query is  not existing?
              // TODO check if config.collectionQuery exists
              // TODO reload mode when saving a stage, or update module.stages in the cache?
              try {
                const data = store.readQuery({ query: collectionQuery }) // TODO sort by name
                let updatedNode = firstAttribute(updatedData.data, 2)
                let item = firstAttribute(data)
                let foundIndex = item.edges.findIndex((element) => {
                  return element.node.id === updatedNode.id
                })
                let newEdge = {
                  node: updatedNode,
                  __typename: `${updatedNode.__typename}Edge`
                }
                if (foundIndex > -1) {
                  item.edges.splice(foundIndex, 1, newEdge)
                } else {
                  item.edges.push(newEdge)
                }
                store.writeQuery({ query: collectionQuery, data })
              } catch (e) {
                // console.log('Update error')
              }
            }
          }).then((res) => {
            this[itName] = firstAttribute(res.data, 2)
            this.formData[this.config[itName].formDataName] = dataToForm(this.config[itName].upsertMutation, this[itName])
            this.edit = false
            if (this.$router.currentRoute.path.indexOf('create') > -1) { // TODO tricky as we can't guess for which item create param is for
              this.$router.replace({path: this.$router.currentRoute.path.replace('create', this[itName].id)})
            }
          }).catch((error) => {
            console.log('error in the upsert')
            console.error(error) // TODO handle errors
          })
        }
      })
    }
  }
}

export function itemManager (config) {
  let res = {}
  let itemName = config.itemName || config.singleQuery.definitions[0].selectionSet.selections[0].name.value
  res[itemName] = function () {
    let fullConfig = _.clone(config)
    fullConfig.itemName = config.itemName || config.singleQuery.definitions[0].selectionSet.selections[0].name.value
    fullConfig.formDataName = config.formDataName || fullConfig.itemName
    fullConfig.formRefName = config.formRefName || `${fullConfig.itemName}Form`
    fullConfig.paramKey = `${fullConfig.itemName}Id`
    return {
      query: fullConfig.singleQuery,
      variables () {
        return {
          id: this.$route.params[fullConfig.paramKey]
        }
      },
      update (data) {
        let item = firstAttribute(data)
        if (fullConfig.upsertMutation) {
          this.formData[fullConfig.formDataName] = dataToForm(fullConfig.upsertMutation, item)
        }
        return item
      },
      skip () {
        if (!_.has(this.config, itemName)) {
          this[itemName] = schemaToObject(fullConfig.singleQuery)
          fullConfig.create = !_.has(this.$route.params, fullConfig.paramKey)
          if (fullConfig.upsertMutation) {
            if (fullConfig.create) {
              Object.keys(this.$route.params).map((param) => {
                if (param.endsWith('Id') && param !== fullConfig.paramKey) {
                  this[itemName][param.slice(0, -2)].id = this.$route.params[param]
                }
              })
            }
            this.$set(this.formData, fullConfig.formDataName, dataToForm(fullConfig.upsertMutation, this[itemName]))
          }
          this.$set(this.config, itemName, fullConfig)
        }
        return fullConfig.create || !_.has(this.$route.params, fullConfig.paramKey) // TODO create as a router param as well?
      }
    }
  }
  return res
}

function getItemName (vm, data) {
  let firstEditable = Object.keys(vm.config).find((el) => {
    return vm.config[el].upsertMutation
  })
  return _.isString(data) ? data : firstEditable
}

function dataToForm (upsertMutation, data) {
  try {
    return upsertMutation.definitions[0].variableDefinitions
      .map((definition) => {
        return definition.variable.name.value
      })
      .reduce((node, field) => {
        let fieldData = null
        if (field.endsWith('Ids')) {
          fieldData = data[field.slice(0, -3)].edges.reduce((filtered, cursor) => {
            if (cursor.node.id) {
              filtered.push(cursor.node.id)
            }
            return filtered
          }, [])
        } else if (field.endsWith('Id')) {
          fieldData = data[field.slice(0, -2)].id
        } else {
          fieldData = data[field]
        }
        if (fieldData) { node[field] = fieldData }
        return node
      }, {})
  } catch (e) {
    console.log('Error in dataToForm')
    if (!upsertMutation) {
      console.log('No upsert mutation has been defined in the configuration')
    }
    return _.clone(data)
  }
}

function schemaToObject (schema, selections) {
  let sels = selections || schema.definitions[1].selectionSet.selections // TODO why 1?
  return sels.reduce((field, selection) => {
    if (selection.kind === 'Field') {
      field[selection.name.value] = selection.selectionSet ? schemaToObject(schema, selection.selectionSet.selections) : null
      return selection.name.value === 'node' ? [field] : field
    } else if (selection.kind === 'FragmentSpread') {
      let definition = schema.definitions.find(def => {
        return def.name.value === selection.name.value
      })
      return schemaToObject(schema, definition.selectionSet.selections)
    }
  }, {})
}
