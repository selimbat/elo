<template>
  <div class="card">
    <div class="infos">
      <h2>{{ name }}</h2>
      <h3>{{ party ? party : "Indépendant" }}</h3>
    </div>
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
      party: String,
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
  .card > .infos {
    position: absolute;
    inset: auto 2rem 1.5rem 2rem;
    h3 {
      font-size: 18px;
    }
  }
</style>
