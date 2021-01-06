<template>
  <div class="result-poster">
    {{ result.title }} {{ result.release_date | getYear }}
    <button @click="saveStatus('interested', !interested)">
      {{ interested ? "Not Interested" : "Interested" }}
    </button>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      interested: false
    };
  },
  props: ["result", "userId"],
  computed: {
    ...mapState(["userProfile", "userResults", "userStatuses"]),
    userResult() {
      return this.userResults.find(item => item.id === this.result.id);
    }
  },
  created() {
    console.log(this.userStatuses[this.result.id]);
    if (
      this.userStatuses[this.result.id] &&
      this.userStatuses[this.result.id].interested
    ) {
      this.interested = true;
    }
  },
  filters: {
    getYear(val) {
      return val?.split("-")[0];
    }
  },
  methods: {
    saveStatus(statusId, statusValue) {
      console.log(statusValue);
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
