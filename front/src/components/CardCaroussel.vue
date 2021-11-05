<template>
  <section class="caroussel">
    <Card
      v-for="(candidate, index) in candidates"
      :key="candidate.name"
      :candidate="candidate"
      :enableInfos="false"
      :tabindex="index + 1"
    />
    <!--adding 1 to tabindex because 0 is a special case handled differently in each browser-->
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
        trackersMap: {},
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
        const response = await api.getAllCandidates();
        this.candidates = response.data.candidates.sort(
          (c1, c2) => c1.score < c2.score
        );
        this.trackersMap = response.data.trackersMap;
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
