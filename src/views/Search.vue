<template>
  <div id="search">
    <form @submit.prevent="submitSearch" class="search-form">
      <input v-model="query" v-debounce:300ms="submitSearch" />
    </form>
    <div class="results">
      <ul>
        <li v-for="result in results" :key="result.id">
          <ResultPreview :result="result"></ResultPreview>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ResultPreview from "../components/ResultPreview";
export default {
  components: {
    ResultPreview
  },
  data() {
    return {
      query: "",
      page: 1,
      results: []
    };
  },
  created() {
    this.query = this.$route.query.title;
    this.submitSearch(this.$route.query.title);
    console.log(this.$tmdbApiKey);
  },
  computed: {
    searchUrl() {
      return `https://api.themoviedb.org/3/search/movie?api_key=${this.$tmdbApiKey}&language=en-US&query=${this.query}&page=${this.page}&include_adult=false`;
    }
  },
  filters: {
    formatDate(val) {
      return val?.split("-")[0];
    }
  },
  methods: {
    async submitSearch() {
      if (!this.query) return;
      this.results = (await (await fetch(this.searchUrl)).json()).results;
      console.log(this.results);
    }
  }
};
</script>

<style></style>
