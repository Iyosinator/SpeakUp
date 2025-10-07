"use client";

import { Heart, Shield } from "lucide-react";

export function WelcomeSection() {
  return (
    <div className="mb-8 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
            Hello, you're safe here{" "}
            <Heart
              className="inline h-6 w-6 text-primary"
              fill="currentColor"
            />
          </h1>
          <p className="mt-2 text-muted-foreground">
            "You are stronger than you think. We're here to support you every
            step of the way."
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-success/10 px-4 py-2 md:flex">
          <Shield className="h-5 w-5 text-success" />
          <span className="font-medium text-success">SOS Ready</span>
        </div>
      </div>
    </div>
  );
}
