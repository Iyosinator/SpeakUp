"use client";

import { AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface EmergencyContact {
  name: string;
  email: string;
}

export function QuickSosButton() {
  const [isActivating, setIsActivating] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [hasContacts, setHasContacts] = useState(false);
  const router = useRouter();

  // Check if user has emergency contacts
  useEffect(() => {
    const checkContacts = () => {
      const savedContacts = localStorage.getItem("emergency_contacts");
      if (savedContacts) {
        try {
          const contacts: EmergencyContact[] = JSON.parse(savedContacts);
          setHasContacts(contacts.length > 0);
        } catch (e) {
          setHasContacts(false);
        }
      }
    };

    checkContacts();
    // Check every 5 seconds in case contacts are added
    const interval = setInterval(checkContacts, 5000);
    return () => clearInterval(interval);
  }, []);

  // Get user's location
  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Location error:", error);
          reject("Location access denied");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  // Send SOS alert
  const sendSosAlert = async () => {
    setIsActivating(true);

    try {
      const savedContacts = localStorage.getItem("emergency_contacts");
      if (!savedContacts) {
        throw new Error("No emergency contacts found");
      }

      const contacts: EmergencyContact[] = JSON.parse(savedContacts);

      if (contacts.length === 0) {
        throw new Error("No emergency contacts found");
      }

      // Get location
      const location = await getLocation();

      const timestamp = new Date().toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      });

      // Send email via API
      const response = await fetch("/api/send-sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contacts,
          location,
          timestamp,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error");
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send SOS");
      }

      // Success!
      alert(
        `✓ Emergency Alert Sent!\n\n` +
          `${result.successful} contact(s) notified\n` +
          `Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}\n\n` +
          `Your emergency contacts have been alerted and can see your location on Google Maps.`
      );
    } catch (error) {
      console.error("Quick SOS Error:", error);

      let errorMessage = "⚠️ Could not send SOS alert.\n\n";

      if (error instanceof Error) {
        if (error.message.includes("No emergency contacts")) {
          errorMessage +=
            "You need to add emergency contacts first.\n\nGo to SOS page → Manage Contacts";
          // Redirect to SOS page after showing alert
          setTimeout(() => router.push("/dashboard/sos"), 100);
        } else if (error.message.includes("Location")) {
          errorMessage += "Please enable location access and try again.";
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += "Please try again or call 911 directly.";
      }

      alert(errorMessage);
    } finally {
      setIsActivating(false);
      setCountdown(null);
    }
  };

  const handleSOS = () => {
    // If no contacts, redirect to setup page
    if (!hasContacts) {
      if (
        confirm(
          "You need to add emergency contacts first.\n\n" +
            "Go to SOS page to set up your emergency contacts?"
        )
      ) {
        router.push("/dashboard/sos");
      }
      return;
    }

    // Start 5-second countdown
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          sendSosAlert();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancel = () => {
    setCountdown(null);
    setIsActivating(false);
  };

  // Show countdown overlay
  if (countdown !== null) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex h-32 w-32 mx-auto items-center justify-center rounded-full bg-destructive text-destructive-foreground md:h-40 md:w-40">
            <span className="text-6xl font-bold md:text-7xl">{countdown}</span>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white mb-2">
              Activating Emergency SOS...
            </p>
            <p className="text-white/80 mb-6">
              Sending alerts to{" "}
              {
                JSON.parse(localStorage.getItem("emergency_contacts") || "[]")
                  .length
              }{" "}
              contact(s)
            </p>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="lg"
              className="bg-white text-black hover:bg-gray-100"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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
        {isActivating ? (
          <Mail className="h-8 w-8 lg:h-10 lg:w-10 animate-pulse" />
        ) : (
          <AlertCircle className="h-8 w-8 lg:h-10 lg:w-10" />
        )}
        <span className="sr-only">Quick SOS Emergency Button</span>
      </Button>

      {/* Status indicator */}
      {!hasContacts && (
        <div className="fixed bottom-28 right-8 z-40 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
          Setup Required
        </div>
      )}
    </>
  );
}
