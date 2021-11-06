<template>
  <p>
    {{ description }}
  </p>
</template>

<script>
  export default {
    name: "CandidateDescription",
    props: {
      description: {
        type: String,
        required: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  p {
    box-sizing: border-box;
    font-size: 18px;
    text-align: left;
    line-height: 1.3;
    padding: 2rem;
    border-radius: var(--border-radius);
    background-color: rgba(190, 207, 221, 0.92);
    box-shadow: 0.5em 0.5em 1em #1119;
  }
</style>
