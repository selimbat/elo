<template>
  <div
    class="card"
    ref="card"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
    @mousedown.prevent=""
    @focus="focus = true"
    @blur="focus = false"
    :class="{ loading: loading }"
  >
    <div
      v-if="withImage"
      class="image"
      :style="{
        backgroundImage:
          'url(' + (!loading && candidate ? candidate.imgUrl : '') + ')',
      }"
    >
      <transition name="fade">
        <div class="center-details" v-if="showInfos">
          <slot></slot>
        </div>
      </transition>
    </div>
    <div :class="withImage ? 'infos' : 'infos withoutImage'" v-if="loading">
      <span class="skeleton-text"></span>
      <span class="skeleton-text"></span>
    </div>
    <div :class="withImage ? 'infos' : 'infos withoutImage'" v-else>
      <h2>{{ `${candidate.firstname} ${candidate.lastname}` }}</h2>
      <div class="content" v-if="withImage">
        <h3>
          {{ candidate.party.name ? candidate.party.name : "Indépendant.e" }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Card",
    props: {
      candidate: {
        type: Object,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      withImage: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        hover: false,
        focus: false,
      };
    },
    computed: {
      showInfos() {
        return !this.loading && (this.hover || this.focus);
      },
    },
    methods: {
      onMouseOver(event) {
        if (event.target.parentElement == this.$refs.card) {
          this.hover = true;
        }
      },
      onMouseLeave() {
        this.hover = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .card {
    font-size: 30px;
    position: relative;
    height: 100%;
    width: var(--card-width);
    margin: 0 1rem;
    border-radius: var(--border-radius);
    box-shadow: 0.5rem 0.5rem 2rem #888c9e;
    --infos-height: 25%;
    --infos-min-height: 3.25rem;
  }
  .card > .image {
    position: absolute;
    inset: 0 0 unquote("max(var(--infos-height), var(--infos-min-height))") 0; //sass compiler is broken when using max() with var() or calc()
    height: calc(100% - var(--infos-height));
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    background-size: cover;
    background-position: top;
  }

  .card.loading > .image {
    background-color: rgb(172, 231, 255);
  }
  .card > .infos {
    position: absolute;
    inset: calc(100% - max(var(--infos-height), var(--infos-min-height))) 0 0 0;
    background-color: rgb(250, 250, 250);
    padding: 0.5em 0.5em;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    text-align: left;
    h2 {
      font-weight: var(--bold-font-weight);
      padding: 0.25em 0 0.5em 0;
      font-size: 1.2rem;
    }
    h3 {
      font-size: 1rem;
    }
    .skeleton-text {
      display: block;
      height: 1ch;
      background-color: rgb(128, 139, 148);
      border-radius: var(--border-radius);
      & + .skeleton-text {
        margin-top: 0.3ch;
      }
      &:first-of-type {
        width: 70%;
      }
    }
    &.withoutImage {
      inset: 0;
      border-radius: var(--border-radius);
    }
  }
  .center-details {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 110%;
    z-index: 1;
  }
  /* infos hover effect transition */
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.2s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .fade-enter {
    transform: translate(-50%, -50%) translateX(-1em);
  }
  .fade-leave-to {
    transform: translate(-50%, -50%) translateX(1em);
  }
</style>
