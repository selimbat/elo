<template>
  <div class="tracker">
    <div class="legend">
      <span>A été jugé</span>
      <ul>
        <li class="left">+ à gauche</li>
        <li class="neutral">pareil</li>
        <li class="right">+ à droite</li>
      </ul>
      <span>que</span>
    </div>
    <table>
      <tr v-for="candidate in filteredCandidates" :key="candidate.lastname">
        <td class="opponent-name">
          <span>{{ candidate.lastname }}</span>
        </td>
        <td
          class="proportion-display"
          :style="passRatiosToStyle(candidate._id)"
        >
          <div class="left"></div>
          <div class="neutral"></div>
          <div class="right"></div>
        </td>
      </tr>
    </table>
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
        leftRatio: 0.12,
        rightRatio: 0.54,
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
        let ratiosToStyle = "";
        ratiosToStyle += `--left-ratio: ${100 * ratios.left}%;`;
        ratiosToStyle += `--right-ratio: ${100 * ratios.right}%;`;
        return ratiosToStyle;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .tracker {
    box-sizing: border-box;
    font-size: 18px;
    text-align: left;
    line-height: 1.3;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    background-color: rgba(190, 207, 221, 0.92);
    box-shadow: 0.5em 0.5em 1em #1119;
  }
  .legend {
    margin-bottom: 0.5em;
    & > ul {
      display: flex;
      justify-content: space-between;
      font-size: 0.85em;
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
  }

  .opponent-name {
    text-align: right;
    padding-right: 0.5em;
  }

  .proportion-display {
    width: 50%;
    --border-thickness: 0.3rem;
    --left-ratio: 45%;
    --right-ratio: 30%;
    .left,
    .neutral,
    .right {
      display: inline-block;
      border-style: solid;
      border-top-width: var(--border-thickness);
      border-bottom-width: var(--border-thickness);
      box-shadow: 1px 1px 5px var(--text-color);
    }
    .left {
      width: calc(var(--left-ratio) - var(--border-thickness));
      border-left-width: var(--border-thickness);
      border-radius: var(--border-thickness) 0 0 var(--border-thickness);
    }
    .neutral {
      width: calc(100% - var(--left-ratio) - var(--right-ratio));
    }
    .right {
      width: calc(var(--right-ratio) - var(--border-thickness));
      border-right-width: var(--border-thickness);
      border-radius: 0 var(--border-thickness) var(--border-thickness) 0;
    }
  }

  @mixin spectrumColor($color) {
    &::before {
      border-color: $color;
    }
    border-color: $color;
  }

  .left {
    @include spectrumColor(var(--left-color));
  }

  .neutral {
    @include spectrumColor(var(--neutral-color));
  }

  .right {
    @include spectrumColor(var(--right-color));
  }
</style>
