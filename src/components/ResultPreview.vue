<template>
  <div class="result-poster">
    {{ result.title }} {{ result.release_date | getYear }}
    <button @click="interestResult">
      {{
        userResults[result.id] && userResults[result.id].interested
          ? "Interested"
          : "Not Interested"
      }}
    </button>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["result"],
  computed: {
    ...mapState(["userProfile", "userResults"])
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
      console.log("Prop Result:", this.result);
      this.$store.dispatch("interestResult", { result: this.result });
    }
  }
};
</script>

<style></style>
