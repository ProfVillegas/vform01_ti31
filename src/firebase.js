import firebase from "firebase/compat/app";

import "firebase/compat/auth";

import "firebase/compat/firestore";
import "firebase/compat/storage";

let firebaseConfig = {
  apiKey: "AIzaSyBMNVzWDn5ZpXn_9EDspfxBWL-hdFsxaCY",
  authDomain: "smprofesorut.firebaseapp.com",
  databaseURL: "https://smprofesorut-default-rtdb.firebaseio.com",
  projectId: "smprofesorut",
  storageBucket: "smprofesorut.appspot.com",
  messagingSenderId: "687492598689",
  appId: "1:687492598689:web:38adc665f0356e296419e0",
  measurementId: "G-664FWH7FE7",
};

firebase.initializeApp(firebaseConfig);
export const FirebaseStorage = firebase.storage();
export default firebase.firestore();
