<template>
  <div id="nav">
    <router-link to="/">Rencontre</router-link>
    <router-link to="/ranking">Classement</router-link>
  </div>
</template>

<style lang="scss" scoped>
  #nav {
    z-index: 10;
    padding: 30px;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    a {
      font-weight: var(--bold-font-weight);
      border-radius: var(--border-radius);
      padding: 0.75em 1em;
      margin: 0 0.25em;
      &.router-link-exact-active {
        color: var(--text-color);
        cursor: default;
      }
      &:not(.router-link-exact-active) {
        background-color: var(--accent-color);
        color: var(--accent-text-color);
        &:hover,
        &:focus {
          background-color: var(--accent-color-light);
        }
      }
    }
  }
</style>

<script>
  export default {
    name: "NavBar",
  };
</script>
