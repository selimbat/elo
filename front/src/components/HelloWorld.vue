<template>
  <div>
    <div v-for="candidate in candidates" :key="candidate.id">
      <ul>
        <il> Prénom : {{ candidate.firstname }}</il>
        <il> Nom : {{ candidate.lastname }}</il>
        <il> Parti : {{ candidate.party }}</il>
        <il> Score : {{ candidate.score }}</il>
      </ul>
    </div>
    <button @click="getCandidates()">Appeler l'API</button>
  </div>
</template>

<script>
  export default {
    name: "HelloWorld",
    props: {
      msg: String,
    },
    data() {
      return {
        candidates: [],
      };
    },
    methods: {
      getCandidates() {
        var vm = this;
        this.$http.get("localhost:3000/candidates", (response) => {
          vm.candidates = response.candidates;
        });
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
