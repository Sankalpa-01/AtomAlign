"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Target, 
  CheckCircle, 
  Users, 
  BarChart3, 
  Settings,
  ShieldAlert
} from "lucide-react";

// The roles we defined in your Prisma schema
type Role = "EMPLOYEE" | "MANAGER" | "ADMIN";

interface SidebarProps {
  currentRole: Role;
}

export default function Sidebar({ currentRole }: SidebarProps) {
  const pathname = usePathname();

  // Define all possible routes and which roles can see them
  const navItems = [
    {
      title: "My Goals",
      href: "/employee",
      icon: <Target className="w-5 h-5" />,
      roles: ["EMPLOYEE", "MANAGER"], 
    },
    {
      title: "Team Approvals",
      href: "/manager",
      icon: <CheckCircle className="w-5 h-5" />,
      roles: ["MANAGER"],
    },
    {
      title: "Team Check-ins",
      href: "/manager/check-ins",
      icon: <Users className="w-5 h-5" />,
      roles: ["MANAGER"],
    },
    {
      title: "Completion Dashboard",
      href: "/admin",
      icon: <BarChart3 className="w-5 h-5" />,
      roles: ["ADMIN"],
    },
    {
      title: "Audit Logs",
      href: "/admin/audit",
      icon: <ShieldAlert className="w-5 h-5" />,
      roles: ["ADMIN"],
    },
  ];

  // Filter links based on the current user's role
  const visibleLinks = navItems.filter((item) => item.roles.includes(currentRole));

  return (
    <div className="flex flex-col w-64 h-screen bg-card border-r px-4 py-8">
      <div className="flex items-center gap-2 px-2 mb-10">
        <div className="bg-primary p-1.5 rounded-lg">
          <Target className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight">AtomQuest</span>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {visibleLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {link.icon}
              {link.title}
            </Link>
          );
        })}
      </nav>

      {/* Inside sidebar.tsx, at the bottom */}
      <div className="mt-auto px-2">
        <Link 
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="w-5 h-5" />
          Account Settings  {/* Changed from Settings */}
        </Link>
      </div>
    </div>
  );
}