<template lang="pug">
  div
    h1 Login
    v-text-field(id="login-imput", label="Username", v-model="username", required)
    v-text-field(id="login-password", label="Password", v-model="password", required, type="password")
    v-btn(@click="login") Login

    div {{ loginError }}
</template>

<script>
  import {SIGNIN_USER_MUTATION} from '../constants/graphql'
  import {AUTH_TOKEN, USER_ID} from '../constants/settings'
  export default {
    name: 'sandbox',
    data () {
      return {
        username: '', // TODO name the form fields so we don't get default values from the browser
        password: '',
        loginError: ''
      }
    },
    methods: {
      login () { // TODO move to plugin/mixin
        this.$apollo.mutate({
          mutation: SIGNIN_USER_MUTATION,
          variables: {
            username: this.username,
            password: this.password
          }
        }).then(({data}) => {
          localStorage.setItem(AUTH_TOKEN, data.login.token)
          localStorage.setItem(USER_ID, data.login.user.id)
          this.$root.$data.gqlUserId = localStorage.getItem(USER_ID)
          this.$router.push({path: '/'})
        }).catch((e) => {
          this.loginError = e
        })
      }
    }
  }
</script>

<style scoped>

</style>
