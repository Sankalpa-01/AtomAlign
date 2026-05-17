// "use client";

// import { useState } from "react";
// import { toast } from "sonner";
// import { approveGoalSheet } from "@/actions/goal.actions";
// import { CheckCircle, Eye } from "lucide-react";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";

// // Using a simplified type for the hackathon UI
// type PendingSheet = {
//   id: string;
//   userName: string;
//   cyclePeriod: string;
//   goalCount: number;
//   status: string;
//   submittedAt: Date;
// };

// interface ManagerApprovalTableProps {
//   sheets: PendingSheet[];
//   managerId: string;
// }

// export default function ManagerApprovalTable({ sheets, managerId }: ManagerApprovalTableProps) {
//   const [isProcessing, setIsProcessing] = useState<string | null>(null);

//   const handleApprove = async (sheetId: string) => {
//     setIsProcessing(sheetId);
//     const res = await approveGoalSheet(sheetId, managerId);
    
//     if (res.success) {
//       toast.success(res.message);
//     } else {
//       toast.error(res.message || "Failed to approve goals.");
//     }
//     setIsProcessing(null);
//   };

//   if (sheets.length === 0) {
//     return (
//       <div className="text-center p-8 border rounded-lg bg-muted/20">
//         <p className="text-muted-foreground">No goal sheets pending approval.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-md border">
//       <Table>
//         <TableHeader className="bg-muted/50">
//           <TableRow>
//             <TableHead>Employee</TableHead>
//             <TableHead>Cycle</TableHead>
//             <TableHead>Goals</TableHead>
//             <TableHead>Submitted On</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {sheets.map((sheet) => (
//             <TableRow key={sheet.id}>
//               <TableCell className="font-medium">{sheet.userName}</TableCell>
//               <TableCell>{sheet.cyclePeriod}</TableCell>
//               <TableCell>{sheet.goalCount} Goals</TableCell>
//               <TableCell>{new Intl.DateTimeFormat('en-GB').format(new Date(sheet.submittedAt))}</TableCell>
//               <TableCell>
//                 <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
//                   Pending
//                 </Badge>
//               </TableCell>
//               <TableCell className="text-right space-x-2">
//                 <Button variant="outline" size="sm" title="View Details">
//                   <Eye className="w-4 h-4 mr-1" /> View
//                 </Button>
//                 <Button 
//                   variant="default" 
//                   size="sm" 
//                   onClick={() => handleApprove(sheet.id)}
//                   disabled={isProcessing === sheet.id}
//                 >
//                   <CheckCircle className="w-4 h-4 mr-1" /> 
//                   {isProcessing === sheet.id ? "Approving..." : "Approve"}
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

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