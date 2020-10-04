<template>
  <b-form ref="form" @submit.stop.prevent="$emit('submit')">
    <b-form-group
      class="font-weight-bold"
      label="UserName"
      label-for="name-input"
      invalid-feedback="UserName is required"
    >
      <b-form-input id="name-input" v-model="userData.username" required />
    </b-form-group>
    <b-form-group
      class="font-weight-bold"
      :label="passwordLable"
      label-for="password-input"
      invalid-feedback="Password is required"
    >
      <b-form-input
        id="password-input"
        v-model="userData.password"
        type="password"
        :required="required"
      />
    </b-form-group>
    <b-button :id="action" class="mt-3" variant="success" block type="submit">
      {{ action }}
    </b-button>
  </b-form>
</template>
<script>
export default {
  props: {
    action: { type: String, default: "Add" },
    passwordLable: { type: String, default: "Password" },
    required: { type: Boolean, default: true },
    userData: {
      type: Object,
      default: function() {
        return {
          username: "",
          password: ""
        }
      }
    }
  },
  mounted() {
    this.action != "Add"
      ? ((this.passwordLable = "New Password"), (this.required = false))
      : this.passwordLable
  }
}
</script>
