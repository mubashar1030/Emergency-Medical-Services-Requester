const firebase = require('firebase');
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyCECnug1bn-_XP6d9CLA9rgx5MXTyOWcOc",
    authDomain: "emsr-firebase.firebaseapp.com",
    databaseURL: "https://emsr-firebase.firebaseio.com",
    projectId: "emsr-firebase",
    storageBucket: "emsr-firebase.appspot.com",
    messagingSenderId: "1048117696578",
    appId: "1:1048117696578:web:d4eca8a4859bba565f35db",
    measurementId: "G-LREZYF0XKG"

  };

if (!firebase.apps.length) { firebase.initializeApp(config); }
let database = firebase.firestore();
let auth = firebase.auth()


module.exports = {
    db: database,
    auth: firebase.auth(),
    firebase: firebase
};