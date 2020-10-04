export default function({ store, redirect, route }) {
  if (!store.state.auth) {
    return redirect("/login")
  }
  if (route.name == "users" && store.state.auth.role_id != 1) {
    return redirect("/")
  }
}
