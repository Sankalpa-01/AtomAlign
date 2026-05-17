import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/forms/settings-form";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("atomquest_session")?.value;

  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true }, 
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Update your profile information and manage your account security.
        </p>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}