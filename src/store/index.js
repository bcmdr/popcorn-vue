import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../firebase";
import router from "../router/index";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userProfile: {},
    posts: [],
    userResults: [],
    userStatuses: {}
  },
  getters: {},
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setPosts(state, val) {
      state.posts = val;
    },
    setUserResults(state, val) {
      Vue.set(state, "userResults", val);
    },
    setUserStatuses(state, val) {
      console.log("setting", val);
      Vue.set(state, "userStatuses", val);
    },
    updateUserStatus(state, { movieId, statusId, statusValue }) {
      state.userStatuses[movieId][statusId] = statusValue;
    }
  },
  actions: {
    async login({ dispatch }, form) {
      // sign user in
      const { user } = await fb.auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );

      // fetch user profile and set in state
      dispatch("fetchUserProfile", user);
    },
    async fetchUserProfile({ commit, dispatch }, user) {
      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get();
      const userData = userProfile.data();
      userData.uid = user.uid;

      // set user profile in state
      commit("setUserProfile", userData);

      dispatch("fetchUserStatuses", user.uid);

      // change route to dashboard
      if (router.currentRoute.path === "/login") {
        router.push("/");
      }
    },
    async fetchUserStatuses({ commit }, user) {
      const userId = user.uid;
      const statusesRef = fb.statusesCollection.doc(userId);
      console.log(userId);
      const statusesData = await statusesRef.get();

      if (!statusesData.exists) {
        let userStatuses = {
          [userId]: {}
        };
        console.log("first?");
        commit("setUserStatuses", userStatuses);
        return;
      }

      commit("setUserStatuses", statusesData);
    },
    async signup({ dispatch }, form) {
      // sign user up
      const { user } = await fb.auth.createUserWithEmailAndPassword(
        form.email,
        form.password
      );

      // create user profile object in userCollections
      await fb.usersCollection.doc(user.uid).set({
        name: form.name
      });

      // fetch user profile and set in state
      dispatch("fetchUserProfile", user);
    },
    async logout({ commit }) {
      await fb.auth.signOut();

      // clear userProfile and redirect to /login
      commit("setUserProfile", {});
      router.push("/login");
    },
    async createPost({ state }, post) {
      await fb.postsCollection.add({
        createdOn: new Date(),
        content: post.content,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        comments: 0,
        likes: 0
      });
    },
    async likePost(options, post) {
      const userId = fb.auth.currentUser.uid;
      const docId = `${userId}_${post.id}`;

      // check if user has liked post
      const doc = await fb.likesCollection.doc(docId).get();
      if (doc.exists) {
        return;
      }

      // create post
      await fb.likesCollection.doc(docId).set({
        postId: post.id,
        userId: userId
      });

      // update post likes count
      fb.postsCollection.doc(post.id).update({
        likes: post.likesCount + 1
      });
    },
    async saveStatus({ commit }, { movieId, statusId, statusValue }) {
      const userId = fb.auth.currentUser.uid;
      const movieStatusRef = fb.statusesCollection
        .doc(userId)
        .collection("movies")
        .doc(movieId);
      // const movieStatusDoc = await movieStatusRef.get();

      await movieStatusRef.update({
        [statusId]: statusValue
      });

      commit("updateUserStatus", { userId, movieId, statusId, statusValue });
    },
    async interestResult({ state, commit }, { result }) {
      const userId = fb.auth.currentUser.uid;
      const docId = String(result.id);

      // check if result has been saved
      const doc = await fb.resultsCollection.doc(docId).get();

      if (!doc.exists) {
        // create result
        await fb.resultsCollection.doc(docId).set({
          ...result,
          interested: [userId]
        });
        commit("setUserResults", [
          ...state.userResults,
          {
            ...result,
            interested: [userId]
          }
        ]);
        return;
      }

      if (!result.interested) {
        await fb.resultsCollection.doc(docId).update({
          interested: [userId]
        });
        commit("setUserResults", [
          ...state.userResults,
          { ...result, interested: [userId] }
        ]);
        return;
      }

      if (!result.interested.includes(userId)) {
        await fb.resultsCollection.doc(docId).update({
          // add userId to interested list
          interested: [...result.interested, userId]
        });
        commit("setUserResults", [...state.userResults, result]);
        return;
      }
      // Interested contains user, remove from list
      await fb.resultsCollection.doc(docId).update({
        interested: result.interested.filter(item => item !== userId)
      });
      commit(
        "setUserResults",
        state.userResults.filter(item => item.id !== result.id)
      );
    },
    async fetchUserResults({ commit }, user) {
      let userResults = [];
      const userResultsQuery = await fb.resultsCollection
        .where("interested", "array-contains", user.uid)
        .get();
      userResultsQuery.forEach(doc => userResults.push(doc.data()));

      // set user Results in state
      commit("setUserResults", userResults);

      // change route to dashboard
      if (router.currentRoute.path === "/login") {
        router.push("/");
      }
    },
    async updateProfile({ dispatch }, user) {
      const userId = fb.auth.currentUser.uid;
      // update user object
      await fb.usersCollection.doc(userId).update({
        name: user.name
      });

      dispatch("fetchUserProfile", { uid: userId });

      // update all posts by user
      const postDocs = await fb.postsCollection
        .where("userId", "==", userId)
        .get();
      postDocs.forEach(doc => {
        fb.postsCollection.doc(doc.id).update({
          userName: user.name
        });
      });

      // update all comments by user
      const commentDocs = await fb.commentsCollection
        .where("userId", "==", userId)
        .get();
      commentDocs.forEach(doc => {
        fb.commentsCollection.doc(doc.id).update({
          userName: user.name
        });
      });
    }
  }
});

// realtime firebase connection
// fb.resultsCollection
//   .where("interested", "array-contains", fb.auth.currentUser.uid)
//   .onSnapshot(snapshot => {
//     let resultsArray = [];

//     snapshot.forEach(doc => {
//       let result = doc.data();
//       result.id = doc.id;

//       resultsArray.push(result);
//     });

//     store.commit("setUserResults", resultsArray);
//   });

export default store;
