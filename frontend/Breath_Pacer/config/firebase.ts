// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDOkMpuUFOjpYeRY8XKOXqcRTb4rY3lY80",
    authDomain: "breath-pacer-app.firebaseapp.com",
    projectId: "breath-pacer-app",
    storageBucket: "breath-pacer-app.firebasestorage.app",
    messagingSenderId: "653302806828",
    appId: "1:653302806828:web:3b42b74f3ae648738d9489",
    measurementId: "G-BTGL8BQ0QH"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth (persistence is handled automatically by Firebase)
export const auth = getAuth(app);

export const db = getFirestore(app);
export default app;