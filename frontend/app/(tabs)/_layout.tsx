import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { auth } from "../../Breath_Pacer/config/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function TabsLayout() {
  const [user, setUser] = useState < User | null > (null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="breathing1"
        options={{
          title: "Breathing 1",
          href: user ? undefined : null, // Hide if not logged in
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="ellipse" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="breathing2"
        options={{
          title: "Breathing 2",
          href: user ? undefined : null, // Hide if not logged in
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="pulse" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          href: user ? undefined : null, // Hide if not logged in
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          href: user ? undefined : null, // Hide if not logged in
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
