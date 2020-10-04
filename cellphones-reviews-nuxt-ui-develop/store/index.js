const cookieparser = process.server ? require("cookieparser") : undefined
var jwtDecode = require("jwt-decode")

export const state = () => ({
  auth: null,
  isAdmin: false
})

export const mutations = {
  setAuth(state, user) {
    if (user) {
      var decoded = jwtDecode(user)
      state.auth = decoded
      state.isAdmin = Boolean(state.auth.role_id == 1)
    } else {
      state.auth = null
    }
  }
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    let auth = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        auth = parsed.jwt ? "JWT " + parsed.jwt : null
      } catch (err) {
        auth = null
      }
    }
    commit("setAuth", auth)
  },
  async login({ commit }, { username, password }) {
    await this.$axios
      .$post("api/users/login", {
        username,
        password
      })
      .then(res => {
        console.log(res.token)
        commit("setAuth", res.token)
        this.$router.push("/")
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          throw new Error("Bad credentials")
        }
        throw error
      })
  },

  async logout({ commit }) {
    await this.$axios.$get("api/users/logout")
    commit("setAuth", null)
    this.$router.push("/login")
  }
}
