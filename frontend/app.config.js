import path from "path";

export default {
  expo: {
    name: "Breath_Pacer",
    slug: "Breath_Pacer",
    version: "1.0.0",
    orientation: "portrait",
    "jsEngine": "hermes",
    scheme: "breathpacer",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    icon: "./app/assets/images/icon.png",

    splash: {
      image: "./app/assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.Breath-Pacer",
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./app/assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.anonymous.Breath_Pacer",
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./app/assets/images/favicon.png"
    },

    plugins: ["expo-router", "expo-web-browser", "expo-font"],
    experiments: {
      typedRoutes: true,
    },
  },
};
