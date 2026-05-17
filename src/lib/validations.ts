import * as z from "zod";

// Define the exact Unit of Measurement types from your database
export const UomTypeEnum = z.enum(["NUMERIC_MIN", "NUMERIC_MAX", "TIMELINE", "ZERO"]);

// 1. Schema for a SINGLE Goal
export const GoalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  thrustArea: z.string().min(2, "Please select a Thrust Area"),
  description: z.string().optional(),
  uomType: UomTypeEnum,
  
  // BUSINESS RULE: Minimum weightage per individual goal is 10%
  // We use z.coerce to ensure form inputs (which are often strings) turn into numbers
  weightage: z.coerce
    .number()
    .min(10, "Minimum weightage per goal is 10%")
    .max(100, "Weightage cannot exceed 100%"),
    
  // Kept as string to handle "10000", "50%", or "2026-12-31"
  plannedTarget: z.string().min(1, "Target is required"), 
  isShared: z.boolean().optional().default(false),
});

// 2. Schema for the ENTIRE Goal Sheet (The big submit)
export const GoalSheetSchema = z.object({
  cyclePeriod: z.string().default("Q1-2026"),
  
  // BUSINESS RULE: Maximum 8 goals
  goals: z.array(GoalSchema)
    .min(1, "You must add at least one goal")
    .max(8, "Maximum of 8 goals allowed per employee")
    
    // THE KILLER FEATURE: Custom refinement to enforce exactly 100% total weightage
    .refine((goals) => {
      const totalWeight = goals.reduce((sum, goal) => sum + (goal.weightage || 0), 0);
      return totalWeight === 100;
    }, {
      // If it fails, this exact string will show up as a red error message on your form
      message: "The total weightage of all goals must equal exactly 100%",
      path: ["root"], // This attaches the error to the whole array, not just one field
    }),
});

// Define the exact Progress Statuses from your database
export const GoalStatusEnum = z.enum(["NOT_STARTED", "ON_TRACK", "COMPLETED"]);

// Schema for when an Employee or Manager updates progress
export const CheckInSchema = z.object({
  goalId: z.string(),
  status: GoalStatusEnum,
  
  // What did they actually achieve this quarter?
  actualAchievement: z.string().min(1, "Please enter your actual achievement data"),
  
  // Manager's structured feedback
  comment: z.string().min(5, "A structured check-in comment is required to document the discussion"),
});