<template>
  <div
    class="card"
    ref="card"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @mousemove="parallax"
    :style="{
      backgroundImage: `url(${this.candidate ? this.candidate.imgUrl : ''})`,
    }"
    :class="{ loading: loading }"
  >
    <div class="infos" v-if="!loading">
      <h2>{{ candidate.name }}</h2>
      <h3>
        {{ candidate.party.name ? candidate.party.name : "Indépendant.e" }}
      </h3>
    </div>
    <div class="infos" v-if="loading">
      <span class="skeleton-text"></span>
      <span class="skeleton-text"></span>
    </div>
    <transition name="fade">
      <div class="center-details" v-if="enableInfos && hover">
        <p class="details" ref="details">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad
          reprehenderit officiis accusantium dolore dolorum perspiciatis ab
          labore, exercitationem accusamus rem laboriosam maiores. Officia
          numquam dolore recusandae quasi blanditiis cum excepturi?
        </p>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "Card",
    props: {
      candidate: {
        type: Object,
      },
      enableInfos: {
        type: Boolean,
        default: true,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        hover: false,
      };
    },
    methods: {
      parallax(ev) {
        if (!this.enableInfos || !this.hover) return;
        var el = this.$refs.details;
        var rect = this.$refs.card.getBoundingClientRect();
        var x = (ev.clientX - rect.left) / rect.width;
        var y = (ev.clientY - rect.top) / rect.height;
        x = 2 * x - 1;
        y = 2 * y - 1;
        el.style.transform = `rotateX(${10 * y}deg)
        rotateY(${-10 * x}deg) translate(${-2 * x}em,${-2 * y}em)`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .card {
    font-size: 30px;
    position: relative;
    height: 100%;
    width: 20rem;
    margin: 0 1em;
    border-radius: var(--border-radius);
    background-size: cover;
    background-position: center;
  }
  .card.loading {
    background-color: rgb(172, 231, 255);
  }
  .card > .infos {
    position: absolute;
    inset: auto 2rem 1.5rem 2rem;
    background-color: rgba(190, 207, 221, 0.92);
    padding: 0.5em 0.25em;
    border-radius: var(--border-radius);
    h3 {
      font-size: 18px;
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
  }
  .center-details {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    --ratio: 65%;
    width: 110%;
    min-height: var(--ratio);
  }
  .details {
    box-sizing: border-box;
    font-size: 18px;
    text-align: left;
    line-height: 1.3;
    padding: 2rem;
    border-radius: var(--border-radius);
    perspective: 150px;
    background-color: rgba(190, 207, 221, 0.92);
    box-shadow: 0.5em 0.5em 1em #1119;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
