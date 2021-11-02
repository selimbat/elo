<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Rencontre</router-link> |
      <router-link to="/ranking">Classement</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
  import "./reset.css";
  import "./variables.css";
  export default {
    name: "App",
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
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: var(--text-color);
  }

  #nav {
    padding: 30px;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
  }

  #nav a {
    font-weight: bold;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
</style>
