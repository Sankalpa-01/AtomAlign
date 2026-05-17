"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, X } from "lucide-react";
import { toast } from "sonner";
import { pushDepartmentKPI } from "@/actions/kpi.actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PushKpiModal({ managerId }: { managerId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPushing(true);
    const formData = new FormData(e.currentTarget);
    
    const res = await pushDepartmentKPI(managerId, formData);
    if (res.success) {
      toast.success(res.message);
      setIsOpen(false);
    } else {
      toast.error(res.message);
    }
    setIsPushing(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
        <Target className="w-4 h-4" /> Push Department KPI
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-xl border shadow-xl flex flex-col">
            <div className="flex justify-between p-6 border-b">
              <h3 className="font-semibold text-lg">Distribute Shared Goal</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}><X className="w-4 h-4" /></Button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>KPI Title</Label>
                <Input name="title" placeholder="e.g., Q1 Department Revenue" required />
              </div>
              <div className="space-y-2">
                <Label>Thrust Area</Label>
                <Input name="thrustArea" placeholder="e.g., Financial Growth" required />
              </div>
              <div className="space-y-2">
                <Label>Target</Label>
                <Input name="target" placeholder="e.g., $1,000,000" required />
              </div>
              <div className="space-y-2">
                <Label>Unit of Measurement</Label>
                <Select name="uomType" defaultValue="NUMERIC_MIN">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NUMERIC_MIN">Numeric (Higher is Better)</SelectItem>
                    <SelectItem value="ZERO">Zero Incidents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full mt-4" disabled={isPushing}>
                {isPushing ? "Pushing to Team..." : "Push KPI to All Direct Reports"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}