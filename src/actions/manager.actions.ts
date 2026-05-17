"use server";

import prisma from "@/lib/prisma";
import { SheetStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function approveGoalSheet(sheetId: string, managerId: string) {
  try {
    // 1. Lock the overarching goal sheet
    await prisma.goalSheet.update({
      where: { id: sheetId },
      data: { status: SheetStatus.LOCKED }
    });

    // 2. Fetch all the individual goals attached to this sheet
    const goals = await prisma.goal.findMany({
      where: { goalSheetId: sheetId }
    });

    // 3. Create an Audit Log for EACH goal to satisfy your schema
    const auditLogEntries = goals.map((goal) => ({
      goalId: goal.id,
      changedBy: managerId, // Using your specific field name
      action: "Manager approved and locked goal.", // Using your specific field name
    }));

    // 4. Batch insert all the logs at once
    if (auditLogEntries.length > 0) {
      await prisma.auditLog.createMany({
        data: auditLogEntries
      });
    }

    revalidatePath("/manager");
    revalidatePath("/admin");
    return { success: true, message: "Goal sheet approved and locked." };
  } catch (error) {
    console.error("Manager Approval Error:", error);
    return { success: false, message: "Failed to approve sheet." };
  }
}

export async function returnGoalSheet(sheetId: string, managerId: string) {
  try {
    // 1. Change status to PENDING_APPROVAL
    await prisma.goalSheet.update({
      where: { id: sheetId },
      data: { status: SheetStatus.PENDING_APPROVAL }
    });

    // 2. Log the action for the Admin Audit Trail
    const goals = await prisma.goal.findMany({ where: { goalSheetId: sheetId } });
    const logs = goals.map(g => ({
      goalId: g.id,
      changedBy: managerId,
      action: "Manager returned goals for rework."
    }));
    
    if (logs.length > 0) await prisma.auditLog.createMany({ data: logs });

    revalidatePath("/manager");
    return { success: true, message: "Goal sheet returned to employee." };
  } catch (error) {
    return { success: false, message: "Failed to return sheet." };
  }
}

export async function unlockGoalSheet(sheetId: string, adminId: string) {
  try {
    // 1. Revert status back to pending
    await prisma.goalSheet.update({
      where: { id: sheetId },
      data: { status: SheetStatus.PENDING_APPROVAL }
    });

    // 2. Log the Admin override
    const goals = await prisma.goal.findMany({ where: { goalSheetId: sheetId } });
    const logs = goals.map(g => ({
      goalId: g.id,
      changedBy: adminId,
      action: "ADMIN OVERRIDE: Unlocked goal sheet."
    }));
    
    if (logs.length > 0) await prisma.auditLog.createMany({ data: logs });

    revalidatePath("/admin");
    return { success: true, message: "Goals unlocked successfully." };
  } catch (error) {
    return { success: false, message: "Failed to unlock goals." };
  }
}