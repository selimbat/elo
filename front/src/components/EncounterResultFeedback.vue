<template>
  <div
    v-if="encounterResult != null"
    :class="{ correct: encounterResult.outcomeAgreesWithScores }"
  >
    <span
      >Les français jugent que {{ encounterResult.candidate1.lastname }} est
      plus {{ trueOutcomeOfPreviousEncounter }} que
      {{ encounterResult.candidate2.lastname }}.
    </span>
  </div>
</template>

<script>
  export default {
    name: "EncounterResultFeedback",
    props: {
      encounterResult: {
        type: Object,
        default: null,
      },
      possibleOutcomes: {
        type: Object,
        required: true,
      },
    },
    computed: {
      trueOutcomeOfPreviousEncounter() {
        return this.encounterResult.outcomeAgreesWithScores ^
          (this.encounterResult.outcome == this.possibleOutcomes.MORE_LEFT)
          ? "à droite"
          : "à gauche";
      },
    },
  };
</script>
