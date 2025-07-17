import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:
export const listUsers = query({
  // Validators for arguments.
  args: {
    count: v.number(),
  },

  // Query implementation.
  handler: async (ctx, args) => {
    //// Read the database as many times as you need here.
    //// See https://docs.convex.dev/database/reading-data.
    const users = await ctx.db
      .query("users")
      // Ordered by _creationTime, return most recent
      .order("desc")
      .take(args.count);
    return {
      viewer: (await ctx.auth.getUserIdentity())?.name ?? null,
      users: users.reverse().map((user) => user.name),
    };
  },
});

// You can write data to the database via a mutation:
export const addTestUser = mutation({
  // Validators for arguments.
  args: {
    name: v.string(),
    email: v.string(),
  },

  // Mutation implementation.
  handler: async (ctx, args) => {
    //// Insert or modify documents in the database here.
    //// Mutations can also read from the database like queries.
    //// See https://docs.convex.dev/database/writing-data.

    const id = await ctx.db.insert("users", { 
      clerkId: `test_${Date.now()}`,
      name: args.name,
      email: args.email,
      role: "parent" as const,
      schoolId: "test_school"
    });

    console.log("Added new test user with id:", id);
    return id;
  },
});

// You can fetch data from and send data to third-party APIs via an action:
export const myAction = action({
  // Validators for arguments.
  args: {
    count: v.number(),
  },

  // Action implementation.
  handler: async (ctx, args): Promise<string> => {
    //// Use the browser-like `fetch` API to send HTTP requests.
    //// See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
    // const response = await ctx.fetch("https://api.thirdpartyservice.com");
    // const data = await response.json();

    //// Query data by running Convex queries.
    const data = await ctx.runQuery(api.myFunctions.listUsers, {
      count: args.count,
    });
    console.log(data);

    //// Write data by running Convex mutations.
    // Example: Add a test user
    // await ctx.runMutation(api.myFunctions.addTestUser, {
    //   name: "Test User",
    //   email: "test@example.com",
    // });
    
    return `Processed ${data.users.length} users`;
  },
});

// ───────────────────────────────────────── LOGIN TRACKING FUNCTIONS

// Log a user login event
export const logLoginEvent = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    role: v.union(v.literal('admin'), v.literal('teacher'), v.literal('parent')),
    schoolId: v.string(),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const loginEventId = await ctx.db.insert("loginEvents", {
      clerkId: args.clerkId,
      email: args.email,
      role: args.role,
      schoolId: args.schoolId,
      loginTime: Date.now(),
      userAgent: args.userAgent,
      ipAddress: args.ipAddress,
    });

    console.log(`Login event logged for ${args.email} (${args.role}) at ${new Date().toISOString()}`);
    return loginEventId;
  },
});

// Get recent login events (for admin dashboard)
export const getRecentLogins = query({
  args: {
    schoolId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    const loginEvents = await ctx.db
      .query("loginEvents")
      .withIndex("by_schoolId", (q) => q.eq("schoolId", args.schoolId))
      .order("desc")
      .take(limit);

    return loginEvents.map(event => ({
      ...event,
      loginTimeFormatted: new Date(event.loginTime).toLocaleString(),
    }));
  },
});

// Get login history for a specific user
export const getUserLoginHistory = query({
  args: {
    clerkId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    
    const loginEvents = await ctx.db
      .query("loginEvents")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .order("desc")
      .take(limit);

    return loginEvents.map(event => ({
      ...event,
      loginTimeFormatted: new Date(event.loginTime).toLocaleString(),
    }));
  },
});

// Get login stats (daily/weekly counts)
export const getLoginStats = query({
  args: {
    schoolId: v.string(),
    days: v.optional(v.number()), // how many days back to look
  },
  handler: async (ctx, args) => {
    const days = args.days ?? 7;
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    const recentLogins = await ctx.db
      .query("loginEvents")
      .withIndex("by_schoolId", (q) => q.eq("schoolId", args.schoolId))
      .filter((q) => q.gte(q.field("loginTime"), cutoffTime))
      .collect();

    const stats = {
      totalLogins: recentLogins.length,
      uniqueUsers: new Set(recentLogins.map(event => event.clerkId)).size,
      teacherLogins: recentLogins.filter(event => event.role === 'teacher').length,
      parentLogins: recentLogins.filter(event => event.role === 'parent').length,
      adminLogins: recentLogins.filter(event => event.role === 'admin').length,
    };

    return stats;
  },
});
