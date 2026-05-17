import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ShieldAlert, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AuditLogsPage() {
  // 1. Verify Admin Session
  const cookieStore = await cookies();
  const userId = cookieStore.get("atomquest_session")?.value;
  if (!userId) redirect("/login");

  // 2. Fetch all Audit Logs, including the Goal data they are attached to
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { timestamp: 'desc' },
    include: { 
      goal: true // Pulls in the goal title so we know what was changed
    }
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-red-600" /> System Audit Logs
        </h1>
        <p className="text-muted-foreground mt-2">
          Immutable ledger of all administrative overrides, approvals, and post-lock modifications.
        </p>
      </div>

      <Card>
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Event History</CardTitle>
          <CardDescription>All recorded actions on the platform.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {auditLogs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No audit logs have been recorded yet.
            </div>
          ) : (
            <div className="divide-y">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                  
                  {/* Left Side: Action & Goal Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {log.action}
                      </Badge>
                      <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" /> Goal: {log.goal?.title || "Unknown Goal"}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Action performed by User ID: </span>
                      <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">{log.changedBy}</span>
                    </div>
                  </div>

                  {/* Right Side: Timestamp */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                    <Clock className="w-4 h-4" />
                    {new Date(log.timestamp).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}