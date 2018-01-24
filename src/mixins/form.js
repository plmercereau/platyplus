import _ from 'lodash'
import {firstAttribute} from '../utils'

export const formMixin = {
  props: {
    create: Boolean // available from the url through vue-router config
    // TODO set the tab as a param sent through the router?
  },
  data () {
    return {
      config: {},
      itemData: {},
      form: {}, // value of the form of the module element
      edit: this.create // edit mode: turns on/off the form inputs
    }
  },
  methods: {
    cancel () { // Leaves the edit mode of the module
      if (this.create) { // If new module being created, goes to the previous router view
        this.$router.go(-1)
      } else { // If editing an existing module, leaves the edit mode of the component
        this.edit = !this.edit
      }
    },
    reset () { // Resets the form to the value of the initial value of the module
      this.$refs.form.reset() // TODO check how useful it is
      this.form = dataToForm(this.itemData, this.config.upsertMutation)
    },
    upsert () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let collectionQuery = this.config.collectionQuery
          this.$apollo.mutate({
            mutation: this.config.upsertMutation,
            variables: this.form,
            update (store, updatedData) {
              // TODO create cache query when we just created a module i.e. when the colleciton query is  not existing?
              // TODO to be clean, check if _collectionQuery exists
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
            this.itemData = firstAttribute(res.data, 2)
            this.form = dataToForm(this.itemData, this.config.upsertMutation)
            this.edit = false
            if (this.$router.currentRoute.path.indexOf('create') > -1) {
              this.$router.replace({path: this.$router.currentRoute.path.replace('create', this.itemData.id)})
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

export function singleQuery (singleQuery) {
  return {
    // query: this.config.singleQuery, // TODO not working: pain in the...
    query: singleQuery,
    variables () {
      return {
        id: this.$route.params.id
      }
    },
    update (data) {
      let item = firstAttribute(data)
      this.form = dataToForm(item, this.config.upsertMutation)
      return item
    },
    skip () {
      return (this.create)
    }
  }
}

export function loadConfig (vm, config) {
  Object.keys(config).map((key) => {
    vm.$set(vm.config, key, config[key])
  })
  vm.itemData = schemaToObject(config.singleQuery)
}

export function dataToForm (data, upsertMutation) {
  try {
    return upsertMutation.definitions[0].variableDefinitions
      .map((definition) => {
        return definition.variable.name.value
      })
      .reduce((node, field) => {
        if (field.endsWith('Ids')) {
          node[field] = data[field.slice(0, -3)].edges.map(el => {
            return el.node.id
          })
        } else if (field.endsWith('Id')) {
          node[field] = data[field.slice(0, -2)].id
        } else {
          node[field] = data[field]
        }
        return node
      }, {})
  } catch (e) {
    return _.clone(data)
  }
}

export function schemaToObject (schema, selections) {
  let sels = selections || schema.definitions[1].selectionSet.selections
  return sels.reduce((field, selection) => {
    if (selection.kind === 'Field') {
      field[selection.name.value] = selection.selectionSet ? schemaToObject(schema, selection.selectionSet.selections) : null
      return selection.name.value === 'edges' ? [field] : field
    } else if (selection.kind === 'FragmentSpread') {
      let definition = schema.definitions.find(def => {
        return def.name.value === selection.name.value
      })
      return schemaToObject(schema, definition.selectionSet.selections)
    }
  }, {})
}
