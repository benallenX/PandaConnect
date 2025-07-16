import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create user in Convex only (used by actions)
export const createUserOnly = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal('admin'), v.literal('teacher'), v.literal('parent')),
    schoolId: v.string(),
    phoneNumber: v.optional(v.string()),
    receiveReminders: v.optional(v.boolean()),
    preferredTeacherId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Insert user into Convex database
    const userId = await ctx.db.insert('users', {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      role: args.role,
      schoolId: args.schoolId,
      phoneNumber: args.phoneNumber,
      receiveReminders: args.receiveReminders,
      preferredTeacherId: args.preferredTeacherId,
    });

    return userId;
  },
});

// Update user role in Convex only (used by actions)
export const updateUserRoleOnly = mutation({
  args: {
    clerkId: v.string(),
    role: v.union(v.literal('admin'), v.literal('teacher'), v.literal('parent')),
  },
  handler: async (ctx, args) => {
    // Find user in Convex database
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update user role in Convex
    await ctx.db.patch(user._id, { role: args.role });

    return { success: true };
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Get users by school
export const getUsersBySchool = query({
  args: { schoolId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_schoolId", (q) => q.eq("schoolId", args.schoolId))
      .collect();
  },
});
