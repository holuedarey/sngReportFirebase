import firebase from 'firebase'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAaa_RCbu3xbC1EAx_hLntD4Sqlu5pJ1Kk",
    authDomain: "clockingapp-31013.firebaseapp.com",
    projectId: "clockingapp-31013",
    storageBucket: "clockingapp-31013.appspot.com",
    messagingSenderId: "685074263425",
    appId: "1:685074263425:web:939384d713e0d82719cc80"
};

// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);