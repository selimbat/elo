<template>
  <section>
    <Card :loading="!isDataLoaded" :candidate="candidate1"></Card>
    <div class="input">
      <p id="is">est</p>
      <div class="actions">
        <a @click="postEncounter(possibleOutcomes.MORE_LEFT)">plus à gauche</a>
        <a @click="postEncounter(possibleOutcomes.SIMILAR)">pareil</a>
        <a @click="postEncounter(possibleOutcomes.MORE_RIGHT)">plus à droite</a>
      </div>
      <p id="than">que</p>
    </div>
    <Card :loading="!isDataLoaded" :candidate="candidate2"></Card>
  </section>
</template>

<script>
  import Card from "@/components/Card.vue";
  import api from "@/services/apiService.js";

  export default {
    name: "Encounter",
    components: {
      Card,
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
          this.reset();
        }
      },
      async reset() {
        this.isDataLoaded = false;
        let candidates = await api.getTwoRandomCandidates();
        this.candidate1 = candidates[0];
        this.candidate2 = candidates[1];
        this.isDataLoaded = true;
      },
    },
  };
</script>

<style lang="scss" scoped>
  section {
    height: var(--section-height);
    padding-top: calc((100vh - var(--section-height)) / 2);
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
        &:hover {
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
