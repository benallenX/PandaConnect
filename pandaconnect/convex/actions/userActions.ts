"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api } from "../_generated/api";
import { clerkClient } from '@clerk/nextjs/server';

// Action to create user with Clerk metadata update
export const createUserWithClerk = action({
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
  handler: async (ctx, args): Promise<string> => {
    // First create the user in Convex using a mutation
    const userId: string = await ctx.runMutation(api.users.createUserOnly, args);

    // Then update Clerk publicMetadata (requires Node.js runtime)
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(args.clerkId, {
        publicMetadata: { role: args.role }
      });
    } catch (error) {
      console.error("Failed to update Clerk metadata:", error);
      // Note: User is already created in Convex, so we don't roll back
      // You might want to implement a cleanup strategy here
    }

    return userId;
  },
});

// Action to update user role with Clerk metadata update
export const updateUserRoleWithClerk = action({
  args: {
    clerkId: v.string(),
    role: v.union(v.literal('admin'), v.literal('teacher'), v.literal('parent')),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    // First update the user role in Convex using a mutation
    const result: { success: boolean } = await ctx.runMutation(api.users.updateUserRoleOnly, args);

    // Then update Clerk publicMetadata (requires Node.js runtime)
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(args.clerkId, {
        publicMetadata: { role: args.role }
      });
    } catch (error) {
      console.error("Failed to update Clerk metadata:", error);
      // Note: User role is already updated in Convex
    }

    return result;
  },
});
