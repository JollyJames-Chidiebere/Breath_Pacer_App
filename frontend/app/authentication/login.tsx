import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { login } from "../../Breath_Pacer/utils/auth";
import CustomToast from "../components/CustomToast";

type ToastType = { type: "success" | "error" | "info"; message: string } | null;

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState < ToastType > (null);

  const handleLogin = async () => {
    if (!email || !password) {
      setToast({ type: "error", message: "Please fill all fields." });
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      setToast({ type: "success", message: "Login successful! Welcome back! 🎉" });
      setTimeout(() => {
        router.push("../(tabs)/breathing1");
      }, 1000);
    } catch (error: any) {
      setToast({ type: "error", message: error.message || "Login failed. Please try again." });
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
          <Text style={styles.heading}>
            Welcome Back to <Text style={styles.highlight}>BHAKTI</Text>
          </Text>
          <Text style={styles.subText}>Login to continue your wellness journey</Text>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#6B7757" style={styles.icon} />
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7757" style={styles.icon} />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity onPress={() => router.push("/authentication/forgotpassword")}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </Pressable>

          {/* Sign Up Link */}
          <TouchableOpacity onPress={() => router.push("/authentication/signup")}>
            <Text style={styles.signupLink}>
              Don't have an account? <Text style={styles.signupLinkBold}>Sign Up</Text>
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
  container: { flex: 1, paddingHorizontal: 30, paddingTop: 80, paddingBottom: 30 },
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
  forgotText: { textAlign: "right", color: "#4CAF50", fontSize: 13, marginBottom: 20 },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  signupLink: { textAlign: "center", marginTop: 20, fontSize: 14, color: "#666" },
  signupLinkBold: { fontWeight: "700", color: "#4CAF50" },
});

