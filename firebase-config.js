// Connects to the "stoichi" Firebase project. All pages import db/auth
// from here. Only edit this if you create a new Firebase project.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyAugQe0Ze6T4RUW6VVlypy-vJNc9-vjsQI",
  authDomain: "stoichi.firebaseapp.com",
  databaseURL: "https://stoichi-default-rtdb.firebaseio.com/",
  projectId: "stoichi",
  storageBucket: "stoichi.firebasestorage.app",
  messagingSenderId: "673738505306",
  appId: "1:673738505306:web:16aeaca19d8a0927d8ec63"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);