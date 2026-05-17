import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// Optimizing fonts using Next.js built-in Google Fonts
const inter = Inter({ subsets: ["latin"] });

// This metadata boosts your SEO and changes the browser tab title
export const metadata: Metadata = {
  title: "AtomQuest | Goal Tracking Portal",
  description: "In-House Goal Setting & Tracking Portal for the AtomQuest Hackathon 1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {/* Your application pages will be injected here */}
        {children}
        
        {/* Global Toast Provider for success/error messages */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}