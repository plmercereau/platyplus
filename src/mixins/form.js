import _ from 'lodash'
import {firstAttribute} from '../utils'

export const formMixin = {
  props: {
    create: Boolean // available from the url through vue-router config
    // TODO set the tab as a param sent through the router?
  },
  data () {
    return {
      _upsertMutation: '',
      _collectionQuery: '',
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
      this.form = dataToForm(this.itemData, this._upsertMutation)
    },
    upsert () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let collectionQuery = this._collectionQuery // this._collectionQuery is not accessible inside the update function
          this.$apollo.mutate({
            mutation: this._upsertMutation,
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
            this.form = dataToForm(this.itemData, this._upsertMutation)
            this.edit = false
            if (this.$router.currentRoute.path.indexOf('create') > -1) {
              this.$router.replace({path: this.$router.currentRoute.path.replace('create', this.itemData.id)})
            }
          }).catch((error) => {
            console.log('error in the upsert')
            console.error(error) // TODO handle errors
          })
        } else {
          // alert('form is not valid')
        }
      }).catch((error) => {
        console.log('error in the validation')
        console.log(error)
      })
    }
  }
}

export function singleQuery (singleQuery, upsertMutation, collectionQuery) {
  return {
    query: singleQuery,
    variables () {
      return {
        id: this.$route.params.id
      }
    },
    update (data) {
      let item = firstAttribute(data)
      this._upsertMutation = upsertMutation
      this._collectionQuery = collectionQuery
      this.form = dataToForm(item, upsertMutation)
      return item
    },
    skip () {
      return (this.create)
    }
  }
}

export const moduleData = { // TODO create from GQL query or from FormModel
  stages: {}
}

export const stageData = { // TODO create from GQL query or from FormModel
  module: {
    name: '',
    stages: {
      edges: []
    }
  },
  nextStages: {}
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
