// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD3naDcENZxi1JbDoR19R9OXxN6LxZ7c70',
  authDomain: 'weorder-fwado.firebaseapp.com',
  projectId: 'weorder-fwado',
  storageBucket: 'weorder-fwado.appspot.com',
  messagingSenderId: '221608589264',
  appId: '1:221608589264:web:be0a8180a1324e2e216bd5',
  measurementId: 'G-S61LND28R6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// export const analytics = getAnalytics(app);
export const provider = new GoogleAuthProvider();
