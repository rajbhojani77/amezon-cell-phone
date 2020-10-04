<template>
  <b-container fluid>
    <b-card class="mb-3">
      <b-row>
        <b-col class="align-self-center">
          <div class="d-flex justify-content-center m-4">
            <b-img :src="item.image" />
          </div>
        </b-col>
        <b-col cols="6" class="p-5">
          <h3>
            {{ item.title }}
          </h3>
          <b-row>
            <b-col cols="3">
              <strong>Brand</strong>
            </b-col>
            <b-col cols="9">
              <div>: {{ item.brand }}</div>
            </b-col>
            <b-col cols="3">
              <strong>Price</strong>
            </b-col>
            <b-col cols="9">
              <div>: {{ item.prices }}</div>
            </b-col>
            <b-col cols="3">
              <strong>Ratings</strong>
            </b-col>
            <b-col cols="9">
              <div>: {{ item.rating }}</div>
            </b-col>
            <b-col cols="3">
              <strong>Reviews</strong>
            </b-col>
            <b-col cols="9">
              <div>: {{ item.totalreviews }}</div>
            </b-col>
            <b-col cols="3">
              <strong>Asin</strong>
            </b-col>
            <b-col cols="9">
              <div>: {{ item.asin }}</div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>

    <div v-for="review in reviews" :key="review.id" class="mb-3">
      <b-card :title="review.title">
        <b-card-text>
          <p>
            <strong>Isverified: </strong><span>{{ review.verified }}</span>
          </p>
          <p>
            <strong>HelpfullVotes: </strong>
            <span>{{ review.helpfulvotes }}</span>
          </p>
          <div class="clearfix" />
          <p>{{ review.body }}</p>
          <p>
            <strong>By </strong><span>{{ review.username }}</span>
            <strong> on </strong><span>{{ review.date }}</span>
          </p>
        </b-card-text>
      </b-card>
    </div>
  </b-container>
</template>
<script>
export default {
  async asyncData({ params, $axios, error }) {
    let item_id = params.view
    let item, reviews
    await $axios
      .$get("api/items/" + item_id)
      .then(res => {
        item = res.data.item
        reviews = res.data.reviews
      })
      .catch(e => {
        error({ statusCode: e.response.statusCode, message: e.message })
      })
    return { item, reviews }
  },
  data() {
    return {
      item: {},
      reviews: []
    }
  }
}
</script>

<style></style>
