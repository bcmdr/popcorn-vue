<template>
  <div class="result-poster">
    {{ result.title }} {{ result.release_date | getYear }}
    <button @click="interestResult">
      {{ isInterested ? "Interested" : "Not Interested" }}
    </button>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["result"],
  computed: {
    ...mapState(["userProfile", "userResults"]),
    isInterested() {
      let vm = this;
      return (
        this.userResults.filter(function(item) {
          return item.id === vm.result.id;
        }).length > 0
      );
    }
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
