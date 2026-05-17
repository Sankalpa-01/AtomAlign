"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PenLine, X } from "lucide-react";
import { toast } from "sonner";
import { updateGoalProgress } from "@/actions/checkin.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LogProgressModal({ goal }: { goal: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [achievement, setAchievement] = useState(goal.actualAchievement || "");
  const [status, setStatus] = useState<"NOT_STARTED" | "ON_TRACK" | "COMPLETED">(goal.status);

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateGoalProgress(goal.id, achievement, status);
    
    if (res.success) {
      toast.success("Progress updated successfully!");
      setIsOpen(false);
    } else {
      toast.error(res.message);
    }
    setIsSaving(false);
  };

  return (
    <>
      <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-primary" onClick={() => setIsOpen(true)}>
        <PenLine className="w-4 h-4 mr-2" /> Log Progress
      </Button>

      {/* Foolproof Tailwind Modal (No Shadcn CLI required) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground w-full max-w-md rounded-xl border shadow-xl flex flex-col">
            
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="font-semibold text-lg">Update Progress</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{goal.title}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>Current Status</Label>
                <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                    <SelectItem value="ON_TRACK">On Track</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Actual Achievement Data</Label>
                <Input 
                  placeholder={`Target was: ${goal.plannedTarget}`} 
                  value={achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end p-6 border-t gap-3 bg-muted/20 rounded-b-xl">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Progress"}
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}