"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="rounded-full bg-primary/10 p-2">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <span className="font-heading text-xl font-bold text-primary">
            SpeakUp
          </span>
        </Link>

        {/* Right Side - Theme Toggle & CTA */}
        <div className="flex items-center gap-4">
          <Button asChild size="sm" className="rounded-full">
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
