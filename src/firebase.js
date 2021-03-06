import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHaqnt4qdSYGr1FNi-Uj9JYHcYcuQcWzE",
  authDomain: "popcorn-bcmdr.firebaseapp.com",
  projectId: "popcorn-bcmdr",
  storageBucket: "popcorn-bcmdr.appspot.com",
  messagingSenderId: "181704777547",
  appId: "1:181704777547:web:34cbe9fe21f60bee5ed2ce",
  measurementId: "G-3G1QZ50J0W"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

const usersCollection = db.collection("users");
const postsCollection = db.collection("posts");
const commentsCollection = db.collection("comments");
const likesCollection = db.collection("likes");
const resultsCollection = db.collection("results");
const interestedCollection = db.collection("interested");
const statusesCollection = db.collection("statuses");

export {
  db,
  auth,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection,
  resultsCollection,
  interestedCollection,
  statusesCollection
};
