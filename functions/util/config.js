const firebaseConfig = {
    apiKey: "AIzaSyCE5QzMjR2FawPKnEqXxA7ZONG3yuGE7bI",
    authDomain: "vocabsnotebook.firebaseapp.com",
    databaseURL: "https://vocabsnotebook.firebaseio.com",
    projectId: "vocabsnotebook",
    storageBucket: "vocabsnotebook.appspot.com",
    messagingSenderId: "215143497303",
    appId: "1:215143497303:web:9e4774ddc1a70b1ef7ad12",
    measurementId: "G-S61D6B8VPG",
};

const admin = require("firebase-admin");
const firebase = require("firebase");

admin.initializeApp();
firebase.initializeApp(firebaseConfig);

exports.config = firebaseConfig;
exports.admin = admin;
exports.firestore = firebase.firestore();
exports.storage = admin.storage();
exports.auth = firebase.auth();