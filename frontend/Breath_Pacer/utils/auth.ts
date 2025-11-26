// Breath_Pacer/app/utils/auth.ts
import { auth } from "../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";

// Register new user
export async function signUp(email: string, password: string, username?: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with username if provided
    if (username && userCredential.user) {
        await updateProfile(userCredential.user, {
            displayName: username,
        });
    }
    
    return userCredential;
}

// Login existing user
export async function login(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
}

// Logout
export async function logout() {
    return await signOut(auth);
}
