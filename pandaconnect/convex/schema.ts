import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define the schema for the Convex database
export default defineSchema({
  users: defineTable({
    clerkId: v.string(),                        // Clerk userId
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal('admin'),
      v.literal('teacher'),
      v.literal('parent')
    ),
    schoolId: v.string(),                       // multi-tenant scope
    phoneNumber: v.optional(v.string()),
    receiveReminders: v.optional(v.boolean()),
    preferredTeacherId: v.optional(v.string()), // set by parent on sign-up
  })
    .index('by_clerkId', ['clerkId'])
    .index('by_schoolId', ['schoolId']),

  // ───────────────────────────────────────── teachers
  teachers: defineTable({
    clerkId: v.string(),                        // 1-to-1 with users row
    name: v.string(),
    schoolId: v.string(),
  })
    .index('by_clerkId', ['clerkId'])
    .index('by_schoolId', ['schoolId']),

  // ───────────────────────────────────────── students
  students: defineTable({
    name: v.string(),
    teacherId: v.string(),                      // FK → teachers.clerkId
    parentIds: v.array(v.string()),             // linked once parent signs up
    pendingParentEmails: v.array(v.string()),   // raw emails waiting for signup
    classId: v.optional(v.string()),
    schoolId: v.string(),
    createdAt: v.number(),
  })
    .index('by_teacherId', ['teacherId'])
    .index('by_parentIds', ['parentIds'])       // enables “parent sees own kids”
    .index('by_schoolId', ['schoolId']),

  // ───────────────────────────────────────── photos
  photos: defineTable({
    uploaderId: v.string(),                     // teacherId or adminId
    studentIds: v.optional(v.array(v.string())),
    file: v.id('_storage'),                     // Convex blob reference
    name: v.string(),
    schoolId: v.string(),
    createdAt: v.number(),
  })
    .index('by_uploaderId', ['uploaderId'])
    .index('by_studentIds', ['studentIds'])
    .index('by_schoolId', ['schoolId']),

  // ───────────────────────────────────────── messages
  messages: defineTable({
    fromUserId: v.string(),
    toUserIds: v.array(v.string()),
    body: v.string(),
    sentAt: v.number(),
    readBy: v.optional(v.array(v.string())),
    schoolId: v.string(),
  })
    .index('by_user', ['fromUserId'])
    .index('by_schoolId', ['schoolId']),

  // ───────────────────────────────────────── events
  events: defineTable({
    title: v.string(),
    date: v.string(),                           // ISO-8601
    description: v.optional(v.string()),
    teacherId: v.string(),                      // organiser
    schoolId: v.string(),
    createdAt: v.number(),
  })
    .index('by_teacherId', ['teacherId'])
    .index('by_date', ['date'])
    .index('by_schoolId', ['schoolId']),
});
