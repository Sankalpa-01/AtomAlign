"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoalSheetSchema } from "@/lib/validations";
import { z } from "zod";
import { submitGoalSheet } from "@/actions/goal.actions";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Trash2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Infer the TypeScript type directly from your Zod schema
type GoalSheetFormValues = z.infer<typeof GoalSheetSchema>;

export default function GoalSheetForm({ userId, initialGoals }: { userId: string, initialGoals?: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GoalSheetFormValues>({
    resolver: zodResolver(GoalSheetSchema) as any,
    defaultValues: {
      cyclePeriod: "Q1-2026",
      // If there are initial goals (like a shared KPI pushed by a manager), load them. Otherwise, blank goal.
      goals: initialGoals && initialGoals.length > 0 ? initialGoals : [
        { title: "", thrustArea: "", description: "", uomType: "NUMERIC_MIN", weightage: 0, plannedTarget: "", isShared: false }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "goals",
    control: form.control,
  });

  // Calculate real-time total weightage for the UI
  const watchedGoals = form.watch("goals");
  const totalWeightage = watchedGoals.reduce((sum, goal) => sum + (Number(goal.weightage) || 0), 0);

  async function onSubmit(data: GoalSheetFormValues) {
    // 1. VALIDATION: Enforce minimum 10% weightage per individual goal
    const hasInvalidWeight = data.goals.some((goal) => Number(goal.weightage) < 10);
    if (hasInvalidWeight) {
      toast.error("Validation Error: Every individual goal must have at least 10% weightage.");
      return; 
    }

    // 2. VALIDATION: Enforce exactly 100% total weightage
    if (totalWeightage !== 100) {
      toast.error(`Total weightage is ${totalWeightage}%. It must equal exactly 100%.`);
      return; 
    }

    setIsSubmitting(true);
    
    const res = await submitGoalSheet({
      userId,
      cyclePeriod: data.cyclePeriod,
      goals: data.goals,
    });

    if (res.success) {
      toast.success(res.message);
      form.reset(); 
    } else {
      toast.error(res.message || "Something went wrong");
    }
    
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {fields.map((field: any, index) => (
          <Card key={field.id} className={`relative ${field.isShared ? 'border-indigo-200 bg-indigo-50/30' : ''}`}>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">Goal {index + 1}</CardTitle>
                
                {/* Visual indicator for Shared KPIs */}
                {field.isShared && (
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Shared KPI
                  </Badge>
                )}
              </div>

              {/* Prevent deleting Shared KPIs */}
              {index > 0 && !field.isShared && (
                <Button 
                  type="button" variant="destructive" size="icon" 
                  className="h-8 w-8"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <FormField
                control={form.control}
                name={`goals.${index}.title`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Goal Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Increase Q1 Sales" 
                        {...inputField} 
                        disabled={field.isShared} // READ-ONLY LOCK
                        className={field.isShared ? "bg-muted text-muted-foreground font-medium" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`goals.${index}.thrustArea`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Thrust Area</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Revenue Growth" 
                        {...inputField} 
                        disabled={field.isShared} // READ-ONLY LOCK
                        className={field.isShared ? "bg-muted text-muted-foreground" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`goals.${index}.uomType`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Unit of Measurement</FormLabel>
                    <Select onValueChange={inputField.onChange} defaultValue={inputField.value} disabled={field.isShared}>
                      <FormControl>
                        <SelectTrigger className={field.isShared ? "bg-muted text-muted-foreground" : ""}>
                          <SelectValue placeholder="Select UoM" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NUMERIC_MIN">Numeric (Higher is Better)</SelectItem>
                        <SelectItem value="NUMERIC_MAX">Numeric (Lower is Better)</SelectItem>
                        <SelectItem value="TIMELINE">Timeline (Date)</SelectItem>
                        <SelectItem value="ZERO">Zero (Incidents)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`goals.${index}.plannedTarget`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>Target</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., $500k" 
                          {...inputField} 
                          disabled={field.isShared} // READ-ONLY LOCK
                          className={field.isShared ? "bg-muted text-muted-foreground font-medium" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Notice that Weightage does NOT have the disabled property! */}
                <FormField
                  control={form.control}
                  name={`goals.${index}.weightage`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>Weightage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...inputField} />
                      </FormControl>
                      {field.isShared && (
                        <p className="text-[10px] text-indigo-600 mt-1 leading-tight">
                          Adjust this weight to balance your other goals.
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Form Controls & Validation UI */}
        <div className="flex items-center justify-between bg-muted p-4 rounded-lg border">
          <div>
            <span className="text-sm text-muted-foreground">Total Weightage: </span>
            <span className={`font-bold text-lg ${totalWeightage === 100 ? "text-green-600" : "text-red-600"}`}>
              {totalWeightage}%
            </span>
            {form.formState.errors.goals?.root && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.goals.root.message}</p>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="space-x-3 flex">
              {fields.length < 8 && (
                <Button 
                  type="button" variant="outline" 
                  onClick={() => append({ title: "", thrustArea: "", description: "", uomType: "NUMERIC_MIN", weightage: 0, plannedTarget: "", isShared: false })}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Goal
                </Button>
              )}
              
              <Button type="submit" disabled={isSubmitting || totalWeightage !== 100}>
                {isSubmitting ? "Submitting..." : "Submit Goal Sheet"}
              </Button>
            </div>
            
            {fields.length >= 8 && (
              <p className="text-red-500 text-xs font-medium">Maximum 8 goals allowed per quarter.</p>
            )}
          </div>
        </div>
        
      </form>
    </Form>
  );
}