const Firebase = require('firebase-admin');
const serviceAccount = require('../ultimatestore-2eb0e-firebase-adminsdk-fbsvc-5342babe93.json');

Firebase.initializeApp({
  credential: Firebase.credential.cert(serviceAccount),
  storageBucket: 'ultimatestore-2eb0e.appspot.com',
});

module.exports = Firebase;