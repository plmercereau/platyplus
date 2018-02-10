import * as types from '../store/mutation-types'
import _ from 'lodash'
import {QUEUE_SCHEDULE} from '../constants/settings'
import {firstAttribute} from '../utils'

const GraphQLHelper = {
  install (Vue, {store, apolloClient}) {
