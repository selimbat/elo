<template>
  <div class="tracker">
    <div class="legend">
      <span>A été jugé</span>
      <ul>
        <li class="left">+ à gauche</li>
        <li class="right">+ à droite</li>
      </ul>
      <span>que</span>
    </div>
    <table>
      <tr v-for="candidate in filteredCandidates" :key="candidate.lastname">
        <td class="opponent-name">
          <span>{{ candidate.lastname }}</span>
        </td>
        <td class="proportion-display">
          <div
            class="proportions"
            :style="passRatiosToStyle(candidate._id)"
          ></div>
        </td>
      </tr>
    </table>

    <span class="total"
      >Sur un total de
      <b>{{ trackerService.getTotalEncounters() }}</b> rencontres.</span
    >
  </div>
</template>

<script>
  import TrackerService from "@/services/trackerService.js";

  export default {
    name: "CandidateTracker",
    props: {
      candidateIdToTrack: {
        type: String,
        required: true,
      },
      candidates: {
        type: Array,
        required: true,
      },
      trackersMap: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        trackerService: null,
      };
    },
    created() {
      this.trackerService = new TrackerService(
        this.candidateIdToTrack,
        this.trackersMap
      );
    },
    computed: {
      filteredCandidates() {
        return this.candidates
          .filter(
            (c) =>
              c._id != this.candidateIdToTrack &&
              this.trackerService.hasEverEncounteredCandidate(c._id)
          )
          .sort((c1, c2) => c1.score < c2.score);
      },
    },
    methods: {
      passRatiosToStyle(opponentId) {
        let ratios = this.trackerService.getRatiosAgainstCandidate(opponentId);
        let ratiosToStyle = "background: linear-gradient(90deg,";
        ratiosToStyle += `var(--left-color) ${100 * ratios.left}%,`;
        ratiosToStyle += `var(--neutral-color) ${100 * ratios.left}%,`;
        ratiosToStyle += `var(--neutral-color) ${100 *
          (ratios.left + ratios.neutral)}%,`;
        ratiosToStyle += `var(--right-color) ${100 *
          (ratios.left + ratios.neutral)}%)`;
        return ratiosToStyle;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .tracker {
    box-sizing: border-box;
    font-size: 1.1rem;
    text-align: left;
    line-height: 1.3;
    padding: 1.5rem 1em;
    border-radius: var(--border-radius);
    background-color: rgba(190, 207, 221, 0.92);
    box-shadow: 0.5em 0.5em 1em #1119;
  }
  .legend > ul {
    display: flex;
    justify-content: space-around;
    font-size: 1rem;
    & > li {
      --line-height: 1.5em;
      line-height: var(--line-height);
      &::before {
        content: "";
        display: inline-block;
        width: 1em;
        border-width: 0.25em;
        border-style: solid;
        border-radius: var(--line-height);
        margin: 0 0.125em 0.125em 0.125em;
      }
    }
  }

  table {
    width: 100%;
    margin: 0.5em 0;
  }

  .opponent-name {
    text-align: right;
    width: 50%;
    position: relative;
    &::before {
      content: "&nbsp;";
      visibility: hidden;
    }
    > span {
      position: absolute;
      inset: 0 0.5em 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .proportion-display {
    width: 50%;
    .proportions {
      --thickness: 0.3rem;
      width: 100%;
      display: inline-block;
      box-sizing: border-box;
      padding: var(--thickness);
      background: linear-gradient(
        90deg,
        var(--left-color) 30%,
        var(--neutral-color) 30%,
        var(--neutral-color) 90%,
        var(--right-color) 90%
      );
      border-radius: var(--thickness);
    }
  }

  @mixin spectrumColor($color) {
    &::before {
      border-color: $color;
    }
  }

  .left {
    @include spectrumColor(var(--left-color));
  }

  .right {
    @include spectrumColor(var(--right-color));
  }
</style>
