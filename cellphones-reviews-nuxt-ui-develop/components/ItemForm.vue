<template>
  <b-form ref="form" @submit.stop.prevent="$emit('submit')">
    <b-form-group
      class="font-weight-bold"
      label="Asin"
      label-for="asib-input"
      invalid-feedback="Asin is required"
    >
      <b-form-input id="asin-input" v-model="itemData.asin" required />
    </b-form-group>
    <b-form-group
      class="font-weight-bold"
      label="Brand"
      label-for="asib-input"
      invalid-feedback="Brand is required"
    >
      <b-form-input id="brand-input" v-model="itemData.brand" required />
    </b-form-group>
    <b-form-group
      class="font-weight-bold"
      label="title"
      label-for="title-input"
      invalid-feedback="title is required"
    >
      <b-form-input id="title-input" v-model="itemData.title" required />
    </b-form-group>
    <b-form-group
      class="font-weight-bold"
      label="Price"
      label-for="price-input"
      invalid-feedback="Name is required"
    >
      <vue-numeric
        v-model="itemData.prices"
        class="form-control"
        output-type="String"
        :min="minValue"
        :max="maxValue"
        :currency="currency"
        :separator="separator"
        :precision="decimals"
      />
    </b-form-group>
    <b-form-group
      class="font-weight-bold"
      label="Image"
      label-for="image-input"
    >
      <b-form-input id="image-input" v-model="itemData.image" required />
    </b-form-group>
    <b-button :id="action" class="mt-3" variant="success" block type="submit">
      {{ action }}
    </b-button>
  </b-form>
</template>
<script>
import VueNumeric from "vue-numeric"
export default {
  components: {
    VueNumeric
  },
  props: {
    action: { type: String, default: "Add" },
    itemData: {
      type: Object,
      default: function() {
        return {
          asin: "",
          brand: "",
          title: "",
          image: "",
          prices: ""
        }
      }
    }
  },
  data: function() {
    return {
      minValue: 0,
      maxValue: 999999,
      currency: "$",
      decimals: 2,
      separator: ","
    }
  }
}
</script>
