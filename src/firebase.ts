import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
   apiKey: "AIzaSyDPZxxTuIoew0rcJVb-h-WM-5BtU4OlcIM",
    authDomain: "trippr-flutter.firebaseapp.com",
    databaseURL: "https://trippr-flutter-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "trippr-flutter",
   storageBucket: "trippr-flutter.firebasestorage.app",
   messagingSenderId: "198461873701",
   appId: "1:198461873701:web:2e93459247192c5195e9cc",
   measurementId: "G-XV5KC7SYSC"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { createUserWithEmailAndPassword };