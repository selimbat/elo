<template>
  <section class="caroussel">
    <Card
      v-for="candidate in candidates"
      :key="candidate.name"
      :candidate="candidate"
      :enableInfos="false"
    />
  </section>
</template>

<script>
  import Card from "@/components/Card.vue";

  export default {
    name: "CardCaroussel",
    components: {
      Card,
    },
    data() {
      return {
        candidates: [],
      };
    },
    created() {
      this.getCandidates();
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
          });
        this.candidates = this.candidates.sort((c1, c2) => c1.score < c2.score);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .caroussel {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    height: 70vh;
    width: 100%;
    > * {
      flex-shrink: 0;
    }
  }
</style>
