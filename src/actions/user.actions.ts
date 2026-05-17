"use server";

import prisma from "@/lib/prisma";
import { ServerActionResponse, UserWithTeam } from "@/types";
import { revalidatePath } from "next/cache";

export async function getUserProfile(userId: string): Promise<ServerActionResponse<UserWithTeam>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        manager: true,
        teamMembers: true,
      },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return { success: true, message: "Profile fetched", data: user };
  } catch (error) {
    console.error("Fetch User Error:", error);
    return { success: false, message: "Failed to fetch user profile." };
  }
}

/**
 * Gets all employees reporting to a specific L1 Manager
 */
export async function getTeamMembers(managerId: string): Promise<ServerActionResponse<UserWithTeam[]>> {
  try {
    const team = await prisma.user.findMany({
      where: { managerId: managerId },
      include: {
        manager: true,
        teamMembers: true, // Included to satisfy the UserWithTeam type
      },
    });

    return { success: true, message: "Team fetched", data: team };
  } catch (error) {
    console.error("Fetch Team Error:", error);
    return { success: false, message: "Failed to fetch team members." };
  }
}

export async function updateUserAccount(formData: FormData) {
  const userId = formData.get("userId") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // Only update the password if they actually typed something in
    const updateData: any = { name, email };
    
    // Note: In a production app, you would hash this password with bcrypt before saving!
    if (password && password.trim() !== "") {
      updateData.password = password; 
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Refresh the layout so the TopNav immediately shows the new name
    revalidatePath("/", "layout");
    
    return { success: true, message: "Account updated successfully." };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, message: "Failed to update account details." };
  }
}