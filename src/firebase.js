import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || 'AIzaSyCYUla9Zpq6vT9FKx_W5YYJZsrzyc935DM',
  authDomain: 'finance.prealyse.com',
  projectId: 'finance-b4eab',
  storageBucket: 'finance-b4eab.appspot.com',
  messagingSenderId: '655024979618',
  appId: '1:655024979618:web:ca37a95f27726acecee1fb',
  measurementId: 'G-RD978Y602R'
}

const app = initializeApp(firebaseConfig)
getAnalytics(app)
