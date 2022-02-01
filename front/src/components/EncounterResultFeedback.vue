<template>
  <div
    v-if="encounterResult != null && !hide"
    :class="{ correct: encounterResult.outcomeAgreesWithScores }"
  >
    <span
      >Les français jugent que {{ encounterResult.candidate1.lastname }} est
      plus {{ trueOutcomeOfPreviousEncounter }} que
      {{ encounterResult.candidate2.lastname }}.
    </span>
    <button class="close" @click="hide = true"></button>
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
    data() {
      return {
        hide: false,
      };
    },
    computed: {
      trueOutcomeOfPreviousEncounter() {
        return this.encounterResult.outcomeAgreesWithScores ^
          (this.encounterResult.outcome == this.possibleOutcomes.MORE_LEFT)
          ? "à droite"
          : "à gauche";
      },
    },
    watch: {
      encounterResult() {
        this.hide = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  div {
    --inline-padding: 1em;
    --close-btn-width: 1.5em;
    box-sizing: border-box;
    padding: 0.5em calc(var(--close-btn-width) + var(--inline-padding)) 0.5em
      var(--inline-padding);
    text-align: left;
    border-radius: var(--border-radius);
    box-shadow: 0.5rem 0.5rem 2rem #888c9e;
    &.correct {
      background-color: var(--success-color);
    }
    &:not(.correct) {
      background-color: var(--error-color);
    }
  }
  .close {
    background-color: transparent;
    border: none;
    position: absolute;
    right: var(--inline-padding);
    top: 50%;
    transform: translateY(-50%);
    width: var(--close-btn-width);
    height: var(--close-btn-width);
    cursor: pointer;
    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 2px;
      border-radius: 1px;
      background-color: var(--text-color);
      inset: 50% 0 0 50%;
      transition: transform 0.2s ease;
    }
    &::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    &:hover,
    &:focus {
      &::before,
      &::after {
        transform: translate(-50%, -50%);
      }
    }
  }
</style>
