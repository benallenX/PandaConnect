"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api } from "../_generated/api";
import { clerkClient } from '@clerk/nextjs/server';

// Action to set user role with Clerk metadata update (admin only)
export const setRoleWithClerk = action({
  args: { 
    clerkId: v.string(), 
    role: v.union(v.literal('admin'), v.literal('teacher'), v.literal('parent'))
  },
  handler: async (ctx, { clerkId, role }): Promise<{ success: boolean; message: string }> => {
    // First update role in Convex using a mutation
    const result: { success: boolean; message: string } = await ctx.runMutation(api.admin.setRoleOnly, { clerkId, role });

    // Then update role in Clerk publicMetadata (requires Node.js runtime)
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(clerkId, {
        publicMetadata: { role },
      });
    } catch (error) {
      console.error("Failed to update Clerk metadata:", error);
      // Note: Role is already updated in Convex
    }

    return result;
  },
});

// Action to remove user role with Clerk metadata update (admin only)
export const removeRoleWithClerk = action({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }): Promise<{ success: boolean; message: string }> => {
    // First remove role in Convex using a mutation
    const result: { success: boolean; message: string } = await ctx.runMutation(api.admin.removeRoleOnly, { clerkId });

    // Then remove role from Clerk publicMetadata (requires Node.js runtime)
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(clerkId, {
        publicMetadata: { role: null },
      });
    } catch (error) {
      console.error("Failed to update Clerk metadata:", error);
      // Note: Role is already removed in Convex
    }

    return result;
  },
});
