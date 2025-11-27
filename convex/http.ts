import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
 
const http = httpRouter();
 
http.route({
  path: "/user-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    console.log("Webhook received!");
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }
 
    // check headers
    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");
 
    console.log("Headers:", { svix_id, svix_timestamp, svix_signature });

    if (!svix_id || !svix_signature || !svix_timestamp) {
      console.error("Missing svix headers");
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }
 
    const payloadString = await request.text();
    console.log("Payload received");
 
    const wh = new Webhook(webhookSecret);
    let evt: any;
 
    // verify webhook
    try {
      evt = wh.verify(payloadString, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;
      console.log("Webhook verified successfully. Event type:", evt.type);
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }
 
    const eventType = evt.type;
 
    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;
 
      const email = email_addresses[0]?.email_address;
      if (!email) {
          console.error("No email found in webhook data");
          return new Response("No email found", { status: 400 });
      }

      const name = `${first_name || ""} ${last_name || ""}`.trim();
 
      try {
        await ctx.runMutation(api.users.createUser, {
          email,
          fullname: name,
          image: image_url,
          clerkId: id,
          username: email.split("@")[0],
        });
        console.log("User creation/update mutation called successfully");
      } catch (error) {
        console.log("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    } else {
        console.log("Unhandled event type:", eventType);
    }
 
    return new Response("Webhook processed successfully", { status: 200 });
  }),
});
 
export default http;
 
 