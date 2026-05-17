import prisma from "@/lib/prisma";
import GoalSheetForm from "@/components/forms/goal-sheet-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Edit2, PenLine, Clock } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import WithdrawButton from "../../../components/employee/wirhdraw-button";
import LogProgressModal from "../../../components/employee/log-process-modal";
import { calculateGoalScore } from "@/lib/scoring";

export default async function EmployeeDashboard() {
  // 1. READ THE REAL SESSION
  const cookieStore = await cookies();
  const userId = cookieStore.get("atomquest_session")?.value;
  
  if (!userId) {
    redirect("/login"); 
  }

  // 2. FETCH REAL DATA FOR THIS SPECIFIC USER
  const activeSheet = await prisma.goalSheet.findFirst({
    where: { userId: userId, cyclePeriod: "Q1-2026" },
    include: { goals: true }
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Goals</h1>
        <p className="text-muted-foreground mt-2">
          Set your thrust areas, track quarterly progress, and align with company objectives.
        </p>
      </div>

      {!activeSheet ? (
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Phase 1: Goal Creation
            </h2>
            <p className="text-sm text-muted-foreground">
              Draft your goals below. Total weightage must equal exactly 100%.
            </p>
          </div>
          <GoalSheetForm userId={userId} />
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Status Banner */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                Goal Sheet Status: 
                <Badge variant={activeSheet.status === "LOCKED" ? "default" : "secondary"}>
                  {activeSheet.status}
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {activeSheet.status === "LOCKED" 
                  ? "Your goals are locked and active for this quarter." 
                  : "Your goals are currently pending manager approval."}
              </p>
            </div>
          </div>

          {/* Section Header with the NEW Edit Button */}
          <div className="flex items-center justify-between mt-8 mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Phase 2: My Active Goals
            </h2>

            <WithdrawButton sheetId={activeSheet.id} status={activeSheet.status} />
          </div>
          
          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSheet.goals.map((goal) => (
              <Card key={goal.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg leading-tight pr-4">{goal.title}</CardTitle>
                    <Badge variant="default" className="shrink-0">{goal.weightage}% Weight</Badge>
                  </div>
                  <CardDescription className="pt-1">{goal.thrustArea}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="space-y-4 mt-2">
                    
                    {/* Goal Metrics */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm items-center border-b pb-2">
                        <span className="text-muted-foreground">Target:</span>
                        <span className="font-medium">{goal.plannedTarget}</span>
                      </div>
                      <div className="flex justify-between text-sm items-center border-b pb-2">
                        <span className="text-muted-foreground">Current Achievement:</span>
                        <span className="font-medium">{goal.actualAchievement || "Not updated yet"}</span>
                      </div>
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={goal.status === "COMPLETED" ? "default" : "outline"} className="bg-background">
                          {goal.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>

                    {/* NEW: System Computed Score & Progress Bar */}
                    <div className="pt-4 bg-slate-50 p-3 rounded-lg border">
                      <div className="flex justify-between text-sm items-center mb-2">
                        <span className="font-semibold text-slate-700">System Computed Score</span>
                        <span className="font-bold text-primary">
                          {calculateGoalScore(goal.uomType, goal.plannedTarget, goal.actualAchievement)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${Math.min(calculateGoalScore(goal.uomType, goal.plannedTarget, goal.actualAchievement), 100)}%` 
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* NEW Action Footer to make the card feel actionable */}
                <CardFooter className="bg-muted/20 border-t p-3 mt-auto">
                  <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-primary">
                    <PenLine className="w-4 h-4 mr-2" /> 
                    Log Progress
                  </Button>
                  <LogProgressModal goal={goal} />
                </CardFooter>
              </Card>
            ))}
          </div>
          
        </div>
      )}
    </div>
  );
}