<template>
  <b-container fluid>
    <b-row class="m-4" />
    <div class="table-responsive">
      <b-table
        id="mytable"
        class="text-center"
        bordered
        :items="reviews"
        :fields="fields"
      >
        <template v-slot:cell(actions)="row">
          <b-button
            id="viewReview"
            v-b-modal.view
            variant="primary"
            @click="view(row.item)"
          >
            view
          </b-button>
          <b-button
            v-if="$store.state.isAdmin"
            id="editReview"
            v-b-modal.edit
            variant="secondary"
            @click="updateReview(row.item)"
          >
            Edit
          </b-button>
          <b-button
            v-if="$store.state.isAdmin"
            id="deleteReview"
            v-b-modal.delete
            variant="danger"
            @click="deleteReview(row.item.id)"
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
    <b-modal
      id="view"
      ref="view"
      hide-footer
      scrollable
      :title="reviewData.title"
      @hidden="resetModal"
    >
      <b-row>
        <b-col cols="12">
          <p>
            <strong>Isverified: </strong><span>{{ reviewData.verified }}</span>
          </p>
          <p>
            <strong>HelpfullVotes:</strong>
            <span>{{ reviewData.helpfulvotes }}</span>
          </p>
          <div class="clearfix" />
          <p>{{ reviewData.body }}</p>
          <p>
            <strong>By </strong><span>{{ reviewData.username }}</span>
            <strong> on </strong><span>{{ reviewData.date }}</span>
          </p>
        </b-col>
      </b-row>
    </b-modal>
    <div>
      <deletemodal :name="'Review'" @ondelete="handleDelete" />
    </div>
    <div>
      <b-modal
        id="edit"
        ref="edit"
        :static="true"
        hide-footer
        title="Update Review"
        @hidden="resetModal"
      >
        <rform
          :review-data="reviewData"
          :action="'Update'"
          @submit="handleUpdate"
        />
      </b-modal>
    </div>
  </b-container>
</template>

<script>
import rform from "@/components/ReviewForm"
import deletemodal from "@/components/DeleteModal"

export default {
  middleware: "notAuthenticated",
  components: {
    rform,
    deletemodal
  },
  async asyncData({ query, $axios, error }) {
    let page_no = query.page_no
    let reviews
    await $axios
      .$get("api/reviews", { params: { page_no } })
      .then(res => {
        reviews = res.data
      })
      .catch(e => {
        error({ statusCode: e.response.statusCode, message: e.message })
      })
    return { reviews }
  },
  data() {
    return {
      reviews: [],
      fields: [
        "title",
        {
          key: "verified",
          label: "IsVerified"
        },
        "rating",
        {
          key: "actions",
          label: "Actions"
        }
      ],
      reviewData: {
        id: null,
        item_id: null,
        user_id: null,
        rating: null,
        date: "",
        verified: false,
        title: "",
        body: "",
        helpfulvotes: null
      }
    }
  },
  methods: {
    resetModal() {
      this.reviewData = {}
    },
    async handleUpdate() {
      let review = this.reviewData
      await this.update("reviews", review).then(res => {
        this.reviews = res
      })
    },
    async handleDelete() {
      let id = this.reviewData.id
      await this.deleteR("reviews", id).then(res => {
        this.reviews = res
      })
    },
    updateReview(item) {
      delete item.username
      Object.assign(this.reviewData, item)
    },
    view(item) {
      this.reviewData = item
    },
    deleteReview(id) {
      this.reviewData.id = id
    },
    linkGen(pageNum) {
      return pageNum === 1 ? "?" : `?page_no=${pageNum}`
    }
  }
}
</script>

<style></style>
