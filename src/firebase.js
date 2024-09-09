import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAQ9XEZ2JbyePFrcHIo10ABO0jjnj86wv4",
    authDomain: "zenly-modoki.firebaseapp.com",
    projectId: "zenly-modoki",
    storageBucket: "zenly-modoki.appspot.com",
    messagingSenderId: "101580577727",
    appId: "1:101580577727:web:501e4310df17bd85955f0a",
    measurementId: "G-SKZ7706GLJ"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, doc, setDoc, onSnapshot };