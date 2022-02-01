<template>
  <section>
    <Card :loading="!isDataLoaded" :candidate="candidate1" tabindex="1">
      <CandidateDescription :description="candidate1.description" />
    </Card>
    <div class="input">
      <p id="is">est</p>
      <div class="actions">
        <a
          tabindex="2"
          @click="postEncounter(possibleOutcomes.MORE_LEFT)"
          @keyup.enter="postEncounter(possibleOutcomes.MORE_LEFT)"
          @mousedown.prevent=""
          >plus à gauche</a
        >
        <a
          tabindex="3"
          @click="postEncounter(possibleOutcomes.MORE_RIGHT)"
          @keyup.enter="postEncounter(possibleOutcomes.MORE_RIGHT)"
          @mousedown.prevent=""
          >plus à droite</a
        >
      </div>
      <p id="than">que</p>
    </div>
    <Card :loading="!isDataLoaded" :candidate="candidate2" tabindex="4">
      <CandidateDescription :description="candidate2.description" />
    </Card>
    <div
      class="result-info"
      v-if="previousEncounterResult != null"
      :class="{ correct: previousEncounterResult.outcomeAgreesWithScores }"
    >
      <span
        >Les français jugent que
        {{ previousEncounterResult.candidate1.lastname }} est plus
        {{ trueOutcomeOfPreviousEncounter }} que
        {{ previousEncounterResult.candidate2.lastname }}.
      </span>
    </div>
  </section>
</template>

<script>
  import Card from "@/components/Card.vue";
  import CandidateDescription from "@/components/CandidateDescription.vue";
  import api from "@/services/apiService.js";
  import {
    updateSeenEncountersCookie,
    getSeenEncountersCookie,
  } from "@/services/cookieService.js";

  export default {
    name: "Encounter",
    components: {
      Card,
      CandidateDescription,
    },
    data() {
      return {
        candidate1: {
          name: "Batman",
        },
        candidate2: {
          name: "Superman",
        },
        isDataLoaded: false,
        previousEncounterResult: null,
        possibleOutcomes: {
          MORE_RIGHT: -1,
          MORE_LEFT: 1,
        },
      };
    },
    created() {
      this.reset();
    },
    methods: {
      async postEncounter(outcome) {
        if (this.isDataLoaded) {
          this.previousEncounterResult = await api.postEncounter(
            this.candidate1._id,
            this.candidate2._id,
            outcome
          );
          updateSeenEncountersCookie(
            this.candidate1._id,
            this.candidate2._id,
            outcome
          );
          (outcome === this.possibleOutcomes.MORE_RIGHT) ^
            (this.candidate1.score > this.candidate2.score);
          this.reset();
        }
      },
      async reset() {
        this.isDataLoaded = false;
        let seenEncountersCookie = getSeenEncountersCookie();
        let candidates = await api.getTwoRandomCandidates(seenEncountersCookie);
        this.candidate1 = candidates[0];
        this.candidate2 = candidates[1];
        this.isDataLoaded = true;
      },
    },
    computed: {
      trueOutcomeOfPreviousEncounter() {
        return this.previousEncounterResult.outcomeAgreesWithScores ^
          (this.previousEncounterResult.outcome ==
            this.possibleOutcomes.MORE_LEFT)
          ? "à droite"
          : "à gauche";
      },
    },
  };
</script>

<style lang="scss" scoped>
  section {
    position: relative;
    height: var(--encounter-section-height);
    padding-top: calc((100vh - var(--encounter-section-height)) / 2);
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .input {
    font-size: 30px;
    position: relative;
    height: 100%;
    margin: 0 1em;
    border-radius: var(--border-radius);
    width: 18rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
  .actions {
    display: flex;
    flex-direction: column;
    & > a {
      --side-padding: 1.1rem;
      box-sizing: border-box;
      width: 50%;
      margin: 0.5rem 0;
      padding: 0.5rem 0;
      border-radius: var(--border-radius);
      cursor: pointer;
      box-shadow: 0.2em 0.2em 1em #aeb4ca;
      transition: background-color 0.3s;

      background-color: var(--accent-color);
      color: var(--accent-text-color);
      &:hover,
      &:focus {
        background-color: var(--accent-color-light);
      }

      &:first-of-type {
        text-align: left;
        padding-left: var(--side-padding);
      }
      &:last-of-type {
        align-self: end;
        text-align: right;
        padding-right: var(--side-padding);
      }
    }
  }
  #is,
  #than {
    font-size: 1.5em;
  }
  #is {
    text-align: left;
  }
  #than {
    text-align: right;
  }
  .result-info {
    position: absolute;
    bottom: 0;
    width: 30%;
    max-width: var(--card-width);
  }
</style>
