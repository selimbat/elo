<template>
  <footer>
    <a href="https://github.com/selimbat/elo" target="_blank">Code source</a>
    <a
      href="https://github.com/selimbat/elo#utilisation-des-donn%C3%A9es-personnelles"
      target="_blank"
      >Politique de confidentialité</a
    >
  </footer>
</template>

<style lang="scss" scoped>
  footer {
    font-size: 0.9em;
    position: fixed;
    inset: auto auto 0 50%;
    transform: translate(-50%, 0);
    padding: 1.5em 0;
  }
  a {
    text-decoration: underline;
    & + a {
      margin-left: 1em;
    }
  }
</style>

<script>
  export default {
    name: "Footer",
  };
</script>
