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
