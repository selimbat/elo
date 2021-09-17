<template>
  <div class="card">
    <h3 class="name">{{ name }}</h3>
  </div>
</template>

<script>
  export default {
    name: "Card",
    props: {
      name: {
        type: String,
        required: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .card {
    font-size: 30px;
    position: relative;
    height: 100%;
    width: 20rem;
    margin: 0 1em;
    border-radius: 15px;
    background-color: red;
  }
  .card > .name {
    position: absolute;
    inset: auto auto 1.5rem 2rem;
  }
</style>
