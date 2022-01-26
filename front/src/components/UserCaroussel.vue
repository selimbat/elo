<template>
  <div class="caroussel" v-if="userOrdered">
    <Card
      v-for="candidate in candidates"
      :key="candidate.name"
      :candidate="candidate"
      :withImage="false"
      :isCorrectOrder="candidate.isCorrectOrder"
    ></Card>
  </div>
  <div class="caroussel not-ranked" v-else>
    <span>Compare plus de candidats pour voir ton classement.</span>
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
    computed: {
      userOrdered() {
        return this.candidates.length > 0;
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
  .not-ranked {
    border-radius: var(--border-radius);
    box-shadow: 0.5rem 0.5rem 2rem #888c9e;
    padding: 0 0 0 1em;
    text-align: center;
    display: flex;
    align-items: center;
    span {
      position: fixed;
    }
  }
</style>
