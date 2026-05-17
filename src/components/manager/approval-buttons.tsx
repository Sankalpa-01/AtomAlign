"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { approveGoalSheet, returnGoalSheet } from "@/actions/manager.actions";

export default function ApprovalButtons({ sheetId, managerId }: { sheetId: string, managerId: string }) {
  const [isPending, setIsPending] = useState(false);

  const handleApprove = async () => {
    setIsPending(true);
    const res = await approveGoalSheet(sheetId, managerId);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
    setIsPending(false);
  };

  const handleReturn = async () => {
    setIsPending(true);
    const res = await returnGoalSheet(sheetId, managerId);
    if (res.success) toast.info(res.message);
    else toast.error(res.message);
    setIsPending(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={handleReturn} disabled={isPending}>
        <XCircle className="w-4 h-4 mr-1" /> Return
      </Button>
      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleApprove} disabled={isPending}>
        <CheckCircle className="w-4 h-4 mr-1" /> Approve
      </Button>
    </div>
  );
}