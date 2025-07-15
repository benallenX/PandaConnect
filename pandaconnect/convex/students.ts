import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Query to list students for a teacher
export const listStudentsByTeacher = query({
  args: {},
  handler: async (ctx) => {
    // For now, return mock data until authentication is properly set up
    // In a real app, you'd filter by the current teacher's ID
    const students = await ctx.db.query("students").collect();
    return students;
  },
});

// Mutation to create a new student
export const createStudent = mutation({
  args: {
    name: v.string(),
    parentIds: v.array(v.string()),
    pendingParentEmails: v.optional(v.array(v.string())),
    classId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const studentId = await ctx.db.insert("students", {
      name: args.name,
      parentIds: args.parentIds,
      pendingParentEmails: args.pendingParentEmails || [],
      classId: args.classId,
      teacherId: "temp_teacher_id", // In real app, get from auth
      schoolId: "temp_school_id", // In real app, get from auth context
      createdAt: Date.now(),
    });
    return studentId;
  },
});

// Mutation to update a student
export const updateStudent = mutation({
  args: {
    studentId: v.id("students"),
    name: v.string(),
    parentIds: v.array(v.string()),
    pendingParentEmails: v.optional(v.array(v.string())),
    classId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.studentId, {
      name: args.name,
      parentIds: args.parentIds,
      pendingParentEmails: args.pendingParentEmails,
      classId: args.classId,
    });
  },
});

// Mutation to delete a student
export const deleteStudent = mutation({
  args: {
    studentId: v.id("students"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.studentId);
  },
});
