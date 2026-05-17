"use server";

import prisma from "@/lib/prisma";
import { SubmitCheckInInput, ServerActionResponse } from "@/types";
import { CheckInSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

/**
 * PHASE 2: Employee updates their Actual Achievements
 */
export async function updateGoalProgress(
  goalId: string, 
  actualAchievement: string, 
  status: "NOT_STARTED" | "ON_TRACK" | "COMPLETED"
): Promise<ServerActionResponse> {
  try {
    await prisma.goal.update({
      where: { id: goalId },
      data: {
        actualAchievement,
        status,
      },
    });

    revalidatePath("/employee");
    return { success: true, message: "Progress updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update progress." };
  }
}

/**
 * PHASE 2: Manager conducts a Quarterly Check-in & leaves feedback
 */
export async function submitManagerCheckIn(data: SubmitCheckInInput): Promise<ServerActionResponse> {
  try {
    const parsedData = CheckInSchema.safeParse(data);
    if (!parsedData.success) {
      return { success: false, message: "Invalid check-in data." };
    }

    // Run as a transaction: Update the goal status AND log the manager's comment
    await prisma.$transaction([
      prisma.goal.update({
        where: { id: data.goalId },
        data: {
          actualAchievement: data.actualAchievement,
          status: data.status,
        },
      }),
      prisma.checkIn.create({
        data: {
          goalId: data.goalId,
          managerId: data.managerId,
          comment: data.comment,
        },
      }),
    ]);

    revalidatePath("/manager");
    return { success: true, message: "Quarterly check-in logged successfully." };
  } catch (error) {
    console.error("Check-in Error:", error);
    return { success: false, message: "Failed to submit check-in." };
  }
}

/**
 * GOVERNANCE: Log an audit event if Admin unlocks and changes a locked goal
 */
export async function logAuditEvent(goalId: string, adminId: string, actionDesc: string) {
  await prisma.auditLog.create({
    data: {
      goalId: goalId,
      changedBy: adminId,
      action: actionDesc,
    }
  });
}