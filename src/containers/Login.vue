<template lang="pug">
  div
    h1 Login
    v-text-field(id="login-imput", label="Username", v-model="username", required)
    v-text-field(id="login-password", label="Password", v-model="password", required, type="password")
    v-btn(@click="login(username, password)") Login

    div {{ loginError }}
</template>

<script>
  export default {
    name: 'sandbox',
    data () {
      return {
        username: '', // TODO name the form fields so we don't get default values from the browser
        password: '',
        loginError: '' // TODO
      }
    }
  }
</script>

<style scoped>

</style>
