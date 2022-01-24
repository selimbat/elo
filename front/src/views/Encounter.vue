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
          @click="postEncounter(possibleOutcomes.SIMILAR)"
          @keyup.enter="postEncounter(possibleOutcomes.SIMILAR)"
          @mousedown.prevent=""
          >pareil</a
        >
        <a
          tabindex="4"
          @click="postEncounter(possibleOutcomes.MORE_RIGHT)"
          @keyup.enter="postEncounter(possibleOutcomes.MORE_RIGHT)"
          @mousedown.prevent=""
          >plus à droite</a
        >
      </div>
      <p id="than">que</p>
    </div>
    <Card :loading="!isDataLoaded" :candidate="candidate2" tabindex="5">
      <CandidateDescription :description="candidate2.description" />
    </Card>
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
        possibleOutcomes: {
          MORE_RIGHT: -1,
          SIMILAR: 0,
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
          api.postEncounter(this.candidate1._id, this.candidate2._id, outcome);
          updateSeenEncountersCookie(
            this.candidate1._id,
            this.candidate2._id,
            outcome
          );
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
  };
</script>

<style lang="scss" scoped>
  section {
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

      @mixin buttonColor($color, $hover-color, $text-color) {
        background-color: $color;
        color: $text-color;
        &:hover,
        &:focus {
          background-color: $hover-color;
        }
      }

      &:nth-child(1),
      &:nth-child(3) {
        @include buttonColor(
          var(--accent-color),
          var(--accent-color-light),
          var(--accent-text-color)
        );
      }
      &:nth-child(1) {
        text-align: left;
        padding-left: var(--side-padding);
      }
      &:nth-child(2) {
        @include buttonColor(#f7f7fa, #fff, var(--text-color));
        align-self: center;
      }
      &:nth-child(3) {
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
</style>
