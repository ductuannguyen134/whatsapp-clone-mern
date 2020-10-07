import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyA86TstWc5DXGFWCSJX8831hiE024x7h6E",
    authDomain: "whatsapp-mern-6f13d.firebaseapp.com",
    databaseURL: "https://whatsapp-mern-6f13d.firebaseio.com",
    projectId: "whatsapp-mern-6f13d",
    storageBucket: "whatsapp-mern-6f13d.appspot.com",
    messagingSenderId: "909109388741",
    appId: "1:909109388741:web:a4209447aec0b5dda997ac"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth,provider};
export default db;