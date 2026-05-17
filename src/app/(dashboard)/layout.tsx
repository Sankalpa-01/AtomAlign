// import Sidebar from "@/components/layout/sidebar";
// import TopNav from "@/components/layout/top-nav";

// // Note: In a real production app with Azure AD, you would fetch the user's actual session here.
// // For the hackathon demo, we are setting a default state that your TopNav switcher will override via routing.
// const DEMO_USER = {
//   name: "Sankalpa Panda", // Or whatever demo name you want to present
//   role: "EMPLOYEE" as const, 
// };

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex h-screen overflow-hidden bg-muted/10 font-sans">
      
//       {/* 1. The Persistent Sidebar */}
//       {/* We pass the role so it knows which links to hide/show */}
//       <Sidebar currentRole={DEMO_USER.role} />
      
//       {/* 2. The Main Content Area */}
//       <div className="flex flex-col flex-1 overflow-hidden">
        
//         {/* The Top Navigation Bar */}
//         <TopNav currentRole={DEMO_USER.role} userName={DEMO_USER.name} />
        
//         {/* 3. The Page Content (This is where page.tsx gets injected) */}
//         <main className="flex-1 overflow-y-auto p-6 md:p-8">
//           <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
//             {children}
//           </div>
//         </main>

//       </div>
//     </div>
//   );
// }

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