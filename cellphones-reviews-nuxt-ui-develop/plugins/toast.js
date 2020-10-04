import Vue from "vue"
Vue.mixin({
  methods: {
    addAlert(message = null) {
      this.$bvToast.toast(`${message}`, {
        title: ` `,
        variant: "success",
        toaster: "b-toaster-bottom-right",
        solid: true,
        appendToast: true
      })
    },
    updateAlert(message = null) {
      this.$bvToast.toast(`${message}`, {
        title: ``,
        variant: "success",
        toaster: "b-toaster-bottom-right",
        solid: true,
        appendToast: true
      })
    },
    deleteAlert(message = null) {
      this.$bvToast.toast(`${message}`, {
        title: ``,
        variant: "danger",
        toaster: "b-toaster-bottom-right",
        solid: true,
        appendToast: true
      })
    }
  }
})
