<template>
  <b-modal
    id="delete"
    ref="delete"
    :static="true"
    hide-footer
    :title="'Delete ' + name"
  >
    <label class="text-danger">
      Are you sure you want to delete this {{ name }}?
    </label>
    <div class="modal-footer">
      <b-button id="yes" variant="danger" @click="ondelete">
        Yes
      </b-button>
      <b-button id="no" variant="light" data-dismiss="modal" @click="hideModal">
        No
      </b-button>
    </div>
  </b-modal>
</template>
<script>
export default {
  name: "DeleteModal",
  props: {
    name: { type: String, default: "" }
  },
  methods: {
    ondelete() {
      this.$emit("ondelete")
      this.$nextTick(() => {
        this.$refs["delete"].hide()
      })
    },
    hideModal() {
      this.$nextTick(() => {
        this.$refs["delete"].hide()
      })
    }
  }
}
</script>
