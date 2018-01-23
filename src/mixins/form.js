import _ from 'lodash'

export const formMixin = {
  props: {
    create: Boolean // available from the url through vue-router config
    // TODO set the tab as a param sent through the router?
  },
  data () {
    return {
      form: {}, // value of the form of the module element
      edit: this.create // edit mode: turns on/off the form inputs
    }
  },
  computed: {
    upsertName () {
      return _.get(this.upsert_mutation, `definitions[0].selectionSet.selections[0].name.value`)
    },
    collectionName () {
      return _.get(this.all_items_query, `definitions[0].selectionSet.selections[0].name.value`) || `${this.itemName}s`
    },
    itemName () {
      return _.get(this.upsert_mutation, `definitions[0].selectionSet.selections[0].selectionSet.selections[0].name.value`)
    },
    parentName () {
      return _.get(this.single_item_query, `definitions[0].selectionSet.selections[0].name.value`)
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
      this.form = _.cloneDeep(this.itemData)
    },
    _upsert (update) {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$apollo.mutate({
            mutation: this.upsert_mutation,
            variables: this.form,
            update: update
          }).then((res) => {
            this.itemData = _.get(res, `data.${this.upsertName}.${this.itemName}`)
            this.form = _.cloneDeep(this.itemData)
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
    },
    _updateParentCollection (store, updatedData) { // TODO DRY
      // TODO create cache query when we just created a module
      try {
        const data = store.readQuery({ // TODO sort by name
          query: this.all_items_query
        })
        let foundIndex = data[this.collectionName].edges.findIndex((element) => {
          return element.node.id === _.get(updatedData.data, `${this.upsertName}.${this.itemName}.id`)
        })
        let newEdge = {
          node: updatedData.data[this.upsertName][this.itemName],
          __typename: `${_.capitalize(this.itemName)}NodeEdge` // TODO automatize, as well as the ModuleNode in the gql query
        }
        if (foundIndex > -1) {
          data[this.collectionName].edges.splice(foundIndex, 1, newEdge)
        } else {
          data[this.collectionName].edges.push(newEdge)
        }
        store.writeQuery({
          query: this.all_items_query,
          data
        })
      } catch (e) {
        // main error caught: ALL_MODULES_QUERY has not been created yet in the store
        // TODO create the list query if not existing?
        console.log(e)
      }
    },
    _updateSingleItem (store, initialData) { // TODO: DRY
      try {
        const data = store.readQuery({
          query: this.single_item_query,
          variables: {
            id: this.parent.id
          }
        })
        let foundIndex = this.parent[this.collectionName].edges.findIndex((element) => {
          return element.node.id === initialData.data[this.upsertName][this.itemName].id
        })
        let newEdge = {
          node: initialData.data[this.upsertName][this.itemName],
          __typename: `${_.capitalize(this.itemName)}NodeEdge` // TODO automatize, as well as the ModuleNode in the gql query
        }
        if (foundIndex > -1) {
          data[this.parentName][this.collectionName].edges.splice(foundIndex, 1, newEdge)
        } else {
          data[this.parentName][this.collectionName].edges.push(newEdge)
        }
        store.writeQuery({
          query: this.single_item_query,
          data
        })
      } catch (e) {
        // main error caught: ALL_MODULES_QUERY has not been created yet in the store
        // TODO create the list query if not existing?
        console.log(e)
      }
    }
  }
}
