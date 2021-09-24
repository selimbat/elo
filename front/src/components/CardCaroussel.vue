<template>
  <section class="caroussel">
    <Card
      v-for="candidate in candidates"
      :key="candidate.name"
      :name="candidate.name"
      :party="candidate.party"
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
    mounted() {
      this.getCandidates();
      console.log(window.pageXOffset);
      window.pageXOffset = 100;
      console.log(window.pageXOffset);
    },
    methods: {
      getCandidates() {
        this.candidates = [
          {
            name: "Batman",
            party: "Make Gotham great again",
            score: -10,
          },
          {
            name: "Superman",
            party: "I beleive I can fly",
            score: -1,
          },
          {
            name: "Green Lantern",
            party: "There will be light",
            score: 2,
          },
          {
            name: "Harley Quinn",
            party: "You won't regret it, Hon'",
            score: 9999,
          },
          {
            name: "The Flash",
            party: "🏃‍♂️🏃‍♂️🏃‍♂️",
            score: 0,
          },
          {
            name: "Spiderman",
            party: "Into the Spiderverse",
            score: -4,
          },
          {
            name: "Wonderwoman",
            party: "Dunno",
            score: -8,
          },
          {
            name: "Joker",
            party: "I'll burn it to the ground",
            score: 30,
          },
        ];
        this.candidates = this.candidates.sort((c1, c2) => c1.score < c2.score);
        /*
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
          */
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
