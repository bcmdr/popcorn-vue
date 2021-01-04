<template>
  <div class="result-poster">
    {{ this.result.title }} {{ this.result.release_date | getYear }}
    <button>Interested</button>
  </div>
</template>

<script>
export default {
  props: ["result"],
  created() {
    console.log("ResultPreview: ", this.result);
  },
  filters: {
    getYear(val) {
      return val?.split("-")[0];
    }
  }
};
</script>

<style></style>
