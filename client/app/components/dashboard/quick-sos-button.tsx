"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function QuickSosButton() {
  const [isActivating, setIsActivating] = useState(false);

  const handleSOS = () => {
    setIsActivating(true);
    // Simulate SOS activation
    setTimeout(() => {
      alert(
        "SOS Alert Sent! Your location and emergency message have been shared with trusted contacts."
      );
      setIsActivating(false);
    }, 1500);
  };

  return (
    <Button
      onClick={handleSOS}
      disabled={isActivating}
      className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full bg-destructive text-destructive-foreground shadow-2xl transition-all hover:scale-110 hover:bg-destructive/90 hover:shadow-destructive/50 lg:h-20 lg:w-20"
      style={{
        animation: isActivating
          ? "none"
          : "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }}
    >
      <AlertCircle className="h-8 w-8 lg:h-10 lg:w-10" />
      <span className="sr-only">Quick SOS Emergency Button</span>
    </Button>
  );
}
