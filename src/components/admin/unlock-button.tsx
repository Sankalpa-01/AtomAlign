"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Unlock } from "lucide-react";
import { toast } from "sonner";
import { unlockGoalSheet } from "@/actions/manager.actions";

export default function AdminUnlockButton({ sheetId, adminId }: { sheetId: string, adminId: string }) {
  const [isPending, setIsPending] = useState(false);

  const handleUnlock = async () => {
    setIsPending(true);
    const res = await unlockGoalSheet(sheetId, adminId);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIsPending(false);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleUnlock} disabled={isPending} className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
      <Unlock className="w-4 h-4 mr-2" />
      {isPending ? "Unlocking..." : "Force Unlock"}
    </Button>
  );
}