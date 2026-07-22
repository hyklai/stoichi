// This file connects to YOUR Firebase project ("stoichi").
// teacher.html, student.html, and display.html all import this same file,
// so they all end up talking to the same shared database and the same
// authentication instance.
// You should not need to edit this file again unless you create a new
// Firebase project from scratch.

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

// Other files import "db" from here to reach the shared database, and
// "auth" to sign in (anonymously for students/display, with a real
// email+password for the teacher panel).
export const db = getDatabase(app);
export const auth = getAuth(app);