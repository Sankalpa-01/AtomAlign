"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CsvExportButton({ data }: { data: any[] }) {
  
  const handleDownload = () => {
    if (!data || data.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    // 1. Create CSV Headers
    const headers = ["Employee Name", "Goal Title", "Thrust Area", "Target", "Achievement", "Status"];
    
    // 2. Map data to rows
    const rows = data.map(sheet => {
      return sheet.goals.map((goal: any) => [
        `"${sheet.user?.name || 'Unknown'}"`,
        `"${goal.title}"`,
        `"${goal.thrustArea}"`,
        `"${goal.plannedTarget}"`,
        `"${goal.actualAchievement || '0'}"`,
        `"${goal.status}"`
      ].join(","));
    }).flat();

    // 3. Combine and trigger download
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AtomQuest_Achievement_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV Export downloaded!");
  };

  return (
    <Button onClick={handleDownload} variant="outline" className="gap-2">
      <Download className="w-4 h-4" /> Export Achievement Report
    </Button>
  );
}