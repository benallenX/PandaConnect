import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Set user role in Convex only (used by actions) - admin only
export const setRoleOnly = mutation({
  args: { 
    clerkId: v.string(), 
    role: v.union(v.literal('admin'), v.literal('teacher'), v.literal('parent'))
  },
  handler: async (ctx, { clerkId, role }) => {
    // Get the current user's identity from the authentication context
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if the current user is an admin
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Not authorized - admin role required');
    }

    // Find the target user by Clerk ID
    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!targetUser) {
      throw new Error("User not found");
    }

    // Update role in Convex database
    await ctx.db.patch(targetUser._id, { role });

    return { success: true, message: `Role updated to ${role}` };
  },
});

// Remove user role in Convex only (used by actions) - admin only
export const removeRoleOnly = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    // Get the current user's identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if the current user is an admin
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Not authorized - admin role required');
    }

    // Find the target user
    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!targetUser) {
      throw new Error("User not found");
    }

    // Update role to parent as default (or you could remove the user entirely)
    await ctx.db.patch(targetUser._id, { role: 'parent' });

    return { success: true, message: 'Role removed' };
  },
});

// Get all users (admin only)
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    // Get the current user's identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if the current user is an admin
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Not authorized - admin role required');
    }

    // Return all users
    return await ctx.db.query("users").collect();
  },
});

// Search users by name or email (admin only)
export const searchUsers = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, { searchTerm }) => {
    // Get the current user's identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if the current user is an admin
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Not authorized - admin role required');
    }

    // Search users by name or email
    const allUsers = await ctx.db.query("users").collect();
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },
});
