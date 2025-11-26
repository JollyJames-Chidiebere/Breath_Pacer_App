import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
// Conditionally import PagerView only on native platforms
const PagerView = Platform.OS !== "web" ? require("react-native-pager-view").default : null;
import type { PagerViewOnPageSelectedEvent } from "react-native-pager-view";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Animatable from "react-native-animatable";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";

const { width } = Dimensions.get("window");

export default function BreathingIntro() {
  const pagerRef = useRef < any > (null);
  const [page, setPage] = useState(0);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  // Keep splash screen visible until fonts are loaded
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // replaces AppLoading
  }

  const goToNext = () => {
    if (page < 2) {
      pagerRef.current?.setPage(page + 1);
    } else {
      router.push("/(tabs)/breathing1");
    }
  };

  const skip = () => {
    router.push("/(tabs)/breathing1");
  };

  const NextButton = () => (
    <Animatable.View
      animation={page === 2 ? "pulse" : "fadeInUp"}
      easing="ease-in-out"
      iterationCount="infinite"
      duration={1200}
    >
      <Pressable style={styles.nextButton} onPress={goToNext}>
        <Text style={styles.nextText}>{page === 2 ? "Start" : "Next"}</Text>
      </Pressable>
    </Animatable.View>
  );

  const PageContent = ({ children, index }: { children: React.ReactNode; index: number }) => (
    <View style={styles.page} key={index}>
      {children}
    </View>
  );

  const pages = [
    <PageContent index={0}>
      <Animatable.Text animation="fadeInDown" delay={100} style={styles.heading}>
        Why Breathing Matters
      </Animatable.Text>
      <Animatable.Text animation="fadeInUp" delay={300} style={styles.paragraph}>
        Every breath you take directly affects your mind and body.{"\n\n"}
        Controlled breathing can lower your heart rate, reduce anxiety, improve oxygen flow, and boost focus.
        {"\n\n"}When you master your breath, you master your state of mind.
      </Animatable.Text>
    </PageContent>,
    <PageContent index={1}>
      <Animatable.Text animation="fadeInDown" delay={100} style={styles.heading}>
        Core Breathing Techniques
      </Animatable.Text>
      <Animatable.Text animation="fadeInUp" delay={300} style={styles.paragraph}>
        • <Text style={styles.bold}>Box Breathing</Text> – Inhale 4s, hold 4s, exhale 4s, hold 4s.{"\n"}
        • <Text style={styles.bold}>Diaphragmatic Breathing</Text> – Expand your belly with each inhale.{"\n"}
        • <Text style={styles.bold}>4-7-8 Method</Text> – Inhale 4s, hold 7s, exhale 8s for deep relaxation.
        {"\n\n"}These techniques can be practiced anywhere, anytime.
      </Animatable.Text>
    </PageContent>,
    <PageContent index={2}>
      <Animatable.Text animation="fadeInDown" delay={100} style={styles.heading}>
        Daily Practice & Resources
      </Animatable.Text>
      <Animatable.Text animation="fadeInUp" delay={300} style={styles.paragraph}>
        Start with just 5 minutes in the morning and before bed.{"\n\n"}
        Gradually integrate breathing into moments of stress, before meetings, or during breaks.
        {"\n\n"}In this app, you'll find guided exercises, personalized timers, and progress tracking to keep you consistent.
      </Animatable.Text>
    </PageContent>,
  ];

  return (
    <LinearGradient
      onLayout={onLayoutRootView}
      colors={["#dff6f0", "#ffffff"]}
      style={{ flex: 1 }}
    >
      <Pressable style={styles.skipButton} onPress={skip}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      {Platform.OS === "web" ? (
        // Web fallback: Simple scrollable view
        <ScrollView contentContainerStyle={styles.webContainer}>
          {pages[page]}
        </ScrollView>
      ) : (
        // Native: Use PagerView
        <PagerView
          style={{ flex: 1 }}
          initialPage={0}
          ref={pagerRef}
          onPageSelected={(e: PagerViewOnPageSelectedEvent) => setPage(e.nativeEvent.position)}
        >
          {pages}
        </PagerView>
      )}

      {/* Expressive Next Button */}
      <View style={{ marginBottom: 10 }}>
        <NextButton />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  skipButton: { position: "absolute", top: 50, right: 20, zIndex: 1 },
  skipText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  webContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  heading: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    color: "#555",
    lineHeight: 26,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  bold: { fontFamily: "Poppins_700Bold", color: "#333" },
  nextButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 70,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
});
