import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./users";

const STORY_DURATION_MS = 24 * 60 * 60 * 1000; // 24 години

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const createStory = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) throw new Error("Image URL not found");

    return await ctx.db.insert("stories", {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      expiresAt: Date.now() + STORY_DURATION_MS,
      views: 0,
    });
  },
});

export const getActiveStories = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const now = Date.now();

    // Отримати підписки
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", currentUser._id))
      .collect();

    const userIds = [currentUser._id, ...follows.map((f) => f.followingId)];

    // Отримати активні stories для кожного користувача
    const storiesWithUsers = await Promise.all(
      userIds.map(async (userId) => {
        const user = await ctx.db.get(userId);
        const userStories = await ctx.db
          .query("stories")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .filter((q) => q.gt(q.field("expiresAt"), now))
          .collect();

        return {
          user,
          stories: userStories,
          hasStory: userStories.length > 0,
        };
      })
    );

    return storiesWithUsers.filter((s) => s.hasStory);
  },
});

export const getStoriesByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const stories = await ctx.db
      .query("stories")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gt(q.field("expiresAt"), now))
      .collect();
    return stories;
  },
});