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
        const axios = require("axios");

        axios
          .get("http://localhost:3000/api/candidates")
          .then(function(response) {
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          })
          .then(function() {
            // always executed
          });
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
