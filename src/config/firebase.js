import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDX4BQPw6Y7WT64oDP9g3Wq1RigyXH65Ps",
    authDomain: "gfgg-55d77.firebaseapp.com",
    projectId: "gfgg-55d77",
    storageBucket: "gfgg-55d77.firebasestorage.app",
    messagingSenderId: "332902299895",
    appId: "1:332902299895:web:7a3009966d959c3971bbf2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
