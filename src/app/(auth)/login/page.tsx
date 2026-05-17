"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Target, ArrowRight, ShieldAlert, Users, UserIcon } from "lucide-react";
import { toast } from "sonner";
import { loginUser } from "@/actions/auth.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 1. STANDARD LOGIN: Reads the email from the input and checks the database
  const handleStandardLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Extract email from the native form submission
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    const res = await loginUser(email);
    
    if (res.success) {
      toast.success(`Welcome back, ${res?.name}!`);
      // Route dynamically based on their actual database role
      if (res.role === "EMPLOYEE") router.push("/employee");
      if (res.role === "MANAGER") router.push("/manager");
      if (res.role === "ADMIN") router.push("/admin");
    } else {
      toast.error(res.message || "Failed to log in.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Branding */}
        <div className="hidden md:flex flex-col gap-4 p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-primary p-2 rounded-xl">
              <Target className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold tracking-tight">AtomQuest</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Align your goals. <br /> Drive performance.
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            The all-in-one portal for setting thrust areas, tracking quarterly achievements, and fostering manager alignment.
          </p>
        </div>

        {/* Right Side: Login Card */}
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Enter your corporate email to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Standard Form */}
            <form onSubmit={handleStandardLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="name@company.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" type="password" required defaultValue="password123" />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-2 border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}