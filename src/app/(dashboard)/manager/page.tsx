import prisma from "@/lib/prisma";
import ManagerApprovalTable from "@/components/tables/manager-approval-table";
import PushKpiModal from "@/components/manager/push-kpi-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ManagerDashboard() {
  // 1. READ THE REAL SESSION
  const cookieStore = await cookies();
  const userId = cookieStore.get("atomquest_session")?.value;

  if (!userId) {
    redirect("/login"); // Kick them out if not logged in
  }

  // 2. Fetch all pending goal sheets for employees reporting to THIS dynamic manager
  const pendingSheets = await prisma.goalSheet.findMany({
    where: { 
      status: "PENDING_APPROVAL",
      user: { managerId: userId } // Using the real logged-in Manager's ID
    },
    include: {
      user: true,
      goals: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // Format data for the table component
  const formattedSheets = pendingSheets.map(sheet => ({
    id: sheet.id,
    userName: sheet.user.name,
    cyclePeriod: sheet.cyclePeriod,
    goalCount: sheet.goals.length,
    status: sheet.status,
    submittedAt: sheet.createdAt,
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* HEADER WITH THE PUSH KPI BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Approvals</h1>
          <p className="text-muted-foreground mt-2">
            Review, adjust, and approve goal sheets submitted by your direct reports.
          </p>
        </div>
        
        {/* INJECTED MODAL HERE */}
        <PushKpiModal managerId={userId} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Pending Goal Sheets
          </CardTitle>
          <CardDescription>
            Once approved, goals are locked and cannot be edited without HR intervention.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Passing the dynamic userId down to the table so the Server Action knows who is approving it */}
          <ManagerApprovalTable sheets={formattedSheets} managerId={userId} />
        </CardContent>
      </Card>
    </div>
  );
}