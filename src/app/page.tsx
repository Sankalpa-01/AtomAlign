import Link from "next/link";
import { Target, ArrowRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      
      {/* Top Navigation for Landing Page */}
      <div className="absolute top-0 w-full flex items-center justify-between p-6 md:px-12 z-20">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">AtomQuest</span>
        </div>
        
        {/* Added the Sign Up button next to Sign In */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-semibold">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button className="font-semibold shadow-sm">Sign Up</Button>
          </Link>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="max-w-4xl text-center space-y-8 px-4 z-10">
        
        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
          AtomQuest Hackathon 1.0 Submission
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Align your goals.<br />
          <span className="text-primary">Drive performance.</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The all-in-one structured, digital Goal Setting & Tracking Portal. 
          Eliminate manual spreadsheets, align your team with clear KPIs, and track quarterly achievements in real-time.
        </p>
        
        {/* Updated Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/login">
            <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
              Go to Portal <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          
          <Link href="/register">
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-background/50 backdrop-blur-sm hover:bg-muted">
              <UserPlus className="mr-2 w-5 h-5" /> Create Account
            </Button>
          </Link>
        </div>

        {/* Hackathon Requirement: Link your repo
        <div className="pt-8">
          <Link href="https://github.com/your-username/atomquest-portal" target="_blank">
            <Button variant="link" className="text-muted-foreground hover:text-foreground">
              <Github className="mr-2 w-4 h-4" /> View Source Code Repository
            </Button>
          </Link>
        </div> */}

      </div>

      {/* Decorative Background Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
    </div>
  );
}