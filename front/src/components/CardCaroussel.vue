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
  import api from "@/services/apiService.js";

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
    updated() {
      let maxScroll =
        Math.max(
          document.body.scrollWidth,
          document.body.offsetWidth,
          document.documentElement.clientWidth,
          document.documentElement.scrollWidth,
          document.documentElement.offsetWidth
        ) - window.innerWidth; // cross-browser method to get the max scroll
      window.scrollTo(maxScroll / 2, 0);
    },
    methods: {
      async getCandidates() {
        this.candidates = await api.getAllCandidates();
        this.$emit("data-loaded", this.computeLeftistsRatio());
      },
      computeLeftistsRatio() {
        // this.candidates needs to be not empty and sorted by descending score
        for (let i = 0; i < this.candidates.length - 1; i++) {
          let score1 = this.candidates[i].score;
          let score2 = this.candidates[i + 1].score;
          if (score1 * score2 > 0) {
            continue;
          }
          let ratio = score1 / (score1 - score2); // ratio between the two candidates just before and after the 0 point
          return (i + ratio) / (this.candidates.length - 1); // ratio relative to all the candidates
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .caroussel {
    display: flex;
    height: var(--section-height);
    padding-top: calc((100vh - var(--section-height)) / 2);
    > * {
      flex-shrink: 0;
    }
  }
</style>
