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
        ) - window.innerWidth;
      window.scrollTo(maxScroll / 2, 0);
    },
    methods: {
      async getCandidates() {
        this.candidates = await api.getAllCandidates();
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
    padding: 0 1em;
    > * {
      flex-shrink: 0;
    }
    > .card {
      &:first-of-type {
        margin-left: 0;
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
</style>
