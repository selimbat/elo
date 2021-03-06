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
    <EncounterResultFeedback
      :encounterResult="previousEncounterResult"
      :possibleOutcomes="possibleOutcomes"
      class="result-info"
    />
    <div class="user-progress">
      <span :style="`width:${progressRatio}%`"></span>
    </div>
  </section>
</template>

<script>
  import Card from "@/components/Card.vue";
  import CandidateDescription from "@/components/CandidateDescription.vue";
  import EncounterResultFeedback from "@/components/EncounterResultFeedback.vue";
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
      EncounterResultFeedback,
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
        numberOfSeenEncounters: 0,
        totalNbOfCandidates: null,
        averageNbEncountersUntilOrdered: null,
      };
    },
    computed: {
      progressRatio() {
        let ratio = this.averageNbEncountersUntilOrdered
          ? Math.min(
              1,
              this.numberOfSeenEncounters / this.averageNbEncountersUntilOrdered
            )
          : 0;
        return ratio * 100;
      },
    },
    created() {
      this.reset();
    },
    methods: {
      async postEncounter(outcome) {
        if (this.isDataLoaded) {
          this.previousEncounterResult = null;
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
        if (seenEncountersCookie) {
          this.numberOfSeenEncounters = Object.keys(
            seenEncountersCookie
          ).length;
        }
        let candidates = await api.getTwoRandomCandidates(seenEncountersCookie);
        this.candidate1 = candidates[0];
        this.candidate2 = candidates[1];
        this.isDataLoaded = true;
        let {
          nbCandidates,
          averageNbEncountersUntilPath,
        } = await api.getAverageEncountersUntilOrdered(
          this.totalNbOfCandidates
        );
        this.totalNbOfCandidates = nbCandidates;
        this.averageNbEncountersUntilOrdered = averageNbEncountersUntilPath;
        this.$emit("progressed", this.progressRatio);
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
    padding-bottom: 1.5em;
  }
  .result-info {
    position: absolute;
    bottom: 0;
    width: 30%;
    max-width: var(--card-width);
    z-index: 2;
  }
  .user-progress {
    position: absolute;
    height: 1em;
    width: 100%;
    bottom: -2em;
    > span {
      content: "";
      background-color: var(--accent-color);
      width: 0;
      position: absolute;
      height: 1em;
      left: 0;
      border-radius: 5px;
      transition: width 0.3s ease;
    }
  }
</style>
