<template>
  <section>
    <Card name="Batman" party="Make Gotham Great Again"></Card>
    <div class="input">
      <p id="is">est :</p>
      <div class="actions">
        <a>plus à gauche</a>
        <a>pareil</a>
        <a>plus à droite</a>
      </div>
      <p id="than">que</p>
    </div>
    <Card name="Superman"></Card>
  </section>
</template>

<script>
  import Card from "@/components/Card.vue";
  export default {
    name: "Encounter",
    components: {
      Card,
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
    border-radius: 15px;
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
      border-radius: 8px;
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
