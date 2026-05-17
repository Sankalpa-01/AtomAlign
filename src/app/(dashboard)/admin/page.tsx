import prisma from "@/lib/prisma";
import AuditLogTable from "@/components/tables/audit-log-table";
import CsvExportButton from "@/components/admin/csv-export-button";
import AdminUnlockButton from "@/components/admin/unlock-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert, Activity, CheckCircle2, Users, Lock } from "lucide-react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("atomquest_session")?.value;
  if (!userId) redirect("/login");
    
  // 1. FETCH REAL DYNAMIC STATS FROM DATABASE
  const totalEmployees = await prisma.user.count({ where: { role: "EMPLOYEE" } });
  const pendingApprovals = await prisma.goalSheet.count({ where: { status: "PENDING_APPROVAL" } });
  
  // Fetch detailed locked sheets for both the CSV Export and the Unlock feature
  const lockedSheetsData = await prisma.goalSheet.findMany({
    where: { status: "LOCKED" },
    include: { user: true, goals: true },
    orderBy: { updatedAt: 'desc' }
  });
  
  const totalSheets = pendingApprovals + lockedSheetsData.length;
  const completionRate = totalEmployees > 0 ? Math.round((totalSheets / totalEmployees) * 100) : 0;

  // 2. FETCH REAL AUDIT LOGS
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: 20
  });

  const stats = [
    { title: "Total Employees", value: totalEmployees.toString(), icon: <Users className="w-4 h-4 text-muted-foreground" /> },
    { title: "Goal Submission Rate", value: `${completionRate}%`, icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
    { title: "Pending Approvals", value: pendingApprovals.toString(), icon: <Activity className="w-4 h-4 text-yellow-500" /> },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR & Admin Portal</h1>
          <p className="text-muted-foreground mt-2">Monitor organizational completion rates and track immutable audit logs.</p>
        </div>
        {/* INJECTED CSV EXPORT BUTTON HERE */}
        <CsvExportButton data={lockedSheetsData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SYSTEM AUDIT TRAIL */}
        <Card className="border-red-100 dark:border-red-900/30">
          <CardHeader className="bg-red-50/30 dark:bg-red-900/10 border-b">
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <ShieldAlert className="w-5 h-5" /> System Audit Trail
            </CardTitle>
            <p className="text-sm text-muted-foreground">Immutable ledger of all administrative overrides and post-lock modifications.</p>
          </CardHeader>
          <CardContent className="pt-6">
            <AuditLogTable logs={auditLogs} />
          </CardContent>
        </Card>

        {/* ADMIN UNLOCK SECTION */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" /> Active Locked Sheets
            </CardTitle>
            <CardDescription>Override and unlock goals if rework is required post-approval.</CardDescription>
          </CardHeader>
          <CardContent>
            {lockedSheetsData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No locked sheets available.</p>
            ) : (
              <div className="space-y-4">
                {lockedSheetsData.map(sheet => (
                  <div key={sheet.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{sheet.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{sheet.goals.length} Goals | {sheet.cyclePeriod}</p>
                    </div>
                    {/* INJECTED ADMIN UNLOCK BUTTON HERE */}
                    <AdminUnlockButton sheetId={sheet.id} adminId={userId} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}