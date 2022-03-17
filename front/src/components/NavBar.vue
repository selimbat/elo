<template>
  <div id="nav">
    <router-link to="/">Rencontre</router-link>
    <router-link ref="ranking" to="/ranking">Classement</router-link>
  </div>
</template>

<style lang="scss" scoped>
  #nav {
    z-index: 1;
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
      &.nudge[href="#/ranking"] {
        animation: blinking 1s steps(1, start) infinite;
      }
      @keyframes blinking {
        0% {
          background-color: var(--accent-color);
        }
        50% {
          background-color: var(--accent-color-light);
        }
      }
    }
  }
</style>

<script>
  export default {
    name: "NavBar",
    props: {
      isGraphComplete: {
        type: Boolean,
        default: false,
      },
    },
    watch: {
      isGraphComplete(value) {
        if (value) {
          this.$refs.ranking.$el.classList.add("nudge");
          setTimeout(() => {
            this.$refs.ranking.$el.classList.remove("nudge");
          }, 3500);
        }
      },
    },
  };
</script>
