require('dotenv').config()

const admin = require('firebase-admin')
const { initializeApp, applicationDefault } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const appAuth = require('firebase/auth')
require('firebase/firestore')
const { Auth, getAuth } = require('firebase-admin/auth')
const firebase = require('firebase/app')
const firebaseAuth = require('firebase/auth')
const credentials = require('../../firebase.json')

const app = initializeApp({
  // credential: applicationDefault(),
  credential: admin.credential.cert(credentials),
})

const db = getFirestore()
const auth = getAuth(app)

const firebaseConfig = {
  apiKey: 'AIzaSyC-VZYam2cCmwOHjNYe5gdzdSIa8v0XzHM',
  authDomain: 'nhq-project.firebaseapp.com',
  projectId: 'nhq-project',
  storageBucket: 'nhq-project.appspot.com',
  messagingSenderId: '148685179232',
  appId: '1:148685179232:web:164027e07af9278f573605',
  measurementId: 'G-4NNS8RNJ50'
}

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)
const appAuth2 = appAuth.getAuth(firebaseApp)

console.log('Firebase initialized')

module.exports = {
  db,
  auth,
  firebaseAuth,
  appAuth2,
}
