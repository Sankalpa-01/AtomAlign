"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Lock } from "lucide-react";
import { toast } from "sonner";
import { withdrawGoalSheet } from "@/actions/goal.actions";

export default function WithdrawButton({ sheetId, status }: { sheetId: string, status: string }) {
  const [isPending, setIsPending] = useState(false);

  // If the manager has already locked it, they can't withdraw!
  if (status === "LOCKED") {
    return (
      <Button variant="outline" size="sm" className="gap-2 opacity-50" onClick={() => toast.info("Contact HR to edit locked goals.")}>
        <Lock className="w-4 h-4" /> Locked
      </Button>
    );
  }

  const handleWithdraw = async () => {
    setIsPending(true);
    const res = await withdrawGoalSheet(sheetId);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
      setIsPending(false);
    }
  };

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={handleWithdraw} disabled={isPending}>
      <Edit2 className="w-4 h-4" />
      {isPending ? "Withdrawing..." : "Withdraw & Edit"}
    </Button>
  );
}