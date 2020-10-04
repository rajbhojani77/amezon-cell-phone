/* eslint-disable no-undef */
jest.mock("axios", () => ({
  $get: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          id: 2,
          asin: "B0009N5L7K",
          brand: "Motorola2",
          title: "Motorola I265 phone",
          url: "https://www.amazon.com/Motorola-i265-I265-phone/dp/B0009N5L7K",
          image:
            "https://m.media-amazon.com/images/I/419WBAVDARL._AC_UY218_SEARCH213888_FMwebp_QL75_.jpg",
          rating: 2.9,
          reviewurl: "https://www.amazon.com/product-reviews/B0009N5L7K",
          totalreviews: 7,
          prices: "$ 49.99",
          createdat: "2020-02-16T09:36:26.275Z",
          inactive: false,
          updatedat: "2020-02-16T09:36:26.275Z"
        }
      ]
    })
  ),
  $post: jest.fn(() =>
    Promise.resolve({
      success: true,
      message: "Item added",
      data: {
        id: 2
      }
    })
  ),
  $put: jest.fn(() =>
    Promise.resolve({
      success: true,
      message: "Item Updated",
      data: {
        id: 2
      }
    })
  ),
  $delete: jest.fn(() =>
    Promise.resolve({
      success: true,
      message: "Item Deleted",
      data: {
        id: 2
      }
    })
  )
}))
import Vuex from "vuex"
import axios from "axios"
import BootstrapVue from "bootstrap-vue"
import { createLocalVue, mount } from "@vue/test-utils"
import items from "@/pages/items/index.vue"
import view from "@/pages/items/_view.vue"
import itemParent from "@/pages/items.vue"
import api from "@/plugins/api.js"
import toast from "@/plugins/toast.js"

const itemObj = {
  id: 2,
  asin: "B0009N5L7K",
  brand: "Motorola2",
  title: "Motorola I265 phone",
  url: "https://www.amazon.com/Motorola-i265-I265-phone/dp/B0009N5L7K",
  image:
    "https://m.media-amazon.com/images/I/419WBAVDARL._AC_UY218_SEARCH213888_FMwebp_QL75_.jpg",
  rating: 2.9,
  reviewurl: "https://www.amazon.com/product-reviews/B0009N5L7K",
  totalreviews: 7,
  prices: "$ 49.99",
  createdat: "2020-02-16T09:36:26.275Z",
  inactive: false,
  updatedat: "2020-02-16T09:36:26.275Z"
}

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
localVue.use(Vuex)

