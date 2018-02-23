<template lang="pug">
  div
    h1 Login
    v-form
      v-text-field(id="login-imput",
        label="Username",
        v-model="username",
        required,
        @keyup.enter="login(username, password)",
        tabindex="1")
      v-text-field(id="login-password",
        label="Password",
        v-model="password",
        required,
        @keyup.enter="login(username, password)",
        type="password",
        tabindex="2")
    v-btn(@click="login(username, password)", tabindex="3") Login

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
