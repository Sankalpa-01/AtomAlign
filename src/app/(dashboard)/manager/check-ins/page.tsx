import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default async function TeamCheckInsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("atomquest_session")?.value;
  if (!userId) redirect("/login");

  // Fetch LOCKED goals for employees reporting to this manager
  const activeTeamSheets = await prisma.goalSheet.findMany({
    where: { 
      status: "LOCKED",
      user: { managerId: userId } 
    },
    include: { user: true, goals: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Check-ins</h1>
        <p className="text-muted-foreground mt-2">Monitor active quarterly progress for your direct reports.</p>
      </div>

      {activeTeamSheets.length === 0 ? (
        <Card className="bg-muted/50"><CardContent className="p-6 text-center text-muted-foreground">No active goals found for your team.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {activeTeamSheets.map((sheet) => (
            <Card key={sheet.id}>
              <CardHeader className="bg-muted/30 border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-primary" /> {sheet.user.name}'s Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {sheet.goals.map(goal => (
                  <div key={goal.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{goal.title} <Badge variant="outline" className="ml-2">{goal.weightage}%</Badge></p>
                      <p className="text-sm text-muted-foreground">Target: {goal.plannedTarget} | Achieved: {goal.actualAchievement || "None"}</p>
                    </div>
                    <Badge variant={goal.status === "COMPLETED" ? "default" : "secondary"}>{goal.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}