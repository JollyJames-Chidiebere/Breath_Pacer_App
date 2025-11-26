// app/authentication/forgotPassword.tsx
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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../../Breath_Pacer/config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import CustomToast from "../components/CustomToast";

type ToastType = { type: "success" | "error" | "info"; message: string } | null;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [toast, setToast] = useState<ToastType>(null);

  const handleReset = async () => {
    if (!email) {
      setToast({ type: "error", message: "Please enter your email address." });
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setToast({
        type: "success",
        message: "Password reset email sent! Check your inbox (and spam folder). 📧"
      });
      setTimeout(() => {
        router.push("/authentication/login");
      }, 2000);
    } catch (error: any) {
      console.error("Password reset error:", error);

      // Show user-friendly error messages
      if (error.code === "auth/user-not-found") {
        setToast({ type: "error", message: "No account found with this email address." });
      } else if (error.code === "auth/invalid-email") {
        setToast({ type: "error", message: "Please enter a valid email address." });
      } else {
        setToast({ type: "error", message: "Failed to send reset email. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#f6f9f6", "#d6e4d6"]}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          {/* Heading */}
          <Text style={styles.heading}>Forgot Password</Text>
          <Text style={styles.subText}>
            Enter your registered email address and we'll send you a link to reset your password.
          </Text>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#6B7757"
              style={styles.icon}
            />
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

          {/* Reset Button */}
          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleReset}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Text>
          </Pressable>

          {/* Back to Login */}
          <TouchableOpacity
            onPress={() => {

              router.push("/authentication/login");
            }}
          >

            <Text style={styles.linkText}>← Back to Login</Text>
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
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  container: {
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 15,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#9E9E9E",
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  linkText: {
    fontSize: 14,
    color: "#4CAF50",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
