import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tab Navigator */}
      <Stack.Screen name="(tabs)" />

      {/* Authentication Screens */}
      <Stack.Screen name="authentication/login" />
      <Stack.Screen name="authentication/signup" />
    </Stack>
  );
}
