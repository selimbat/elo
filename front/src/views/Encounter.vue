<template>
  <section>
    <Card :loading="!isDataLoaded" :candidate="candidate1"></Card>
    <div class="input">
      <p id="is">est :</p>
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
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    height: 70vh;
    width: 100%;
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
    justify-content: space-around;
  }
  .actions {
    display: flex;
    flex-direction: column;
    & > a {
      --side-padding: 1.1rem;
      width: calc(50% - var(--side-padding));
      margin: 0.5rem 0;
      padding: 0.5rem 0;
      background-color: salmon;
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: background-color 0.3s;
      &:hover {
        background-color: sandybrown;
      }
    }
    & > a:nth-child(1) {
      text-align: left;
      padding-left: var(--side-padding);
    }
    & > a:nth-child(2) {
      align-self: center;
    }
    & > a:nth-child(3) {
      align-self: end;
      text-align: right;
      padding-right: var(--side-padding);
    }
  }
  #is {
    text-align: left;
  }
  #than {
    text-align: right;
  }
</style>
