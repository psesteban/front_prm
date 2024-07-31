import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyD0HXWRy79KhFykCVDtB4ELZ5PWN0l_zuM',
  authDomain: 'friendly-lamp-427416-r4.firebaseapp.com',
  projectId: 'friendly-lamp-427416-r4',
  storageBucket: 'friendly-lamp-427416-r4.appspot.com',
  messagingSenderId: '213239840470',
  appId: '1:213239840470:web:ff902e45e977fbf9541377'
}

// Inicializa Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }
