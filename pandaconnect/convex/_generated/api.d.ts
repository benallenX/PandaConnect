/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions_adminActions from "../actions/adminActions.js";
import type * as actions_userActions from "../actions/userActions.js";
import type * as admin from "../admin.js";
import type * as myFunctions from "../myFunctions.js";
import type * as students from "../students.js";
import type * as teachers from "../teachers.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "actions/adminActions": typeof actions_adminActions;
  "actions/userActions": typeof actions_userActions;
  admin: typeof admin;
  myFunctions: typeof myFunctions;
  students: typeof students;
  teachers: typeof teachers;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
