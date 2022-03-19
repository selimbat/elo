<template>
  <div class="overlay">
    <p>
      Ce site n'est pas adapté pour une expérience sur mobile. Veuillez
      l'essayer sur un ordinateur.
    </p>
  </div>
</template>

<script>
  export default {
    name: "MobileUnsupportedOverlay",
  };
</script>

<style lang="scss" scoped>
  .overlay {
    z-index: 2;
    position: absolute;
    inset: 0;
    background-color: var(--neutral-color);
    & p {
      position: absolute;
      max-width: 100%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: var(--text-color);
    }
  }

  @media (min-width: 940px) {
    .overlay {
      display: none;
    }
  }
</style>
