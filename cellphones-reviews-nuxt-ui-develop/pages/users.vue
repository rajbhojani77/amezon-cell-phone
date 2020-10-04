<template>
  <b-container fluid>
    <b-row class="float-right mb-3 mr-auto">
      <b-button id="addUser" v-b-modal.add variant="primary">
        Add User
      </b-button>
    </b-row>
    <div class="table-responsive">
      <b-table
        id="mytable"
        class="text-center"
        bordered
        :items="users"
        :fields="fields"
      >
        <template v-slot:cell(actions)="row">
          <b-button
            id="editUser"
            v-b-modal.edit
            variant="secondary"
            @click="updateUser(row.item)"
          >
            Edit
          </b-button>
          <b-button
            id="deleteUser"
            v-b-modal.delete
            variant="danger"
            @click="deleteUser(row.item.id)"
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
        hide-footer
        title="Add User"
        :static="true"
        @hidden="resetModal"
      >
        <Uform :user-data="userData" :action="'Add'" @submit="handleAdd" />
      </b-modal>
    </div>

    <div>
      <b-modal
        id="edit"
        ref="edit"
        hide-footer
        :static="true"
        title="Update User"
        @hidden="resetModal"
      >
        <Uform
          :user-data="userData"
          :action="'Update'"
          @submit="handleUpdate"
        />
      </b-modal>
    </div>
    <div>
      <DeleteModal :name="'User'" @ondelete="handleDelete" />
    </div>
  </b-container>
</template>

<script>
import Uform from "@/components/UserForm"
import DeleteModal from "@/components/DeleteModal"

export default {
  name: "Users",
  components: {
    Uform,
    DeleteModal
  },
  async asyncData({ query, $axios, error }) {
    let page_no = query.page_no
    let users
    await $axios
      .$get("api/users", { params: { page_no } })
      .then(res => {
        users = res.data
      })
      .catch(e => {
        error({ statusCode: e.response.statusCode, message: e.message })
      })
    return { users }
  },
  data() {
    return {
      users: [],
      fields: ["username", { key: "actions", label: "Actions" }],
      userData: { id: null, username: "", password: "" },
      error: null
    }
  },
  middleware: "notAuthenticated",
  methods: {
    resetModal() {
      this.userData = {}
    },
    async handleAdd() {
      let user = this.userData
      await this.add("users", user).then(res => {
        this.users = res
      })
    },
    async handleUpdate() {
      let user = this.userData
      await this.update("users", user).then(res => {
        this.users = res
      })
    },
    async handleDelete() {
      let id = this.userData.id
      await this.deleteR("users", id).then(res => {
        this.users = res
      })
    },
    updateUser(item) {
      this.userData.id = item.id
      this.userData.username = item.username
      this.userData.password = ""
    },
    deleteUser(id) {
      this.userData.id = id
    },
    linkGen(pageNum) {
      return pageNum === 1 ? "?" : `?page_no=${pageNum}`
    }
  }
}
</script>

<style></style>
