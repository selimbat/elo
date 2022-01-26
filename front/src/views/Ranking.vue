<template>
  <section class="ranking">
    <Spectrum v-if="leftRatio" :leftRatio="leftRatio" />
    <div class="wrapper">
      <h2>Classement général :</h2>
    </div>
    <EloCaroussel
      class="elo-caroussel"
      :candidates="candidates"
      :trackersMap="trackersMap"
    />
    <div class="wrapper">
      <h2>Ton classement :</h2>
    </div>
    <UserCaroussel class="user-caroussel" :candidates="candidatesByUserOrder" />
  </section>
</template>

<style lang="scss" scoped>
  .ranking {
    min-width: fit-content;
    display: flex;
    flex-direction: column;
    padding: 0 1em;
    font-size: 0.9rem;
    height: var(--ranking-section-height);
    padding-top: calc((100vh - var(--ranking-section-height)) / 2);
    > .elo-caroussel {
      flex-basis: 85%;
      margin-bottom: 0.5em;
    }
    > .user-caroussel {
      margin-top: 0.5em;
      flex-basis: 15%;
    }
    > .wrapper {
      position: relative;
      margin: 0.25em 1em;
      height: 2em;
      > h2 {
        font-size: 1.5em;
        font-weight: var(--bold-font-weight);
        position: fixed;
      }
    }
  }
</style>

<script>
  import EloCaroussel from "@/components/EloCaroussel.vue";
  import UserCaroussel from "@/components/UserCaroussel.vue";
  import Spectrum from "@/components/Spectrum.vue";
  import api from "@/services/apiService.js";
  import { getSeenEncountersCookie } from "@/services/cookieService.js";

  export default {
    name: "Ranking",
    components: {
      EloCaroussel,
      UserCaroussel,
      Spectrum,
    },
    data() {
      return {
        candidates: [],
        trackersMap: {},
        candidatesByUserOrder: [],
        leftRatio: undefined,
      };
    },
    created() {
      this.getCandidates();
    },
    methods: {
      async getCandidates() {
        const seenEncountersCookie = getSeenEncountersCookie();
        const response = await api.getAllCandidates(seenEncountersCookie);
        this.candidates = response.data.candidates.sort(
          (c1, c2) => c1.score < c2.score
        );
        this.trackersMap = response.data.trackersMap;
        this.leftRatio = this.computeLeftistsRatio();
        if (response.data.path) {
          console.log(this.candidates.map((c) => c._id));
          this.candidatesByUserOrder = response.data.path.map((cId, idx) => {
            const cIdx = this.candidates.findIndex((c) => c._id == cId);
            if (cIdx >= 0) {
              const candidate = this.candidates.find((c) => c._id == cId);
              candidate.isCorrectOrder = idx == cIdx;
              return candidate;
            }
          });
        }
      },
      computeLeftistsRatio() {
        // this.candidates needs to be not empty and sorted by descending score
        for (let i = 0; i < this.candidates.length - 1; i++) {
          let score1 = this.candidates[i].score;
          let score2 = this.candidates[i + 1].score;
          if (score1 * score2 > 0) {
            continue;
          }
          let ratio = score1 / (score1 - score2); // ratio between the two candidates just before and after the 0 point
          return (i + ratio) / (this.candidates.length - 1); // ratio relative to all the candidates
        }
      },
    },
  };
</script>
