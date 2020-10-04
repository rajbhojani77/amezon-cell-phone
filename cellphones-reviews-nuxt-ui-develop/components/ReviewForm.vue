<template>
  <b-form ref="form" @submit.stop.prevent="$emit('submit')">
    <b-form-group
      class="font-weight-bold"
      label="Title"
      label-for="asib-input"
      invalid-feedback="Asin is required"
    >
      <b-form-input id="title-input" v-model="reviewData.title" required />
    </b-form-group>
    <b-form-group
      class="font-weight-bold"
      label="Body"
      label-for="body-input"
      invalid-feedback="Brand is required"
    >
      <b-form-input id="body-input" v-model="reviewData.body" required />
    </b-form-group>
    <b-form-group
      class="font-weight-bold"
      label="Rating"
      label-for="rating-input"
    >
      <star-rate
        id="rating-input"
        v-model="reviewData.rating"
        class="m-0"
        font-size="30px"
        type="star1"
      />
    </b-form-group>
    <b-form-checkbox
      v-if="$store.state.isAdmin"
      id="verified-input"
      v-model="reviewData.verified"
      size="lg"
    >
      IsVerified
    </b-form-checkbox>
    <b-button
      id="modalButton"
      class="mt-3"
      variant="success"
      block
      type="submit"
    >
      {{ action }}
    </b-button>
  </b-form>
</template>
<script>
import StarRate from "vue-cute-rate"

export default {
  components: {
    StarRate
  },
  props: {
    action: { type: String, default: "Add" },
    reviewData: {
      type: Object,
      default: function() {
        return {
          id: null,
          item_id: null,
          user_id: null,
          rating: 0,
          date: new Date(),
          verified: false,
          title: "",
          body: "",
          helpfulvotes: 0
        }
      }
    }
  }
}
</script>
