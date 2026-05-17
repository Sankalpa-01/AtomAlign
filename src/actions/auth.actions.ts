"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
type Role = "EMPLOYEE" | "MANAGER" | "ADMIN";

// MOCK LOGIN: Finds the user by email and sets a session cookie
export async function loginUser(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return { success: false, message: "No account found with that email." };
    }

    // Set a cookie with the user's ID that lasts for 1 day
    const cookieStore = await cookies();
    cookieStore.set("atomquest_session", user.id, {
      path: "/",
      maxAge: 60 * 60 * 24
    });

    return { success: true, role: user.role, name: user.name };
  } catch (error) {
    return { success: false, message: "Server error during login." };
  }
}

// MOCK REGISTER: Creates a real user in NeonDB and logs them in
export async function registerUser(data: { name: string, email: string, role: Role }) {
  try {
    // Check if email exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return { success: false, message: "Email already in use." };

    // Hackathon Trick: Automatically assign new employees to a specific manager 
    // so the Phase 1 approval workflow works out of the box!
    let assignedManagerId = null;
    if (data.role === "EMPLOYEE") {
      const defaultManager = await prisma.user.findFirst({ where: { role: "MANAGER" } });
      if (defaultManager) assignedManagerId = defaultManager.id;
    }

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        managerId: assignedManagerId, // Links them to the manager!
      }
    });

    // Auto-login after registration
    const cookieStore = await cookies();
    cookieStore.set("atomquest_session", newUser.id, { path: "/", maxAge: 60 * 60 * 24 });
    return { success: true, role: newUser.role };
  } catch (error) {
    return { success: false, message: "Registration failed." };
  }
}

// LOGOUT
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("atomquest_session");
  return { success: true };
}