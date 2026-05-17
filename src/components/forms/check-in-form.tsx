"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckInSchema } from "@/lib/validations";
import { z } from "zod";
import { submitManagerCheckIn } from "@/actions/checkin.actions";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type CheckInFormValues = z.infer<typeof CheckInSchema>;

interface CheckInFormProps {
  goalId: string;
  managerId: string;
  currentAchievement?: string; // Pre-fill if employee already entered something
  onSuccessCallback?: () => void; // Used to close the modal after submission
}

export default function CheckInForm({ goalId, managerId, currentAchievement, onSuccessCallback }: CheckInFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckInFormValues>({
    resolver: zodResolver(CheckInSchema),
    defaultValues: {
      goalId: goalId,
      status: "NOT_STARTED",
      actualAchievement: currentAchievement || "",
      comment: "",
    },
  });

  async function onSubmit(data: CheckInFormValues) {
    setIsSubmitting(true);
    
    // Call the Phase 2 Server Action
    const res = await submitManagerCheckIn({
      ...data,
      managerId, // Inject the manager ID from props
    });

    if (res.success) {
      toast.success(res.message);
      if (onSuccessCallback) onSuccessCallback(); // Close the modal
    } else {
      toast.error(res.message || "Failed to log check-in");
    }
    
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Progress Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                    <SelectItem value="ON_TRACK">On Track</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="actualAchievement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actual Achievement</FormLabel>
                <FormControl><Input placeholder="Enter actual numbers/dates" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manager Feedback (Required)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Document the quarterly discussion here..." 
                  className="resize-none h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Log Check-in"}
        </Button>
      </form>
    </Form>
  );
}