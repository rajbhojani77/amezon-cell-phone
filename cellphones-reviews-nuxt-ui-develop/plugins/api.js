import Vue from "vue"
Vue.mixin({
  methods: {
    async loadData(endpoint) {
      let page_no = this.$route.query.page_no
      let response = []
      await this.$axios
        .$get("api/" + endpoint, { params: { page_no } })
        .then(res => {
          response = res.data
        })
        .catch(e => {
          this.error = e.message
        })
      return response
    },
    async add(endpoint, data) {
      await this.$axios
        .$post("api/" + endpoint + "/add", null, { data: data })
        .then(res => {
          this.$refs["add"].hide()
          this.addAlert(res.message)
        })
        .catch(error => {
          this.$refs["add"].hide()
          if (error.response && error.response.status === 401) {
            throw new Error("Unauthorized")
          }
          throw error
        })
      return this.loadData(endpoint)
    },
    async update(endpoint, data) {
      await this.$axios
        .$put("api/" + endpoint + "/" + data.id + "/edit", null, { data: data })
        .then(res => {
          this.$refs["edit"].hide()
          this.updateAlert(res.message)
        })
        .catch(error => {
          this.$refs["edit"].hide()
          if (error.response && error.response.status === 401) {
            throw new Error("Unauthorized")
          }
          throw error
        })
      return this.loadData(endpoint)
    },
    async deleteR(endpoint, id) {
      await this.$axios
        .$delete("api/" + endpoint + "/" + id + "/delete")
        .then(res => this.deleteAlert(res.message))
        .catch(error => {
          if (error.response && error.response.status === 401) {
            throw new Error("Unauthorized")
          }
          throw error
        })
      return this.loadData(endpoint)
    }
  }
})
