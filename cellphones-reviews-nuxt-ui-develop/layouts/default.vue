<template>
  <div v-if="$store.state.auth">
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-container>
        <b-navbar-brand href="/">
          Amazon Cell Phones
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse" />

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item
              v-if="$store.state.isAdmin"
              to="/users"
              :prefetch="false"
              active-class="active"
            >
              Users
            </b-nav-item>
            <b-nav-item to="/items" :prefetch="false" active-class="active">
              Items
            </b-nav-item>
            <b-nav-item to="/reviews" :prefetch="false" active-class="active">
              Reviews
            </b-nav-item>
            <b-nav-item @click="logout">
              Logout
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
    <b-container>
      <bread-crumb />
      <nuxt />
    </b-container>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb"
export default {
  name: "App",
  middleware: "notAuthenticated",
  components: {
    BreadCrumb
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch("logout")
      } catch (e) {
        this.formError = e.message
      }
    }
  }
}
</script>

<style></style>
