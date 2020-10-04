/* eslint-disable no-undef */
const userObj = {
  id: 2,
  username: "rajb",
  password: "",
  role_id: 2,
  createdat: "2020-02-17T13:06:25.854Z",
  inactive: false,
  updatedat: "2020-02-17T13:06:25.854Z"
}
jest.mock("axios", () => ({
  $get: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          id: 2,
          username: "rajb",
          password: "",
          role_id: 2,
          createdat: "2020-02-17T13:06:25.854Z",
          inactive: false,
          updatedat: "2020-02-17T13:06:25.854Z"
        }
      ]
    })
  ),
  $post: jest.fn(() =>
    Promise.resolve({
      success: true,
      message: "Reviewer added",
      data: {
        id: 2
      }
    })
  ),
  $put: jest.fn(() =>
    Promise.resolve({
      success: true,
      message: "Reviewer Updated",
      data: {
        id: 2
      }
    })
  ),
  $delete: jest.fn(() =>
    Promise.resolve({
      success: true,
      message: "Reviewer Deleted",
      data: {
        id: 2
      }
    })
  )
}))
import axios from "axios"
import BootstrapVue from "bootstrap-vue"
import { createLocalVue, mount } from "@vue/test-utils"
import Users from "@/pages/users"
import api from "@/plugins/api.js"
import toast from "@/plugins/toast.js"

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(api)
localVue.use(toast)
describe("users", () => {
  const $route = {
    query: { page_no: 1 }
  }
  const query = { page_no: 1 }

  const wrapper = mount(Users, {
    attachToDocument: true,
    localVue,
    mocks: {
      $route
    }
  })

  wrapper.vm.$axios = axios

  it("Get table data", async () => {
    let $axios = wrapper.vm.$axios
    const { users } = await wrapper.vm.$options.asyncData({ query, $axios })
    wrapper.vm.users = users
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.users).toEqual([userObj])
    expect(axios.$get).toHaveBeenCalled()
    expect(axios.$get).toHaveBeenCalledTimes(1)
    expect(axios.$get).toHaveBeenCalledWith("api/users", { params: query })
  })

  it("Add User", async () => {
    expect(wrapper.vm.userData).toEqual({
      id: null,
      username: "",
      password: ""
    })
    await wrapper.find('[id="addUser"]').trigger("click")
    expect(wrapper.vm.userData).toEqual({
      id: null,
      username: "",
      password: ""
    })
    wrapper.setData({
      userData: userObj
    })
    expect(wrapper.vm.userData).toEqual(userObj)
    await wrapper.find('[id="Add"]').trigger("click")
    expect(axios.$post).toHaveBeenCalled()
    expect(axios.$post).toHaveBeenCalledTimes(1)
    expect(axios.$post).toHaveBeenCalledWith("api/users/add", null, {
      data: wrapper.vm.userData
    })
  })

  it("Edit User", async () => {
    wrapper.setData({
      userData: userObj
    })
    expect(wrapper.vm.userData).toEqual(userObj)
    await wrapper.find("#editUser").trigger("click")
    await wrapper.find('[id="Update"]').trigger("click")
    expect(axios.$put).toHaveBeenCalled()
    expect(axios.$put).toHaveBeenCalledTimes(1)
    expect(axios.$put).toHaveBeenCalledWith("api/users/2/edit", null, {
      data: wrapper.vm.userData
    })
  })

  it("hide delete modal", async () => {
    await wrapper.find('[id="deleteUser"]').trigger("click")
    await wrapper.find('[id="no"]').trigger("click")
  })
  it("Delete User", async () => {
    await wrapper.find('[id="deleteUser"]').trigger("click")
    await wrapper.find('[id="yes"]').trigger("click")
    expect(axios.$delete).toHaveBeenCalled()
    expect(axios.$delete).toHaveBeenCalledTimes(1)
    expect(axios.$delete).toHaveBeenCalledWith("api/users/2/delete")
  })
})
