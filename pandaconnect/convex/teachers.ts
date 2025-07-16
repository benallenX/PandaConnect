import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or get teacher record (auto-creates if needed)
export const createOrGetTeacher = mutation({
  args: {
    name: v.string(),
    schoolId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the current user's identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if teacher record already exists
    const existingTeacher = await ctx.db
      .query("teachers")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (existingTeacher) {
      return existingTeacher._id;
    }

    // Create new teacher record
    const teacherId = await ctx.db.insert("teachers", {
      clerkId: identity.subject,
      name: args.name,
      schoolId: args.schoolId,
    });

    return teacherId;
  },
});

// Get current teacher
export const getCurrentTeacher = query({
  args: {},
  handler: async (ctx) => {
    // Get the current user's identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Find the teacher record for the current user
    return await ctx.db
      .query("teachers")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
  },
});

// List all teachers in a school (admin only)
export const getTeachersBySchool = query({
  args: { schoolId: v.string() },
  handler: async (ctx, args) => {
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

    // Return all teachers in the school
    return await ctx.db
      .query("teachers")
      .withIndex("by_schoolId", (q) => q.eq("schoolId", args.schoolId))
      .collect();
  },
});
