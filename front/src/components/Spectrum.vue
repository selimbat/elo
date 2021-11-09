<template>
  <div class="spectrum">
    <div class="overlay-left" :style="`width:${this.leftRatio * 100}%`"></div>
    <span class="middle"></span>
    <div class="overlay-right" :style="`width:${this.rightRatio * 100}%`"></div>
  </div>
</template>

<style lang="scss" scoped>
  .spectrum {
    --arrow-size: 1em;
    height: 1em;
    position: relative;
    width: calc(calc(100% - var(--card-width)));
    margin: 2.5em var(--arrow-size);
    border-left: calc(calc(var(--card-width) / 2) - var(--arrow-size)) solid
      var(--left-color);
    border-right: calc(calc(var(--card-width) / 2) - var(--arrow-size)) solid
      var(--right-color);
    box-shadow: 0.5em 0.5em 2em rgb(113, 111, 126);
  }
  .spectrum:before {
    content: "";
    position: absolute;
    top: -50%;
    left: calc(0px - calc(var(--card-width) / 2));
    border-right: var(--arrow-size) solid var(--left-color);
    border-top: var(--arrow-size) solid transparent;
    border-bottom: var(--arrow-size) solid transparent;
  }
  .spectrum:after {
    content: "";
    position: absolute;
    top: -50%;
    right: calc(0px - calc(var(--card-width) / 2));
    border-left: var(--arrow-size) solid var(--right-color);
    border-top: var(--arrow-size) solid transparent;
    border-bottom: var(--arrow-size) solid transparent;
  }
  .overlay-left,
  .overlay-right {
    display: inline-block;
    height: 100%;
  }
  .overlay-left {
    background: linear-gradient(
      270deg,
      var(--neutral-color) 0%,
      var(--left-color) 100%
    );
  }
  .overlay-right {
    background: linear-gradient(
      90deg,
      var(--neutral-color) 0%,
      var(--right-color) 100%
    );
  }
  .middle {
    position: absolute;
    top: -30%;
    height: 160%;
    width: 2px;
    background-color: var(--text-color);
  }
</style>

<script>
  export default {
    name: "Spectrum",
    props: {
      leftRatio: { type: Number, required: true },
    },
    computed: {
      rightRatio() {
        return 1 - this.leftRatio;
      },
    },
  };
</script>
