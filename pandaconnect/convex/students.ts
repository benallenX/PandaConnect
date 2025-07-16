import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List students by teacher (teacher can only see their own students)
export const listStudentsByTeacher = query({
  args: {},
  handler: async (ctx) => {
    // Get the current user's identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Find the user record to check role and get school info
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== 'teacher') {
      throw new Error("Not authorized - teacher role required");
    }

    // Find teacher record
    const teacher = await ctx.db
      .query("teachers")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    // If no teacher record exists, return empty array (will be created on first student creation)
    if (!teacher) {
      return [];
    }

    // Return students taught by this teacher
    return await ctx.db
      .query("students")
      .withIndex("by_teacherId", (q) => q.eq("teacherId", teacher.clerkId))
      .collect();
  },
});

// Helper mutation to ensure teacher record exists
export const ensureTeacherRecord = mutation({
  args: {},
  handler: async (ctx) => {
    // Get the current user's identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Find the user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== 'teacher') {
      throw new Error("Not authorized - teacher role required");
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
      name: user.name,
      schoolId: user.schoolId,
    });

    return teacherId;
  },
});

// Create a new student (teacher only)
export const createStudent = mutation({
  args: {
    name: v.string(),
    parentIds: v.array(v.string()),
    pendingParentEmails: v.array(v.string()),
    classId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the current user's identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Find the user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== 'teacher') {
      throw new Error("Not authorized - teacher role required");
    }

    // Find or create teacher record
    let teacher = await ctx.db
      .query("teachers")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!teacher) {
      // Create teacher record if it doesn't exist
      const teacherId = await ctx.db.insert("teachers", {
        clerkId: identity.subject,
        name: user.name,
        schoolId: user.schoolId,
      });
      teacher = await ctx.db.get(teacherId);
    }

    if (!teacher) {
      throw new Error("Failed to create teacher record");
    }

    // Create the student
    const studentId = await ctx.db.insert("students", {
      name: args.name,
      teacherId: teacher.clerkId,
      parentIds: args.parentIds,
      pendingParentEmails: args.pendingParentEmails,
      classId: args.classId,
      schoolId: teacher.schoolId,
      createdAt: Date.now(),
    });

    return studentId;
  },
});

// Update a student (teacher only - can only update their own students)
export const updateStudent = mutation({
  args: {
    studentId: v.id("students"),
    name: v.string(),
    parentIds: v.array(v.string()),
    pendingParentEmails: v.array(v.string()),
    classId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the current user's identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Find the teacher record for the current user
    const teacher = await ctx.db
      .query("teachers")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Find the student to update
    const student = await ctx.db.get(args.studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    // Check if the student belongs to this teacher
    if (student.teacherId !== teacher.clerkId) {
      throw new Error("Not authorized - you can only update your own students");
    }

    // Update the student
    await ctx.db.patch(args.studentId, {
      name: args.name,
      parentIds: args.parentIds,
      pendingParentEmails: args.pendingParentEmails,
      classId: args.classId,
    });

    return { success: true };
  },
});

// Delete a student (teacher only - can only delete their own students)
export const deleteStudent = mutation({
  args: {
    studentId: v.id("students"),
  },
  handler: async (ctx, args) => {
    // Get the current user's identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Find the teacher record for the current user
    const teacher = await ctx.db
      .query("teachers")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Find the student to delete
    const student = await ctx.db.get(args.studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    // Check if the student belongs to this teacher
    if (student.teacherId !== teacher.clerkId) {
      throw new Error("Not authorized - you can only delete your own students");
    }

    // Delete the student
    await ctx.db.delete(args.studentId);

    return { success: true };
  },
});

// Get students by parent (for parent dashboard)
export const getStudentsByParent = query({
  args: {},
  handler: async (ctx) => {
    // Get the current user's identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Find the user record to check role
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "parent") {
      throw new Error("Not authorized - parent role required");
    }

    // Get all students and filter by parent ID (since parentIds is an array)
    const allStudents = await ctx.db
      .query("students")
      .withIndex("by_schoolId", (q) => q.eq("schoolId", user.schoolId))
      .collect();

    // Filter students where this parent is in the parentIds array
    return allStudents.filter(student => 
      student.parentIds.includes(identity.subject)
    );
  },
});
