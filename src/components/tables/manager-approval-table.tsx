"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ApprovalButtons from "@/components/manager/approval-buttons"; // <--- Import the buttons

export default function ManagerApprovalTable({ sheets, managerId }: { sheets: any[], managerId: string }) {
  if (sheets.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground border rounded-lg bg-muted/20">
        No goal sheets pending approval.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Cycle</TableHead>
            <TableHead>Goals</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sheets.map((sheet) => (
            <TableRow key={sheet.id}>
              <TableCell className="font-medium">{sheet.userName}</TableCell>
              <TableCell>{sheet.cyclePeriod}</TableCell>
              <TableCell>{sheet.goalCount}</TableCell>
              <TableCell>
                <Badge variant="secondary">{sheet.status.replace("_", " ")}</Badge>
              </TableCell>
              <TableCell className="text-right">
                
                {/* INJECT THE APPROVE/RETURN BUTTONS HERE */}
                <ApprovalButtons sheetId={sheet.id} managerId={managerId} />

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}