import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import API from "./api";
import { auth } from "../config/firebase";

/**
 * Save session data locally when user is offline
 */
export const saveOfflineSession = async (session: any) => {
    try {
        const existing = await AsyncStorage.getItem("unsentSessions");
        const queue = existing ? JSON.parse(existing) : [];
        queue.push(session);
        await AsyncStorage.setItem("unsentSessions", JSON.stringify(queue));
        console.log("📦 Saved session locally for later sync");
    } catch (error) {
        console.error("❌ Failed to store offline session:", error);
    }
};

/**
 * Try uploading all locally stored sessions when network is available
 */
export const uploadOfflineSessions = async () => {
    try {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            console.log("🚫 Still offline, skipping upload");
            return;
        }

        const user = (auth as import("firebase/auth").Auth).currentUser;

        if (!user) {
            console.warn("No authenticated user found, skipping sync");
            return;
        }

        const stored = await AsyncStorage.getItem("unsentSessions");
        if (!stored) return;

        const sessions = JSON.parse(stored);
        if (sessions.length === 0) return;

        const token = await user.getIdToken();

        const res = await API.post("/sync_sessions/", sessions, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Synced offline sessions:", res.data.synced);
        await AsyncStorage.removeItem("unsentSessions");
    } catch (error) {
        console.error("❌ Offline sync failed:", error);
    }
};

/**
 * Set up a listener to auto-sync when online
 */
export const setupNetworkListener = () => {
    NetInfo.addEventListener((state) => {
        if (state.isConnected) {
            console.log("🌐 Network reconnected, trying to sync...");
            uploadOfflineSessions();
        }
    });
};