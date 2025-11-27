import { SafeAreaView } from "react-native-safe-area-context";

import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import InitialLayout from "@/components/initialLayout";

export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
          <InitialLayout></InitialLayout>
        </SafeAreaView>
    </ClerkAndConvexProvider>
  );
}
