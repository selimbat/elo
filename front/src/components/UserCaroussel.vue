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
    <span v-if="averageEncountersUntilOrdered != null"
      >Classe encore environ
      {{
        Math.max(1, averageEncountersUntilOrderedCeil - numberOfSeenEncounters)
      }}
      {{
        averageEncountersUntilOrderedCeil - numberOfSeenEncounters > 1
          ? "paires"
          : "paire"
      }}
      de candidats pour comparer ton classement au classement général.</span
    >
    <span v-else>Chargement...</span>
  </div>
</template>

<script>
  import Card from "@/components/Card.vue";
  import { getAverageEncountersUntilOrdered } from "@/services/apiService.js";
  import { getSeenEncountersCookie } from "@/services/cookieService.js";

  export default {
    name: "UserCaroussel",
    components: {
      Card,
    },
    props: {
      totalCandidatesCount: {
        type: Number,
        required: true,
      },
      candidates: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        numberOfSeenEncounters: 0,
        averageEncountersUntilOrdered: null,
      };
    },
    computed: {
      userOrdered() {
        return this.candidates.length > 0;
      },
      averageEncountersUntilOrderedCeil() {
        return Math.ceil(this.averageEncountersUntilOrdered);
      },
    },
    mounted() {
      const cookie = getSeenEncountersCookie();
      if (cookie) {
        this.numberOfSeenEncounters = Object.keys(cookie).length;
      }
      this.getAverageEncountersUntilOrdered();
    },
    methods: {
      async getAverageEncountersUntilOrdered() {
        this.averageEncountersUntilOrdered = (
          await getAverageEncountersUntilOrdered(this.totalCandidatesCount)
        ).averageNbEncountersUntilPath;
      },
    },
    watch: {
      totalCandidatesCount() {
        this.getAverageEncountersUntilOrdered();
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
