import { Query } from "convex/server";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

//new
export const getUserProfile = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) throw new Error("User not found");
    return user;
  },
});

async function updateFollowCounts(
  ctx: MutationCtx,
  followerId: Id<"users">,
  followingId: Id<"users">,
  isFollow: boolean
) {
  const follower = await ctx.db.get(followerId);
  const following = await ctx.db.get(followingId);
 
  if (follower && following) {
    await ctx.db.patch(followerId, {
      following: follower.following + (isFollow ? 1 : -1),
    });
    await ctx.db.patch(followingId, {
      followers: following.followers + (isFollow ? 1 : -1),
    });
  }
}
 
export const toggleFollow = mutation({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
 
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", args.followingId)
      )
      .first();
 
    if (existing) {
      // unfollow
      await ctx.db.delete(existing._id);
      await updateFollowCounts(ctx, currentUser._id, args.followingId, false);
    } else {
      // follow
      await ctx.db.insert("follows", {
        followerId: currentUser._id,
        followingId: args.followingId,
      });
      await updateFollowCounts(ctx, currentUser._id, args.followingId, true);
 
      // create a notification
      await ctx.db.insert("notifications", {
        receiverId: args.followingId,
        senderId: currentUser._id,
        type: "follow",
      });
    }
  },
});
//end new 

export const isFollowing = query({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
 
    const follow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", args.followingId)
      )
      .first();
 
    return !!follow;
  },
});

export const getAuthenticatedUser = async (ctx: QueryCtx | MutationCtx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const currentUser = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
        .first();
    if (!currentUser) throw new Error('User not found');
    return currentUser;
};


// Create a new user
export const createUser = mutation({
    args: {
        username: v.string(),
        fullname: v.string(),
        email: v.string(),
        bio: v.optional(v.string()),
        image: v.string(),
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        const exUser = await ctx.db.query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();
        if (exUser) return;

        await ctx.db.insert("users", {
            username: args.username,
            fullname: args.fullname,
            email: args.email,
            bio: args.bio,
            image: args.image,
            clerkId: args.clerkId,
            followers: 0,
            following: 0,
            posts: 0
        });
    },
});

export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
 
    return user;
  },
});

export const updateProfile = mutation({
  args: {
    fullname: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
 
    await ctx.db.patch(currentUser._id, {
      fullname: args.fullname,
      bio: args.bio,
    });
  },
});

// New query to get stories users
export const getStoriesUsers = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const now = Date.now();

    // Check if current user has active stories
    const currentUserStories = await ctx.db
      .query("stories")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .filter((q) => q.gt(q.field("expiresAt"), now))
      .first();

    const hasCurrentUserStory = !!currentUserStories;

    // Отримати користувачів, на яких підписаний поточний користувач
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", currentUser._id))
      .collect();

    const followingIds = follows.map((f) => f.followingId);

    // Отримати дані цих користувачів та перевірити наявність stories
    const followingUsersWithStories = await Promise.all(
      followingIds.map(async (id) => {
        const user = await ctx.db.get(id);
        if (!user) return null;

        const story = await ctx.db
          .query("stories")
          .withIndex("by_user", (q) => q.eq("userId", id))
          .filter((q) => q.gt(q.field("expiresAt"), now))
          .first();

        return {
          ...user,
          hasStory: !!story,
        };
      })
    );

    // Сформувати список stories
    const stories = [
      // Поточний користувач завжди перший ("You")
      {
        id: currentUser._id,
        username: "You",
        avatar: currentUser.image,
        hasStory: hasCurrentUserStory,
      },
      // Користувачі, на яких підписані (тільки ті, у кого є stories)
      ...followingUsersWithStories
        .filter((user) => user !== null && user.hasStory)
        .map((user) => ({
          id: user!._id,
          username: user!.username,
          avatar: user!.image,
          hasStory: user!.hasStory,
        })),
    ];

    return stories;
  },
});