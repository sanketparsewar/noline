import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "engaged-octane-465008-v5",
  "appId": "1:1058223662625:web:784141c1194e70b1196560",
  "apiKey": "AIzaSyB6I91pCxmHRyD1CqWxJec1lhRJEuEu05g",
  "authDomain": "engaged-octane-465008-v5.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-eb260891-0f52-495c-9e90-90c3897249c7",
  "storageBucket": "engaged-octane-465008-v5.firebasestorage.app",
  "messagingSenderId": "1058223662625",
  "measurementId": ""
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
