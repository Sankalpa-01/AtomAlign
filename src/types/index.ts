import { ReactNode } from "react";

// A User that includes their assigned L1 Manager and their Team Members
// Prisma types may not be exported in some client versions — fall back to a
// loose payload type to avoid build errors while keeping typing intent.
export type UserWithTeam = any;

// A Goal Sheet that includes the Employee who owns it, and all the Goals inside it
export type GoalSheetWithGoals = any;

// A Goal that includes its Check-ins (with the Manager's details) and Audit Logs
export type GoalWithDetails = any;


// The individual goal entry before it hits the database
export interface CreateGoalInput {
  title: string;
  thrustArea: string;
  description?: string;
  uomType: "NUMERIC_MIN" | "NUMERIC_MAX" | "TIMELINE" | "ZERO";
  weightage: number;
  plannedTarget: string;
}

// The complete Goal Sheet submitted by the Employee (Phase 1)
export interface CreateGoalSheetInput {
  userId: string; // The employee's ID
  cyclePeriod: string; // e.g., "Q1-2026"
  goals: CreateGoalInput[]; // Must strictly validate to total 100% weightage
}

// The Quarterly Check-in submitted by the Manager (Phase 2)
export interface SubmitCheckInInput {
  goalId: string;
  managerId: string;
  comment: string;
  status: "NOT_STARTED" | "ON_TRACK" | "COMPLETED";
  actualAchievement: string;
}

// For building a dynamic Sidebar that only shows links based on the user's role
export interface NavItem {
  title: string;
  href: string;
  icon?: ReactNode;
  roles: ("EMPLOYEE" | "MANAGER" | "ADMIN")[];
}

// Unified Response type for all Server Actions so your UI can show Toast notifications
export interface ServerActionResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}