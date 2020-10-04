/* eslint-disable no-undef */
jest.mock("axios", () => ({
  $post: jest.fn(() =>
    Promise.resolve({
      success: true,
      token:
        "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsInJvbGVfaWQiOjEsImlhdCI6MTU4NTExMzQwOSwiZXhwIjoxNTg1NzE4MjA5fQ.2o-Tu7SwIC98cXz8d9tX8xgcPK4kJaLBoI9xoK7mYio",
      data: {
        username: "Admin"
      }
    })
  )
}))

import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
import BootstrapVue from "bootstrap-vue"
import { mount, createLocalVue } from "@vue/test-utils"
import Login from "@/pages/login.vue"
import Home from "@/pages/index.vue"
const localVue = createLocalVue()
localVue.use(BootstrapVue, Vuex)
Vue.use(Vuex)

describe("Login", () => {
  const $router = {
    push: jest.fn()
  }
  const $store = {
    state: { isAdmin: true, auth: { id: 1 } }
  }

  const wrapper = mount(Login, {
    attachToDocument: true,
    localVue,
    mocks: {
      $router,
      $store
    }
  })

  wrapper.vm.$axios = axios

  it("login", async () => {
    wrapper.setData({
      form: {
        id: null,
        username: "Admin",
        password: "admin",
        role_id: null
      }
    })
    expect(wrapper.vm.form).toEqual({
      id: null,
      username: "Admin",
      password: "admin",
      role_id: null
    })
    await wrapper.find('[id="loginButton"]').trigger("click")
    await wrapper.vm.$nextTick()
  })
})

describe("Home", () => {
  const wrapper = mount(Home, {
    attachToDocument: true,
    localVue
  })

  wrapper.vm.$axios = axios

  it("Home", async () => {
    expect(wrapper.html()).toBe(
      `<div class="container-fluid">
  <div class="row">
    <div class="col">
      <h1>Welcome</h1>
      <div class="col"></div>
    </div>
  </div>
</div>`
    )
  })
})
