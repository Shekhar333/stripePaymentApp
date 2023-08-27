import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  getFirestore,
  setDoc,
  doc,
  connectFirestoreEmulator,
} from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8DTZZc5A6Ygg9if3nLstX2yXoFW4O27o",
  authDomain: "stripepayment-d7262.firebaseapp.com",
  projectId: "stripepayment-d7262",
  storageBucket: "stripepayment-d7262.appspot.com",
  messagingSenderId: "961673793995",
  appId: "1:961673793995:web:e4b25bffacf30ddfc5264e",
  measurementId: "G-6ZMTWRP5DR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
const firestore = getFirestore(app);

if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(firestore, "localhost", 8080);
}

export const db = firestore;
export const userCollection = "users";

export const currentUserIdToken = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    return token;
  }
  return null;
};

export const logInWithEmailAndPassword = async (email, password) => {
  let ret = null;
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    ret = {
      success: true,
      message: "Logged in successfully",
      uid: response.user.uid,
    };
  } catch (err) {
    console.error(err);
    ret = { success: false, message: err.message };
  }
  return ret;
};

export const signUpEmailAndPassword = async (name, email, password) => {
  let ret = null;
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await updateProfile(auth.currentUser, {
      displayName: name,
    });

    ret = { success: true, message: "Signed up successfully", uid: user.uid };
  } catch (err) {
    console.error(err);
    ret = { success: false, message: err.message };
  }
  return ret;
};

export const logout = () => {
  signOut(auth);
};
