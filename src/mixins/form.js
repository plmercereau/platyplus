import _ from 'lodash'
import {firstAttribute} from '../utils'

export const formMixin = {
  props: {
    create: Boolean // available from the url through vue-router config
    // TODO set the tab as a param sent through the router?
  },
  data () {
    return {
      form: {}, // value of the form of the module element
      formModel: {},
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
      this.form = dataToForm(this.itemData, this.formModel)
    },
    _upsert (upsertMutation, collectionQuery) { // TODO debugger
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$apollo.mutate({
            mutation: upsertMutation,
            variables: this.form,
            update (store, updatedData) {
              // TODO create cache query when we just created a module i.e. when the colleciton query is  not existing?
              // TODO to be clean, check if collectionQuery exists
              try {
                const data = store.readQuery({ // TODO sort by name
                  query: collectionQuery
                })
                let item = firstAttribute(data)
                let updatedNode = firstAttribute(updatedData.data, 2)
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
                store.writeQuery({
                  query: collectionQuery,
                  data
                })
              } catch (e) {
                // console.log('Update error')
              }
            }
          }).then((res) => {
            this.itemData = firstAttribute(res.data, 2)
            this.form = dataToForm(this.itemData, this.formModel)
            this.edit = false
            const createStrIndex = this.$router.currentRoute.path.indexOf('create')
            if (createStrIndex > -1) {
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

export function singleQuery (query) {
  return {
    query: query,
    variables () {
      return {
        id: this.$route.params.id
      }
    },
    update (data) {
      let item = firstAttribute(data)
      this.form = dataToForm(item, this.formModel)
      return item
    },
    skip () {
      return (this.create)
    }
  }
}

export const stageFormModel = {
  fields: ['id', 'name', 'shortDescription'],
  foreignKeys: ['module'], // TODO developper pour pouvoir faire un algo formModelToData recursif
  collections: ['nextStages']
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

export function dataToForm (data, formModel) {
  try {
    let result = _.pick(data, formModel.fields)
    formModel.foreignKeys.map((fk) => {
      result[`${fk}Id`] = data[fk].id
    })
    formModel.collections.map((collection) => {
      result[`${collection}Ids`] = data[collection].edges.map(el => {
        return el.node.id
      })
    })
    return result
  } catch (e) {
    return _.clone(data)
  }
}

export function formModelToData (formModel) {
  try {
    let result = {}
    formModel.fields.map((field) => {
      result[field] = ''
    })
    formModel.foreignKeys.map((fk) => {
      result[fk] = {
        id: ''
      }
    })
    formModel.collections.map((collection) => {
      result[collection] = {
        edges: []
      }
    })
    return result
  } catch (e) {
    return {}
  }
}
