import {firstAttribute, getItemName, formToData, dataToForm, startInterval, stopInterval} from '../utils/graphql'
import {REFETCH_ATTEMPS} from '../config'

export const dataItemMixin = {
  props: {
    create: Boolean // available from the url through vue-router config
  },
  data () {
    return {
      loading: 0,
      config: {},
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
          formToData(this.formData[itName], this.config[itName], true).then((res) => {
            Object.assign({}, this[itName], res)
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
          })
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
