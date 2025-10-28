import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
const {getReactNativePersistence} = require("firebase/auth") as any;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLbRKcI8dDsvJmu8tQVJZdp11RWMelSFg",
  authDomain: "motomap-mottu.firebaseapp.com",
  projectId: "motomap-mottu",
  storageBucket: "motomap-mottu.firebasestorage.app",
  messagingSenderId: "973889842901",
  appId: "1:973889842901:web:e2b3446086438da1e7bc5c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app,{
  persistence:getReactNativePersistence(AsyncStorage)
});

export {auth}