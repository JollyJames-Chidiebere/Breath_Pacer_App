import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { signUp } from "../../Breath_Pacer/utils/auth";
import CustomToast from "../components/CustomToast";

type ToastType = { type: "success" | "error" | "info"; message: string } | null;

export default function Signup() {
    const [username, setUsername] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [toast, setToast] = useState < ToastType > (null);

    const handleSignup = async () => {
        if (!email || !password) {
            setToast({ type: "error", message: "Please fill all fields." });
            return;
        }
        try {
            await signUp(email, password, username);
            setToast({ type: "success", message: "Account created successfully! Welcome! 🎉" });
            setTimeout(() => {
                router.push("../(tabs)/breathing1");
            }, 1000);
        } catch (error: any) {
            setToast({ type: "error", message: error.message || "Signup failed. Please try again." });
        }
    };

    return (
        <LinearGradient
            colors={["#f6f9f6", "#d6e4d6"]}
            style={{ flex: 1 }}    >
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.container}>
                    {/* Heading */}
                    <Text style={styles.heading}>
                        Welcome to <Text style={styles.highlight}>BHAKTI</Text>
                    </Text>
                    <Text style={styles.subText}>Create your account to get started</Text>

                    {/* Email */}
                    <View style={styles.inputWrapper}>
                        <Ionicons name="mail-outline" size={20} color="#6B7757" style={styles.icon} />
                        <TextInput
                            placeholder="Enter your email address"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Username */}
                    <View style={styles.inputWrapper}>
                        <Ionicons name="person-outline" size={20} color="#6B7757" style={styles.icon} />
                        <TextInput
                            placeholder="User name"
                            placeholderTextColor="#999"
                            value={username}
                            onChangeText={setUsername}
                            style={styles.input}
                        />
                    </View>

                    {/* Contact */}
                    <View style={styles.inputWrapper}>
                        <Ionicons name="call-outline" size={20} color="#6B7757" style={styles.icon} />
                        <TextInput
                            placeholder="Contact number"
                            placeholderTextColor="#999"
                            value={contact}
                            onChangeText={setContact}
                            style={styles.input}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color="#6B7757" style={styles.icon} />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.input}
                        />
                    </View>

                    {/* Sign Up Button */}
                    <Pressable style={styles.button} onPress={handleSignup}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </Pressable>

                    {/* Already have account? */}
                    <TouchableOpacity onPress={() => router.push("/authentication/login")}>
                        <Text style={styles.loginLink}>
                            Already have an account? <Text style={styles.loginLinkBold}>Log In</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Custom Toast */}
            {toast && (
                <CustomToast
                    type={toast.type}
                    message={toast.message}
                    onHide={() => setToast(null)}
                />
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    scroll: { flexGrow: 1 },
    container: { flex: 1, paddingHorizontal: 30, paddingTop: 60, paddingBottom: 30 },
    heading: { fontSize: 28, fontWeight: "700", color: "#2E4B3E", textAlign: "center" },
    highlight: { color: "#4CAF50" },
    subText: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 30 },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        height: 50,
    },
    icon: { marginRight: 10 },
    input: { flex: 1, fontSize: 15, color: "#333" },
    button: {
        backgroundColor: "#4CAF50",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    loginLink: { textAlign: "center", marginTop: 20, fontSize: 14, color: "#666" },
    loginLinkBold: { fontWeight: "700", color: "#4CAF50" },
});

