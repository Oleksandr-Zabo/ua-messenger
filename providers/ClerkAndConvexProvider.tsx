import { ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '../utils/cache';
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false,
});

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL!;
const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function ClerkAndConvexProvider({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider publishableKey={clerkKey} tokenCache={tokenCache}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}