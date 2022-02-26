<template>
  <div id="app">
    <MobileUnsupportedOverlay />
    <NavBar />
    <router-view />
  </div>
</template>

<script>
  import "./reset.css";
  import "./globals.scss";
  import NavBar from "./components/NavBar.vue";
  import MobileUnsupportedOverlay from "./components/MobileUnsupportedOverlay.vue";

  export default {
    name: "App",
    components: {
      NavBar,
      MobileUnsupportedOverlay,
    },
    mounted() {
      this.configScroll(this.$route);
    },
    watch: {
      $route(to) {
        this.configScroll(to);
      },
    },
    methods: {
      configScroll(route) {
        document.querySelector("#app").style.overflowY = "hidden";
        if (route.meta.horizontalScroll) {
          document.querySelector("#app").style.overflowX = "visible";
        } else {
          document.querySelector("#app").style.overflowX = "hidden";
        }
      },
    },
  };
</script>

<style>
  #app {
    font-family: "Montserrat", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 100vh;
    color: var(--text-color);
  }
</style>
