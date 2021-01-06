<template>
  <div class="result-poster">
    {{ result.title }} {{ result.release_date | getYear }}
    <button @click="saveStatus('interested', !isInterested)">
      {{ isInterested ? "Not Interested" : "Interested" }}
    </button>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["result", "userId"],
  computed: {
    ...mapState(["userProfile", "userResults", "userStatuses"]),
    userResult() {
      return this.userResults.find(item => item.id === this.result.id);
    },
    isInterested() {
      // let vm = this;
      // return this.userResults.some(function(item) {
      //   return item.id === vm.result.id;
      // });
      return !!this.userStatuses[this.result.id]?.interested;
    }
  },
  created() {
    console.log(this.userStatuses);
  },
  filters: {
    getYear(val) {
      return val?.split("-")[0];
    }
  },
  methods: {
    saveStatus(statusId, statusValue) {
      this.$store.dispatch("saveStatus", {
        movieId: this.result.id,
        statusId,
        statusValue
      });
    },
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
