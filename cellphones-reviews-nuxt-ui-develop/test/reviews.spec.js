/* eslint-disable no-undef */
jest.mock("axios", () => ({
  $get: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          id: 80,
          item_id: 6,
          user_id: 77,
          rating: 2,
          date: "2012-08-01T18:30:00.000Z",
          verified: true,
          title: "a bad choice",
          body: "Its a nice pahone only if it worked p",
          helpfulvotes: 1,
          createdat: "2020-02-16T09:37:57.418Z",
          inactive: false,
          updatedat: "2020-02-16T09:37:57.418Z",
          username: "elephant"
        }
      ]
    })
  ),
  $put: jest.fn(() =>
    Promise.resolve({
      success: true,
      message: "Review Updated",
      data: {
        id: 2
      }
    })
  ),
  $delete: jest.fn(() =>
    Promise.resolve({
      success: true,
      message: "Review Deleted",
      data: {
        id: 2
      }
    })
  )
}))
import axios from "axios"
import BootstrapVue from "bootstrap-vue"
import { createLocalVue, mount } from "@vue/test-utils"
import Reviews from "@/pages/reviews"
import api from "@/plugins/api.js"
import toast from "@/plugins/toast.js"
import BreadCrumb from "@/components/BreadCrumb.vue"

const reviewObj = {
  id: 80,
  item_id: 6,
  user_id: 77,
  rating: 2,
  date: "2012-08-01T18:30:00.000Z",
  verified: true,
  title: "a bad choice",
  body: "Its a nice pahone only if it worked p",
  helpfulvotes: 1,
  createdat: "2020-02-16T09:37:57.418Z",
  inactive: false,
  updatedat: "2020-02-16T09:37:57.418Z",
  username: "elephant"
}

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(api)
localVue.use(toast)
localVue.use(BreadCrumb)
describe("Reviews", () => {
  const $route = {
    query: { page_no: 1 }
  }
  const $store = {
    state: { isAdmin: true }
  }
  const query = { page_no: 1 }

  const wrapper = mount(Reviews, {
    attachToDocument: true,
    localVue,
    mocks: {
      $route,
      $store
    }
  })

  wrapper.vm.$axios = axios

  it("Get table data", async () => {
    let $axios = wrapper.vm.$axios
    const { reviews } = await wrapper.vm.$options.asyncData({ query, $axios })
    wrapper.vm.reviews = reviews
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.reviews).toEqual([reviewObj])
    expect(axios.$get).toHaveBeenCalled()
    expect(axios.$get).toHaveBeenCalledTimes(1)
    expect(axios.$get).toHaveBeenCalledWith("api/reviews", { params: query })
  })

  it("Edit Review", async () => {
    wrapper.setData({
      reviewData: reviewObj
    })
    expect(wrapper.vm.reviewData).toEqual(reviewObj)
    await wrapper.find("#editReview").trigger("click")
    await wrapper.find('[id="modalButton"]').trigger("click")
    expect(axios.$put).toHaveBeenCalled()
    expect(axios.$put).toHaveBeenCalledTimes(1)
    expect(axios.$put).toHaveBeenCalledWith("api/reviews/80/edit", null, {
      data: wrapper.vm.reviewData
    })
  })
  it("Delete Review", async () => {
    await wrapper.find('[id="deleteReview"]').trigger("click")
    await wrapper.find('[id="yes"]').trigger("click")
    expect(axios.$delete).toHaveBeenCalled()
    expect(axios.$delete).toHaveBeenCalledTimes(1)
    expect(axios.$delete).toHaveBeenCalledWith("api/reviews/80/delete")
  })
})
