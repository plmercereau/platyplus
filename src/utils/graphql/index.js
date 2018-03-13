import _ from 'lodash'
import {REFETCH_INTERVAL} from '../../config/settings'
import {DATA_ITEMS_CONFIG, TYPE_INTROSPECTION} from '../../config/queries'
import apolloClient from '../../plugins/apollo-client'

function itemManager (config) {
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
    if (!upsertMutation) console.log('No upsertForm mutation has been defined in the configuration')
    return _.clone(data)
  }
}

/**
 * Generates a Javascript object from the default upsertMutation of a configuration block, and fills the values with formData attributes
 * @param formData
 * @param itemName
 * @param upsertMutation
 * @param optimistic
  */
function formToData (formData, {itemName, upsertMutation}, optimistic = false) {
  return modelToObject({itemName, upsertMutation}).then((res) => {
    Object.keys(formData).map((attr) => {
      res[attr] = formData[attr]
    })
    if (optimistic) res['optimistic'] = optimistic
    return res
  })
}

/**
 * Converts a GraphQL mutation or query definition into a Javascript default object.
 * @param schema gql mutation or query definition
 * @param selections cursor for recursive call
 */
function schemaToObject (schema, selections = null) {
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

/**
 * Returns the first attribute of an object. rank allows to pick the first attribute of the first sub-object recursively
 * @param obj
 * @param rank
 * @returns {*}
 */
function firstAttribute (obj, rank = 1) {
  if (rank > 0) {
    return firstAttribute(obj[Object.keys(obj)[0]], rank - 1)
  }
  return obj
}

/**
 * GraphQL query that returns the introspection schema of one of the two params (itemName first, and if not given, typeName)
 * @param itemName if exists, instrospects the type '${ItemName}Node'
 * @param typeName if no itemName is given, introspects the typeName type
 * @returns {Promise<ApolloQueryResult<any>>}
 */
function itemIntrospection ({itemName, typeName}) {
  let name = itemName ? `${_.upperFirst(itemName)}Node` : typeName
  let introspectionQuery = TYPE_INTROSPECTION
  return apolloClient.query({
    query: introspectionQuery,
    variables: { name }
  })
}

/**
 * Asynchronously generates a Javascript object from the given itemName and upsertMutation of a given block.
 * If the upsertMutation exists, the selected attributes are restricted to the ones defined in the mutation
 * If no upsertMutation given, all attributes are selected recursively with the given depth
 * TODO chain promises
 * @param itemName
 * @param typeName
 * @param upsertMutation
 * @param depth
 * @param simpleMutationObject
 * @returns {Promise<ApolloQueryResult<any>>}
 */
function modelToObject ({itemName, typeName, upsertMutation}, depth = 3, simpleMutationObject = null) {
  let subSelection = upsertMutation ? schemaToObject(upsertMutation) : simpleMutationObject
  const MAX_DEPTH = 5
  if (depth > MAX_DEPTH) throw new Error('Requested depth is too high, exponential algorithm')
  const DEFAULT_VALUE = ''
  return itemIntrospection({itemName, typeName}).then((queryResult) => {
    let promises = []
    if (_.has(queryResult, 'data.__type.fields')) {
      promises = queryResult.data.__type.fields.map((field) => {
        if (!subSelection || _.has(subSelection, field.name)) {
          if (field.type.kind === 'OBJECT' && (subSelection || depth > 0)) {
            if (field.type.interfaces) {
              if (_.isEmpty(field.type.interfaces) && field.type.name.lastIndexOf('Connection') > 0) {
                // let nodeType = field.type.name.substring(0, field.type.name.lastIndexOf('Connection'))
                return {
                  [field.name]: {
                    __typename: field.type.name,
                    pageInfo: '',
                    edges: []
                  }}
                // return modelToObject({typeName: nodeType}, depth - 1, subSelection[field.name].edges[0].node).then((data) => {
                //   return {[field.name]: {
                //     __typename: field.type.name,
                //     pageInfo: '',
                //     edges: [{node: data}]
                //   }}
                // })
              } else {
                var found = field.type.interfaces.find((element) => { return element.name === 'Node' })
                if (found) {
                  return modelToObject({typeName: field.type.name}, depth - 1, subSelection[field.name]).then((data) => {
                    return {[field.name]: data}
                  })
                } else return {[field.name]: DEFAULT_VALUE}
              }
            }
          } else return {[field.name]: DEFAULT_VALUE}
        }
      })
    }
    return Promise.all(promises).then(result => {
      return {
        ...result.reduce((dest, curs) => {
          if (curs) dest[Object.keys(curs)[0]] = curs[Object.keys(curs)[0]]
          return dest
        }, {}),
        __typename: itemName ? `${_.upperFirst(itemName)}Node` : typeName
      }
    })
  })
}

function loadIntrospections () {
  Object.keys(DATA_ITEMS_CONFIG).map((el) => {
    itemIntrospection(DATA_ITEMS_CONFIG[el])
  })
}

function loadLists () {
  Object.keys(DATA_ITEMS_CONFIG).map((el) => {
    let config = DATA_ITEMS_CONFIG[el]
    if (config.collectionQuery) apolloClient.query({query: config.collectionQuery})
  })
}

function loadDefaultCache () {
  loadIntrospections()
  loadLists()
}

export {
  firstAttribute,
  stopInterval,
  startInterval,
  formToData,
  modelToObject,
  dataToForm,
  itemManager,
  getItemName,
  loadDefaultCache
}
