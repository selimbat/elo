<template>
  <div class="caroussel">
    <Card
      v-for="candidate in candidates"
      :key="candidate.name"
      :candidate="candidate"
      :withImage="false"
      :isCorrectOrder="candidate.isCorrectOrder"
    ></Card>
  </div>
</template>

<script>
  import Card from "@/components/Card.vue";

  export default {
    name: "UserCaroussel",
    components: {
      Card,
    },
    props: {
      candidates: {
        type: Array,
        default: () => [],
      },
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
