<template>
  <b-container fluid>
    <b-row class="float-right mb-3 mr-auto">
      <b-button
        v-if="$store.state.isAdmin"
        id="addItem"
        v-b-modal.add
        variant="primary"
      >
        Add Item
      </b-button>
    </b-row>
    <div class="table-responsive">
      <b-table
        id="mytable"
        class="text-center"
        bordered
        :items="items"
        :fields="fields"
      >
        <template v-slot:cell(asin)="row">
          <nuxt-link :to="'items/' + row.item.id">
            {{ row.item.asin }}
          </nuxt-link>
        </template>
        <template v-slot:cell(actions)="row">
          <b-button
            id="addReview"
            v-b-modal.addReview
            variant="secondary"
            @click="addReview(row.item)"
          >
            Review
          </b-button>
          <b-button
            v-if="$store.state.isAdmin"
            id="editItem"
            v-b-modal.edit
            variant="secondary"
            @click="updateItem(row.item)"
          >
            Edit
          </b-button>
          <b-button
            v-if="$store.state.isAdmin"
            id="deleteItem"
            v-b-modal.delete
            variant="danger"
            @click="deleteId(row.item.id)"
          >
            Delete
          </b-button>
        </template>
      </b-table>
      <b-pagination-nav
        :link-gen="linkGen"
        :number-of-pages="10"
        align="center"
        class="mt-3"
      />
    </div>

    <div>
      <b-modal
        id="add"
        ref="add"
        :static="true"
        hide-footer
        title="Add Item"
        @hidden="resetModal"
      >
        <iform :item-data="itemData" :action="'Add'" @submit="handleAdd" />
      </b-modal>
    </div>

    <div>
      <b-modal
        id="edit"
        ref="edit"
        :static="true"
        hide-footer
        title="Update Item"
        @hidden="resetModal"
      >
        <iform
          :item-data="itemData"
          :action="'Update'"
          @submit="handleUpdate"
        />
      </b-modal>
    </div>

    <div>
      <deletemodal :static="true" :name="'Item'" @ondelete="handleDelete" />
    </div>
    <div>
      <b-modal
        id="addReview"
        ref="addReview"
        :static="true"
        hide-footer
        title="Add Review"
        @hidden="resetModal"
      >
        <rform
          :review-data="reviewData"
          :action="'addReview'"
          @submit="handleAddReview"
        />
      </b-modal>
    </div>
  </b-container>
</template>

<script>
import iform from "@/components/ItemForm"
import rform from "@/components/ReviewForm"
import deletemodal from "@/components/DeleteModal"

const fields = [
  "asin",
  "brand",
  "rating",
  "prices",
  { key: "actions", label: "Actions" }
]
export default {
  components: {
    iform,
    rform,
    deletemodal
  },
  async asyncData({ query, $axios, error }) {
    let page_no = query.page_no
    let items
    await $axios
      .$get("api/items", { params: { page_no } })
      .then(res => {
        items = res.data
      })
      .catch(e => {
        error({ statusCode: e.response.statusCode, message: e.message })
      })
    return { items }
  },
  data() {
    return {
      items: [],
      fields: fields,
      itemData: {
        id: null,
        asin: "",
        brand: "",
        title: "",
        url: "",
        image: "",
        rating: 0,
        reviewurl: "",
        totalreviews: null,
        prices: ""
      },
      reviewData: {},
      error: null
    }
  },
  methods: {
    resetModal() {
      this.itemData = {}
    },
    async handleAdd() {
      let item = this.itemData
      item.prices = "$ " + item.prices
      await this.add("items", item).then(res => {
        this.items = res
      })
    },
    async handleUpdate() {
      let item = this.itemData
      item.prices = "$ " + item.prices
      await this.update("items", item).then(res => {
        this.items = res
      })
    },
    async handleDelete() {
      let id = this.itemData.id
      await this.deleteR("items", id).then(res => {
        this.items = res
      })
    },
    async handleAddReview() {
      let review = this.reviewData
      await this.$axios
        .$post("api/reviews/add", null, { data: review })
        .then(res => {
          this.$refs["addReview"].hide()
          this.addAlert(res.message)
        })
        .then(this.loadData)
        .catch(error => {
          this.$refs["addReview"].hide()
          if (error.response && error.response.status === 401) {
            throw new Error("Unauthorized")
          }
          throw error
        })
    },
    updateItem(item) {
      let temp = {}
      Object.assign(temp, item)
      this.itemData = temp
    },
    deleteId(id) {
      this.itemData.id = id
    },
    linkGen(pageNum) {
      return pageNum === 1 ? "?" : `?page_no=${pageNum}`
    },
    addReview(item) {
      this.reviewData.item_id = item.id
      this.reviewData.user_id = this.$store.state.auth.id
    }
  }
}
</script>

<style></style>
