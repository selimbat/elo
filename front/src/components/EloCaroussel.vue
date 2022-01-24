<template>
  <div class="caroussel">
    <Card
      v-for="(candidate, index) in candidates"
      :key="candidate.name"
      :candidate="candidate"
      :tabindex="index + 1"
    >
      <!--adding 1 to tabindex because 0 is a special case handled differently in each browser-->
      <CandidateTracker
        :candidateIdToTrack="candidate._id"
        :candidates="candidates"
        :trackersMap="trackersMap"
      />
    </Card>
  </div>
</template>

<script>
  import Card from "@/components/Card.vue";
  import CandidateTracker from "@/components/CandidateTracker.vue";

  export default {
    name: "EloCaroussel",
    components: {
      Card,
      CandidateTracker,
    },
    props: {
      candidates: {
        type: Array,
        default: () => [],
      },
      trackersMap: {
        type: Object,
        default: null,
      },
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
  };
</script>

<style lang="scss" scoped>
  .caroussel {
    display: flex;
    > * {
      flex-shrink: 0;
    }
    > .card {
      width: calc(var(--card-width) * 0.8);
      &:first-of-type {
        margin-left: 0;
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
</style>
