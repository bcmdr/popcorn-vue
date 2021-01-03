<template>
  <div id="app">
    <Navigation v-if="showNav"></Navigation>
    <router-view />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Navigation from "@/components/Navigation";

export default {
  components: {
    Navigation
  },
  computed: {
    ...mapState(["userProfile"]),
    showNav() {
      return Object.keys(this.userProfile).length >= 1;
    }
  }
};
</script>