describe("items", () => {
  const $route = {
    query: { page_no: 1 }
  }
  const $store = {
    state: { isAdmin: true, auth: { id: 2 } }
  }
  const query = { page_no: 1 }

  const wrapper = mount(items, {
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
    const { items } = await wrapper.vm.$options.asyncData({ query, $axios })
    wrapper.vm.items = items
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.items).toEqual([itemObj])
    expect(axios.$get).toHaveBeenCalled()
    expect(axios.$get).toHaveBeenCalledTimes(1)
    expect(axios.$get).toHaveBeenCalledWith("api/items", { params: query })
  })

  it("Add Item", async () => {
    expect(wrapper.vm.itemData).toEqual({
      id: null,
      asin: "",
      brand: "",
      title: "",
      url: "",
      image: "",
      rating: 0,
      reviewurl: "",
      totalreviews: null,
      prices: "0.00"
    })
    await wrapper.find('[id="addItem"]').trigger("click")
    wrapper.setData({
      itemData: itemObj
    })
    expect(wrapper.vm.itemData).toEqual(itemObj)
    await wrapper.find('[id="Add"]').trigger("click")
    expect(axios.$post).toHaveBeenCalled()
    expect(axios.$post).toHaveBeenCalledTimes(1)
    expect(axios.$post).toHaveBeenCalledWith("api/items/add", null, {
      data: wrapper.vm.itemData
    })
  })

  it("Edit Item", async () => {
    wrapper.setData({
      itemData: itemObj
    })
    expect(wrapper.vm.itemData).toEqual(itemObj)
    await wrapper.find("#editItem").trigger("click")
    await wrapper.find('[id="Update"]').trigger("click")
    expect(axios.$put).toHaveBeenCalled()
    expect(axios.$put).toHaveBeenCalledTimes(1)
    expect(axios.$put).toHaveBeenCalledWith("api/items/2/edit", null, {
      data: wrapper.vm.itemData
    })
  })

  it("Add Review", async () => {
    wrapper.setData({
      itemData: itemObj
    })
    await wrapper.find("#addReview").trigger("click")
    wrapper.setData({
      reviewData: reviewObj
    })
    expect(wrapper.vm.reviewData).toEqual(reviewObj)
    await wrapper.find('[id="modalButton"]').trigger("click")
    expect(axios.$post).toHaveBeenCalled()
    expect(axios.$post).toHaveBeenCalledTimes(2)
    expect(axios.$post).toHaveBeenCalledWith("api/items/add", null, {
      data: wrapper.vm.itemData
    })
  })
  it("Delete Item", async () => {
    await wrapper.find('[id="deleteItem"]').trigger("click")
    await wrapper.find('[id="yes"]').trigger("click")
    expect(axios.$delete).toHaveBeenCalled()
    expect(axios.$delete).toHaveBeenCalledTimes(1)
    expect(axios.$delete).toHaveBeenCalledWith("api/items/2/delete")
  })
})
describe("view", () => {
  const $route = {
    params: { view: 1 }
  }
  const $store = {
    state: { isAdmin: true, auth: { id: 2 } }
  }
  const params = { view: 1 }

  const wrapper = mount(view, {
    attachToDocument: true,
    localVue,
    mocks: {
      $route,
      $store
    }
  })

  wrapper.vm.$axios = axios

  it("Get page data", async () => {
    let $axios = wrapper.vm.$axios
    $axios.$get = jest.fn(() =>
      Promise.resolve({
        data: {
          item: {
            id: 7,
            asin: "B001DZY4KI",
            brand: "Sony",
            title: "Sony Ericsson G700 Triband GSM Phone Bronze (Unlocked)",
            url:
              "https://www.amazon.com/Sony-Ericsson-Triband-Bronze-Unlocked/dp/B001DZY4KI",
            image:
              "https://m.media-amazon.com/images/I/51mL10InzcL._AC_UY218_SEARCH213888_FMwebp_QL75_.jpg",
            rating: 2,
            reviewurl: "https://www.amazon.com/product-reviews/B001DZY4KI",
            totalreviews: 1,
            prices: "$ 54.00",
            createdat: "2020-02-16T20:36:26.275Z",
            inactive: false,
            updatedat: "2020-02-16T20:36:26.275Z"
          },
          reviews: [
            {
              id: 80,
              item_id: 7,
              user_id: 80,
              rating: 2,
              date: "2011-05-07T18:30:00.000Z",
              verified: true,
              title: "Terrible Phone",
              body:
                "The phone itself just has software problems. My signal was not constant. It would fluctuate anywhere and anytime. The screen is nice and the phone is a nice small size. I really like the candy bar phone but it just did not function well. Very frustrating. Bought in 2008.",
              helpfulvotes: null,
              createdat: "2020-02-17T02:07:57.419Z",
              inactive: false,
              updatedat: "2020-02-17T02:07:57.419Z",
              username: "C. Lee"
            }
          ]
        }
      })
    )
    const { item, reviews } = await wrapper.vm.$options.asyncData({
      params,
      $axios
    })
    wrapper.vm.item = item
    wrapper.vm.reviews = reviews
    await wrapper.vm.$nextTick()
    expect(axios.$get).toHaveBeenCalled()
    expect(axios.$get).toHaveBeenCalledTimes(1)
    expect(axios.$get).toHaveBeenCalledWith("api/items/1")
  })
})
describe("view", () => {
  const $route = {
    params: { view: 1 }
  }
  const wrapper = mount(itemParent, {
    attachToDocument: true,
    localVue,
    mocks: {
      $route
    }
  })

  wrapper.vm.$axios = axios

  it("Get page data", async () => {
    expect(wrapper.html()).toBe(
      `<div>
  <nuxt-child></nuxt-child>
</div>`
    )
    expect(wrapper.contains("div")).toBe(true)
  })
})
