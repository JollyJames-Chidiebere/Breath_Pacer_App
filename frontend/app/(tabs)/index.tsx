// app/(tabs)/index.tsx
import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { auth } from "../../Breath_Pacer/config/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WelcomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState < User | null > (null);
  const [isReturningUser, setIsReturningUser] = useState(false);

  // Load fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Check if user has logged in before
        const hasLoggedInBefore = await AsyncStorage.getItem(`hasLoggedIn_${currentUser.uid}`);

        if (hasLoggedInBefore === "true") {
          setIsReturningUser(true);
        } else {
          // First time login after signup
          setIsReturningUser(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Animated value for floating effect
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  // Handle logout
  const handleLogout = async () => {
    try {
      if (user) {
        // Mark that this user has logged in before (for next time)
        await AsyncStorage.setItem(`hasLoggedIn_${user.uid}`, "true");
      }
      await signOut(auth);
      setIsReturningUser(false); // Reset state on logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show loader until fonts are ready
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#3EB489" style={{ flex: 1 }} />;
  }

  // Show authenticated home screen
  if (user) {
    return (
      <LinearGradient
        colors={["#ffffff", "#d5e8d4"]}
        style={styles.container}
      >
        {/* Animated Top Image */}
        <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
          <Image
            source={require("../assets/images/first.png")}
            style={styles.staffImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Logo */}
        <Image
          source={require("../assets/images/Screenshot_2025-08-04_at_9.53.07_AM-removebg.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Welcome Text for authenticated user */}
        <Text style={styles.welcomeTitle}>
          {isReturningUser ? "Welcome Back" : "Welcome"}{user.displayName ? `, ${user.displayName}` : ""}!
        </Text>
        <Text style={styles.subtitle}>
          {isReturningUser
            ? "Ready to practice mindful breathing? Navigate to the breathing exercises below."
            : "Great to have you here! Explore the breathing exercises to begin your wellness journey."
          }
        </Text>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.buttonTextLight}>Logout</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // Show login/signup screen for non-authenticated users
  return (
    <LinearGradient
      colors={["#ffffff", "#d5e8d4"]}
      style={styles.container}
    >
      {/* Animated Top Image */}
      <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
        <Image
          source={require("../assets/images/first.png")}
          style={styles.staffImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Logo */}
      <Image
        source={require("../assets/images/Screenshot_2025-08-04_at_9.53.07_AM-removebg.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Welcome Text */}
      <Text style={styles.welcomeTitle}>Welcome to Bhakti Wellness Center</Text>
      <Text style={styles.subtitle}>
        Take a breath, soften your shoulders, and let go. You're just a few
        moments away from calm.
      </Text>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={() => router.push("/authentication/signup")}
        >
          <Text style={styles.buttonTextLight}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => router.push("/authentication/login")}
        >
          <Text style={styles.buttonTextLight}>Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  staffImage: { width: 200, height: 300, marginBottom: 10 },
  logo: { width: 260, height: 100, marginBottom: 100, marginTop: -10 },
  welcomeTitle: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 15,

  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: "#4a4a4a",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
    lineHeight: 22,
  },
  buttonRow: { flexDirection: "row", justifyContent: "center", width: "100%", marginTop: 10 },
  button: {
    flex: 1,
    paddingVertical: 14,
    marginHorizontal: 8,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 2,
  },
  signUpButton: { backgroundColor: "#3EB489" },
  loginButton: { backgroundColor: "#1e3628" },
  buttonTextLight: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: "center",
  },
});
