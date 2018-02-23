import _ from 'lodash'
import {firstAttribute} from '../utils'
import {REFETCH_ATTEMPS, REFETCH_INTERVAL} from '../constants/settings'

export const dataItemMixin = {
  props: {
    create: Boolean // available from the url through vue-router config
  },
  data () {
    return {
      loading: 0,
      config: [],
      formData: [],
      edit: this.create // edit mode: turns on/off the forms inputs
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
      this.$set(this.formData, this.config[itName].formDataName, dataToForm(this[itName], this.config[itName]))
    },
    upsertForm (itemName) {
      let itName = getItemName(this, itemName)
      this.$validator.validateAll().then((result) => {
        if (result) {
          this[itName] = formToData(this.formData[itName], this.config[itName], true) // Optimistic rendering
          this.upsertMutation(this.formData[this.config[itName].formDataName], this.config[itName]).then((res) => {
            this[itName] = firstAttribute(res.data, 2)
            this.$set(this.formData, this.config[itName].formDataName, dataToForm(this[itName], this.config[itName]))
            if (this.formData[itName].id) {
              this.$router.replace({path: this.$router.currentRoute.path.replace('create', this[itName].id)})
            }
          }).catch(() => {
            // console.log('error in the upsert')
          })
          this.edit = false
        }
      })
    },
    refetch (itemName, immediate = true) {
      let itName = getItemName(this, itemName)
      if ((REFETCH_ATTEMPS === -1) || ((this.config[itName].intervalCount || 0) < REFETCH_ATTEMPS)) {
        this.loading += 1
        this.config[itName].intervalCount = (this.config[itName].intervalCount || 0) + 1
        if (immediate || this.config[itName].intervalCount > 0) {
          this.$apollo.queries[itName].refetch().then((res) => {
            this[itName] = Object.assign({}, this[itName], res.data[itName])
            if (this.config[itName].upsertMutation) this.$set(this.formData, this.config[itName].formDataName, dataToForm(this[itName], this.config[itName]))
            stopInterval(this, itName)
            this.$set(this.config[itName], 'serverError', false)
          })
        }
      } else {
        if (this.config[itName].interval) {
          stopInterval(this, itName)
          this.$set(this.config[itName], 'serverError', true)
        }
      }
    },
    refetchAll () {
      Object.keys(this.config).map((el) => {
        startInterval(this, this.refetch, this.config[el].itemName)
      })
    }
  },
  computed: {
    status () { // TODO status management in another mixin?
      if (this.loading) return 'loading'
      if (Object.keys(this.config).find((el) => {
        return this.config[el].serverError
      })) return 'error'
      return 'ok'
    }
  }
}

export function itemManager (config) {
  let itemName = config.itemName || config.singleQuery.definitions[0].selectionSet.selections[0].name.value
  return function () {
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
          this.$set(this.formData, fullConfig.formDataName, dataToForm(item, fullConfig))
        }
        return item
      },
      skip () {
        if (!_.has(this.config, itemName)) {
          this[itemName] = Object.assign({}, this[itemName], schemaToObject(fullConfig.singleQuery))
          this.$set(this[itemName], '__typename', `${_.upperFirst(itemName)}Node`)
          fullConfig.create = !_.has(this.$route.params, fullConfig.paramKey)
          this.$set(this.config, itemName, fullConfig)
          if (fullConfig.upsertMutation) {
            if (fullConfig.create) {
              Object.keys(this.$route.params).map((param) => {
                if (param.endsWith('Id') && param !== fullConfig.paramKey) {
                  this[itemName][param.slice(0, -2)].id = this.$route.params[param]
                }
              })
            }
            this.$set(this.formData, fullConfig.formDataName, dataToForm(this[itemName], fullConfig))
          }
        }
        return fullConfig.create || !_.has(this.$route.params, fullConfig.paramKey) // TODO create as a router param as well?
      },
      error (error) {
        if (error.networkError) {
          // console.log('networkerror, starting refetch...')
          startInterval(this, this.refetch, itemName)
        } else console.log(`Error of type ${error.name}`)
      }
    }
  }
}

function getItemName (vm, data) {
  let firstEditable = Object.keys(vm.config).find((el) => {
    return vm.config[el].upsertMutation // TODO why editables only?
  })
  return _.isString(data) ? data : firstEditable
}

function dataToForm (data, {upsertMutation}) {
  try {
    return upsertMutation.definitions[0].variableDefinitions
      .map((definition) => {
        return definition.variable.name.value
      })
      .reduce((node, field) => {
        let fieldData = null
        if (field.endsWith('Ids')) {
          fieldData = data[field.slice(0, -3)]['edges'].reduce((filtered, cursor) => {
            if (cursor.node.id) filtered.push(cursor.node.id)
            return filtered
          }, [])
        } else if (field.endsWith('Id')) fieldData = data[field.slice(0, -2)].id
        else fieldData = data[field]
        if (fieldData) node[field] = fieldData
        return node
      }, {})
  } catch (e) {
    // console.log('Error in dataToForm')
    if (!upsertMutation) console.log('No upsertForm mutation has been defined in the configuration')
    return _.clone(data)
  }
}

export function formToData (formData, {singleQuery, itemName}, optimistic = false) {
  let res = schemaToObject(singleQuery)
  // TODO complete with __typename etc.
  Object.keys(formData).map((attr) => {
    res[attr] = formData[attr]
  })
  res['optimistic'] = optimistic
  res['__typename'] = `${_.upperFirst(itemName)}Node` // TODO crafty
  return res
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

function startInterval (vm, func, itemName) { // TODO convert itemName into generic params of func
  func(itemName, false)
  vm.config[itemName].interval = setInterval(function () {
    func(itemName)
  }, REFETCH_INTERVAL)
}

function stopInterval (vm, itemName) {
  let itName = getItemName(vm, itemName)
  clearInterval(vm.config[itName].interval)
  vm.config[itName].interval = 0
  vm.loading -= vm.config[itName].intervalCount
  vm.config[itName].intervalCount = 0
}
