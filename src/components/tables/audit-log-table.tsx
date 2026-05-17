"use client";

import { ShieldAlert } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AuditLogEntry = {
  id: string;
  goalId: string;
  changedBy: string; // Admin ID or Name
  action: string;
  timestamp: Date;
};

interface AuditLogTableProps {
  logs: AuditLogEntry[];
}

export default function AuditLogTable({ logs }: AuditLogTableProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10 border-dashed">
        <ShieldAlert className="w-8 h-8 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-semibold">No Audit Events</h3>
        <p className="text-sm text-muted-foreground">The system has not logged any locked-goal modifications.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border shadow-sm">
      <Table>
        <TableHeader className="bg-red-50/50 dark:bg-red-950/20">
          <TableRow>
            <TableHead className="w-[180px]">Timestamp</TableHead>
            <TableHead className="w-[200px]">Changed By (Admin)</TableHead>
            <TableHead className="w-[250px]">Target Goal ID</TableHead>
            <TableHead>Action Log</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="font-mono text-xs">
              <TableCell className="text-muted-foreground">
                {new Intl.DateTimeFormat('en-GB', { 
                  dateStyle: 'medium', 
                  timeStyle: 'medium' 
                }).format(new Date(log.timestamp))}
              </TableCell>
              <TableCell className="font-semibold">{log.changedBy}</TableCell>
              <TableCell className="text-muted-foreground truncate max-w-[200px]">
                {log.goalId}
              </TableCell>
              <TableCell className="text-red-600 dark:text-red-400">
                {log.action}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}