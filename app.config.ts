import { ConfigContext, ExpoConfig } from "expo/config";

const EAS_PROJECT_ID = "f4c79c88-0947-4a7f-b05b-702d83ea6ec4";
const PROJECT_SLUG = "ua-messenger";
const OWNER = "zab_oleksandr";

const APP_NAME = "UA Messenger";
const BUNDLE_IDENTIFIER = "com.zab_oleksandr.uamessenger";
const PACKAGE_NAME = "com.zab_oleksandr.uamessenger";
const SCHEME = "ua-messenger";

// Іконки
const ICON = "./assets/images/icon.png";
const ADAPTIVE_ICON_FOREGROUND = "./assets/images/android-icon-foreground.png";
const ADAPTIVE_ICON_BACKGROUND = "./assets/images/android-icon-background.png";


export default ({ config }: ConfigContext): ExpoConfig => {
  const environment =
    (process.env.APP_ENV as "development" | "preview" | "production") ||
    "development";
 
  console.log("⚙️  Building for environment:", environment);
  console.log("📦 Convex URL:", process.env.EXPO_PUBLIC_CONVEX_URL);
  console.log(
    "🔐 Clerk Key:",
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20) + "..."
  );
 
  const dynamicConfig = getDynamicAppConfig(environment);
 
  return {
    ...config,
    name: dynamicConfig.name,
    slug: PROJECT_SLUG,
    version: "1.0.0",
    orientation: "portrait",
    icon: dynamicConfig.icon,
    scheme: dynamicConfig.scheme,
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
 
    ios: {
      supportsTablet: true,
      bundleIdentifier: dynamicConfig.bundleIdentifier,
      buildNumber: "1",
      infoPlist: {
        NSCameraUsageDescription:
          "This app uses the camera to take photos for posts.",
        NSPhotoLibraryUsageDescription:
          "This app accesses your photos to share in posts.",
      },
    },
 
    android: {
      package: dynamicConfig.packageName,
      versionCode: 1,
      adaptiveIcon: {
        backgroundColor: "#000000",
        foregroundImage: dynamicConfig.adaptiveIconForeground,
        backgroundImage: dynamicConfig.adaptiveIconBackground,
      },
      permissions: [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.RECORD_AUDIO",
      ],
    },
 
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#000000",
        },
      ],
      "expo-secure-store",
      "expo-image-picker",
    ],
 
    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
 
    extra: {
      eas: {
        projectId: EAS_PROJECT_ID,
      },
      router: {},
    },
 
    owner: OWNER,
  };
};
 
// Функція для динамічної конфігурації
export const getDynamicAppConfig = (
  environment: "development" | "preview" | "production"
) => {
  // Поки що тільки DEVELOPMENT
  if (environment === "development") {
    return {
      name: `${APP_NAME} Dev`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
      packageName: `${PACKAGE_NAME}.dev`,
      icon: "./assets/images/icon.png",
      adaptiveIconForeground:
        "./assets/images/android-icon-foreground.png",
      adaptiveIconBackground: ADAPTIVE_ICON_BACKGROUND,
      scheme: `${SCHEME}-dev`,
    };
  }

  // PREVIEW - ДОДАЙТЕ ЦЕЙ БЛОК
  if (environment === "preview") {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      icon: "./assets/images/icon.png",
      adaptiveIconForeground:
        "./assets/images/android-icon-foreground.png",
      adaptiveIconBackground: ADAPTIVE_ICON_BACKGROUND,
      scheme: `${SCHEME}-preview`,
    };
  }
 
  // Fallback на production (поки що)
  return {
    name: APP_NAME,
    bundleIdentifier: BUNDLE_IDENTIFIER,
    packageName: PACKAGE_NAME,
    icon: ICON,
    adaptiveIconForeground: ADAPTIVE_ICON_FOREGROUND,
    adaptiveIconBackground: ADAPTIVE_ICON_BACKGROUND,
    scheme: SCHEME,
  };
};