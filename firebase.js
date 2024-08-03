// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCn_dL0WIXPndUQT76jP59rh_oUdM2JRvE",
  authDomain: "hs-inventory-app.firebaseapp.com",
  projectId: "hs-inventory-app",
  storageBucket: "hs-inventory-app.appspot.com",
  messagingSenderId: "706117713358",
  appId: "1:706117713358:web:ee5fea9b2e126261aa3f9f",
  measurementId: "G-9CWHBWBN49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };