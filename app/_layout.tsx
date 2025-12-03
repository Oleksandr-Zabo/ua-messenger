import { SafeAreaView } from "react-native-safe-area-context";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import InitialLayout from "@/components/initialLayout";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { use, useCallback } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkAndConvexProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }} onLayout={onLayoutRootView}>
        <InitialLayout></InitialLayout>
      </SafeAreaView>
    </ClerkAndConvexProvider>
  );
}
