<template>
  <b-container fluid class="text-center">
    <b-form id="loginf" class="form-signin" @submit.stop.prevent="login">
      <b-img
        class="mb-4"
        src="https://pngimage.net/wp-content/uploads/2018/05/admin-login-images-png-4.png"
        alt=""
        width="72"
        height="72"
      />
      <h1 class="h3 mb-3 font-weight-normal">
        Please sign in
      </h1>
      <b-form-group id="userName" label-for="inputName">
        <b-form-input
          id="inputName"
          v-model="form.username"
          required
          placeholder="UserName"
          autofocus
        />
      </b-form-group>

      <b-form-group id="password" label-for="inputPassword">
        <b-form-input
          id="inputPassword"
          v-model="form.password"
          required
          placeholder="Password"
          type="password"
        />
      </b-form-group>
      <b-button id="loginButton" block lg="4" variant="primary" type="submit">
        Sign in
      </b-button>
    </b-form>
  </b-container>
</template>

<script>
export default {
  layout: "login",
  middleware: "authenticated",
  data() {
    return {
      form: {
        id: null,
        username: "",
        password: "",
        role_id: null
      },
      error: null
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch("login", {
          username: this.form.username,
          password: this.form.password
        })
      } catch (e) {
        this.error = e.message
      }
    }
  }
}
</script>

<style>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-control:focus {
  z-index: 2;
}

.form-signin input {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
