<template>
  <div id="app" ref="app">
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
      document.addEventListener("wheel", this.handleScroll);
    },
    destroyed() {
      document.removeEventListener("wheel", this.handleScroll);
    },
    watch: {
      $route(to) {
        this.configScroll(to);
      },
    },
    methods: {
      configScroll(route) {
        this.$refs.app.style.overflowY = "hidden";
        if (route.meta.horizontalScroll) {
          this.$refs.app.style.overflowX = "visible";
        } else {
          this.$refs.app.style.overflowX = "hidden";
        }
      },
      handleScroll(event) {
        this.$refs.app.scrollBy({ left: event.deltaY, behaviour: "smooth" });
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
