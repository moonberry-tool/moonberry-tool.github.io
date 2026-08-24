import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/authinication';

// Public Firebase web config — safe to expose in client code.
// Data access is controlled by Firestore Security Rules, not by hiding this config.
const firebaseConfig = {
  apiKey: 'AIzaSyDyFhhTPocKAXdVR58q67-Bw9HwUZ11-n0',
  authDomain: 'moonberry-tool.firebaseapp.com',
  projectId: 'moonberry-tool',
  storageBucket: 'moonberry-tool.firebasestorage.app',
  messagingSenderId: '189065397088',
  appId: '1:189065397088:web:892685e6aeee3282165405',
  measurementId: 'G-2WX5D3GF6T',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
