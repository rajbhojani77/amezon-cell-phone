<template>
  <div>
    <div id="notfound">
      <div class="notfound">
        <div v-if="error.statusCode === 404">
          <div class="notfound-404">
            <h1>404</h1>
          </div>
          <h2>We are sorry, Page not found!</h2>
        </div>
        <div v-else>
          <h1>
            An error occurred
          </h1>
        </div>
        <p>
          {{ error.message }}
        </p>
        <a>
          <nuxt-link to="/">
            Back To Homepage
          </nuxt-link>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ["error"],
  layout: "login"
}
</script>
<style scoped>
#notfound .notfound {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.notfound {
  max-width: 920px;
  width: 100%;
  line-height: 1.4;
  text-align: center;
  padding-left: 15px;
  padding-right: 15px;
}

.notfound .notfound-404 {
  position: absolute;
  height: 100px;
  top: 0;
  left: 50%;
  z-index: -1;
}

.notfound .notfound-404 h1 {
  font-family: "Maven Pro", sans-serif;
  color: #ececec;
  font-weight: 900;
  font-size: 276px;
  margin: 0px;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
