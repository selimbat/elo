<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<script>
  import "./reset.css";
  import "./globals.scss";
  import NavBar from "./components/NavBar.vue";

  export default {
    name: "App",
    components: {
      NavBar,
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
        document.querySelector("body").style.overflowY = "hidden";
        if (route.meta.horizontalScroll) {
          document.querySelector("body").style.overflowX = "visible";
        } else {
          document.querySelector("body").style.overflowX = "hidden";
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
    color: var(--text-color);
  }
</style>
