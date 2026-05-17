"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateUserAccount } from "@/actions/user.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsForm({ user }: { user: { id: string, name: string | null, email: string | null } }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // startTransition lets us show a loading state without freezing the UI
    startTransition(async () => {
      const res = await updateUserAccount(formData);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>Changes will be reflected across the portal.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Notice we use onSubmit instead of action here! */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="userId" value={user.id} />
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" defaultValue={user.name || ""} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" defaultValue={user.email || ""} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="Leave blank to keep current password" 
            />
          </div>

          <Button type="submit" className="mt-4" disabled={isPending}>
            {isPending ? "Saving changes..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}