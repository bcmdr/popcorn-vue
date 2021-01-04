import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { auth } from "./firebase";
import vueDebounce from "vue-debounce";

Vue.config.productionTip = false;

Vue.prototype.$tmdbApiKey = "251ba64a492fa521304db43e5fa3d2ad";

Vue.use(vueDebounce);

let app;
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }

  if (user) {
    store.dispatch("fetchUserProfile", user);
  }
});
