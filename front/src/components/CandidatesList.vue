<template>
  <div>
    <div v-for="candidate in candidates" :key="candidate.id">
      <ul>
        <li>Nom : {{ candidate.name }}</li>
        <li>Parti : {{ candidate.party.name }}</li>
        <li>Score : {{ candidate.score }}</li>
      </ul>
    </div>
    <button @click="getCandidates()">Appeler l'API</button>
  </div>
</template>

<script>
  export default {
    name: "CandidatesList",
    data() {
      return {
        candidates: [],
      };
    },
    methods: {
      getCandidates() {
        const axios = require("axios");
        var vm = this;
        axios
          .get("http://localhost:3000/api/candidates")
          .then(function(response) {
            vm.candidates = response.data;
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

<style scoped></style>
