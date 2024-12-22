import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAR18iQZKavcQdayDO6Uwx5FWAqa8jSNtw",
  authDomain: "sample-firebase-psc.firebaseapp.com",
  projectId: "sample-firebase-psc",
  storageBucket: "sample-firebase-psc.firebasestorage.app",
  messagingSenderId: "81413542602",
  appId: "1:81413542602:web:9c3154489ec2713ddf1a33"
}
// Inicializa Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }
