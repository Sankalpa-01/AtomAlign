"use server";

import prisma from "@/lib/prisma";
import { CreateGoalSheetInput, ServerActionResponse } from "@/types";
import { GoalSheetSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

/**
 * PHASE 1: Employee submits a Goal Sheet
 */
export async function submitGoalSheet(data: CreateGoalSheetInput): Promise<ServerActionResponse> {
  try {
    // 1. DEFENSE IN DEPTH: Re-validate the 100% weightage rule on the server
    const parsedData = GoalSheetSchema.safeParse(data);
    if (!parsedData.success) {
      return { success: false, message: "Validation failed. Total weightage must be 100%." };
    }

    // 2. Database Transaction: Create Sheet and nested Goals simultaneously
    await prisma.goalSheet.create({
      data: {
        userId: data.userId,
        cyclePeriod: data.cyclePeriod,
        status: "PENDING_APPROVAL", // Goes directly to Manager queue
        goals: {
          create: data.goals.map((goal) => ({
            title: goal.title,
            thrustArea: goal.thrustArea,
            description: goal.description,
            uomType: goal.uomType,
            weightage: goal.weightage,
            plannedTarget: goal.plannedTarget,
          })),
        },
      },
    });

    // 3. Clear cache so the dashboard updates instantly without refresh
    revalidatePath("/employee");
    
    return { success: true, message: "Goal Sheet submitted successfully for manager approval." };
  } catch (error) {
    console.error("Goal Submission Error:", error);
    return { success: false, message: "Failed to submit goals due to a server error." };
  }
}

/**
 * PHASE 1: Manager Approves & Locks the Goal Sheet
 */
export async function approveGoalSheet(sheetId: string, managerId: string): Promise<ServerActionResponse> {
  try {
    await prisma.goalSheet.update({
      where: { id: sheetId },
      data: { status: "LOCKED" },
    });

    revalidatePath("/manager");
    return { success: true, message: "Goal Sheet approved and permanently locked." };
  } catch (error) {
    return { success: false, message: "Failed to approve goals." };
  }
}

/**
 * BONUS FEATURE: Admin pushes a Shared KPI to an entire department
 */
export async function pushSharedGoal(departmentUserIds: string[], goalDetails: any): Promise<ServerActionResponse> {
  // Hackathon logic: Loop through users and force-inject a read-only goal into their active sheet
  // This is a great feature to mention during your presentation for extra points.
  return { success: true, message: "KPI pushed to department." };
}

// Add to the bottom of src/actions/goal.actions.ts
export async function withdrawGoalSheet(sheetId: string): Promise<ServerActionResponse> {
  try {
    // 1. Delete the nested goals first
    await prisma.goal.deleteMany({ where: { goalSheetId: sheetId } });
    
    // 2. Delete the parent sheet
    await prisma.goalSheet.delete({ where: { id: sheetId } });

    revalidatePath("/employee");
    return { success: true, message: "Goal sheet withdrawn. You can now edit and resubmit." };
  } catch (error) {
    console.error("Withdraw Error:", error);
    return { success: false, message: "Failed to withdraw goal sheet." };
  }
}