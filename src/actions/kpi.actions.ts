"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
type UomType = "NUMERIC_MIN" | "NUMERIC_MAX" | "TIMELINE" | "ZERO";

export async function pushDepartmentKPI(managerId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const target = formData.get("target") as string;
    const thrustArea = formData.get("thrustArea") as string;
    const uomType = formData.get("uomType") as UomType;

    // 1. Find all employees reporting to this manager
    const teamMembers = await prisma.user.findMany({
      where: { managerId: managerId }
    });

    // 2. Loop through each employee and inject the goal
    for (const employee of teamMembers) {
      // Find their current Q1-2026 sheet, or create a draft if they haven't started
      let sheet = await prisma.goalSheet.findFirst({
        where: { userId: employee.id, cyclePeriod: "Q1-2026" }
      });

      if (!sheet) {
        sheet = await prisma.goalSheet.create({
          data: { userId: employee.id, cyclePeriod: "Q1-2026", status: "PENDING_APPROVAL" }
        });
      }

      // Inject the read-only shared goal
      await prisma.goal.create({
        data: {
          goalSheetId: sheet.id,
          title: title,
          thrustArea: thrustArea,
          plannedTarget: target,
          uomType: uomType,
          weightage: 10, // Default minimum, employee must adjust later
          isShared: true, // Flags it as read-only!
          status: "NOT_STARTED"
        }
      });
    }

    revalidatePath("/manager");
    return { success: true, message: `KPI pushed to ${teamMembers.length} team members!` };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to push KPI." };
  }
}