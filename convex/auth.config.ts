import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://clever-shad-60.clerk.accounts.dev",
      applicationID: "convex",
    },
  ]
} satisfies AuthConfig;
