<template>
  <div class="ranking">
    <CardCaroussel @data-loaded="registerRatio" />
    <Spectrum :leftRatio="leftRatio" />
  </div>
</template>

<style lang="scss">
  .ranking {
    min-width: fit-content;
    padding: 0 1em;
    > .caroussel > .card {
      &:first-of-type {
        margin-left: 0;
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
</style>

<script>
  import CardCaroussel from "@/components/CardCaroussel.vue";
  import Spectrum from "@/components/Spectrum.vue";

  export default {
    name: "Ranking",
    components: {
      CardCaroussel,
      Spectrum,
    },
    data() {
      return {
        leftRatio: 0.5,
      };
    },
    methods: {
      registerRatio(ratio) {
        this.leftRatio = ratio;
      },
    },
  };
</script>
