<template>
  <div class="ranking">
    <CandidatesList />
  </div>
</template>

<script>
  import CandidatesList from "@/components/CandidatesList.vue";

  export default {
    name: "Ranking",
    components: {
      CandidatesList,
    },
  };
</script>
