<template>
  <div>
    <b-breadcrumb :items="crumbs" />
  </div>
</template>
<script>
export default {
  computed: {
    crumbs: function() {
      let pathArray = this.$route.path.split("/")
      pathArray.shift()
      let breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        breadcrumbArray.push({
          path: path,
          to: breadcrumbArray[idx - 1]
            ? "/" + breadcrumbArray[idx - 1].path + "/" + path
            : "/" + path,
          text: path || "Home"
        })
        return breadcrumbArray
      }, [])
      return breadcrumbs
    }
  }
}
</script>
