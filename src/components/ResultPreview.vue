<template>
  <div class="result-poster">
    {{ this.result.title }} {{ this.result.release_date | getYear }}
    <button @click="interestResult">Interested</button>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["result"],
  computed: {
    ...mapState(["userProfile"])
  },
  created() {
    console.log("ResultPreview: ", this.result);
  },
  filters: {
    getYear(val) {
      return val?.split("-")[0];
    }
  },
  methods: {
    interestResult() {
      this.$store.dispatch("interestResult", { result: this.result });
    }
  }
};
</script>

<style></style>
