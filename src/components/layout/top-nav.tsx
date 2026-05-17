"use client";

import { useRouter } from "next/navigation";
import { Bell, Search, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logoutUser } from "@/actions/auth.actions";
import { toast } from "sonner";
import { useState } from "react";

interface TopNavProps {
  currentRole: string;
  userName: string;
}

export default function TopNav({ currentRole, userName }: TopNavProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutUser(); // Clears the session cookie
    toast.success("Logged out successfully");
    router.push("/login"); // Redirects back to login
    setIsLoggingOut(false);
  };

  return (
    <header className="h-16 border-b bg-primary/10 flex items-center justify-between px-6 sticky top-0 z-10">
      
      {/* Left Side: Search Bar */}
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search goals, users, or thrust areas..." 
            className="w-full pl-9 bg-muted/50 focus-visible:bg-background"
          />
        </div>
      </div>

      {/* Right Side: Profile & Logout */}
      <div className="flex items-center gap-4">

        <Button variant="ghost" size="icon" className="relative hidden md:flex">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 border-2 border-background" />
        </Button>

        <div className="flex items-center gap-3 border-l pl-4 ml-2">
          {/* User Info */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <UserIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-sm font-semibold leading-none">{userName}</span>
              <span className="text-xs text-muted-foreground mt-1 capitalize">
                {currentRole.toLowerCase()}
              </span>
            </div>
          </div>

          {/* Clean Logout Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-muted-foreground hover:text-red-600 hover:bg-red-50 ml-2"
          >
            <LogOut className="h-4 w-4 mr-2 hidden sm:block" />
            {isLoggingOut ? "Exiting..." : "Log out"}
          </Button>
        </div>

      </div>
    </header>
  );
}