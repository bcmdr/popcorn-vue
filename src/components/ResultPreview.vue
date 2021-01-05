<template>
  <div class="result-poster">
    {{ result.title }} {{ result.release_date | getYear }}
    <button @click="interestResult">
      {{ isInterested ? "Not Interested" : "Interested" }}
    </button>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["result"],
  computed: {
    ...mapState(["userProfile", "userResults"]),
    userResult() {
      return this.userResults.find(item => item.id === this.result.id);
    },
    isInterested() {
      let vm = this;
      return this.userResults.some(function(item) {
        return item.id === vm.result.id;
      });
    }
  },
  filters: {
    getYear(val) {
      return val?.split("-")[0];
    }
  },
  methods: {
    interestResult() {
      let newResult = this.userResult || this.result;
      this.$store.dispatch("interestResult", {
        result: newResult
      });
    }
  }
};
</script>

<style></style>
