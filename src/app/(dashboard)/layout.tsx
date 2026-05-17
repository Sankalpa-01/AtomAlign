import Sidebar from "@/components/layout/sidebar";
import TopNav from "@/components/layout/top-nav";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get the current logged-in user's ID
  const cookieStore = await cookies();
  const userId = cookieStore.get("atomquest_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  // 2. Fetch their real data from NeonDB
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, role: true, email: true },
  });

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/10 font-sans">
      <Sidebar currentRole={currentUser.role} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Pass the dynamic user data to the TopNav */}
        <TopNav 
          currentRole={currentUser.role} 
          userName={currentUser.name} 
        />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}