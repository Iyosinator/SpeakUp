"use client";

import {
  AlertCircle,
  Phone,
  MapPin,
  Shield,
  Clock,
  CheckCircle,
  Mail,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

const hotlines = [
  {
    name: "National Domestic Violence Hotline",
    number: "1-800-799-7233",
    available: "24/7",
    url: "tel:18007997233",
  },
  {
    name: "National Sexual Assault Hotline",
    number: "1-800-656-4673",
    available: "24/7",
    url: "tel:18006564673",
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    available: "24/7",
    url: "sms:741741&body=HOME",
  },
];

const nearbyShelters = [
  {
    name: "Safe Haven Shelter",
    distance: "2.3 miles",
    address: "123 Safety St, New York, NY",
    phone: "212-555-0100",
  },
  {
    name: "Hope House",
    distance: "3.7 miles",
    address: "456 Refuge Ave, New York, NY",
    phone: "310-555-0200",
  },
  {
    name: "Sanctuary Place",
    distance: "5.1 miles",
    address: "789 Protection Blvd, New York, NY",
    phone: "312-555-0300",
  },
];

const safetySteps = [
  "Find a safe location away from immediate danger",
  "Call emergency services if in immediate danger (911)",
  "Contact trusted friends or family members",
  "Reach out to local shelters or safe houses",
  "Document any evidence if it's safe to do so",
  "Seek medical attention if needed",
];

interface EmergencyContact {
  name: string;
  email: string;
}

export function SosContent() {
  const [sosActivated, setSosActivated] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([]);
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isSending, setIsSending] = useState(false);

  // Load saved contacts from localStorage
  useEffect(() => {
    const savedContacts = localStorage.getItem("emergency_contacts");
    if (savedContacts) {
      try {
        setEmergencyContacts(JSON.parse(savedContacts));
      } catch (e) {
        console.error("Error loading contacts:", e);
      }
    }
  }, []);

  // Save contacts to localStorage
  const saveContacts = (contacts: EmergencyContact[]) => {
    localStorage.setItem("emergency_contacts", JSON.stringify(contacts));
    setEmergencyContacts(contacts);
  };

  // Add emergency contact
  const addContact = () => {
    if (!newContactName.trim() || !newContactEmail.trim()) {
      alert("Please enter both name and email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newContactEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    const newContact = {
      name: newContactName.trim(),
      email: newContactEmail.trim(),
    };
    const updatedContacts = [...emergencyContacts, newContact];
    saveContacts(updatedContacts);
    setNewContactName("");
    setNewContactEmail("");
  };

  // Remove emergency contact
  const removeContact = (index: number) => {
    const updatedContacts = emergencyContacts.filter((_, i) => i !== index);
    saveContacts(updatedContacts);
  };

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

  // Send SOS email via API
  const sendSosAlert = async () => {
    if (emergencyContacts.length === 0) {
      setShowContactDialog(true);
      setCountdown(null);
      return;
    }

    setIsSending(true);

    try {
      // Get location
      const userLocation = await getLocation();
      setLocation(userLocation);

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

      console.log("Sending SOS request...", {
        contactCount: emergencyContacts.length,
        location: userLocation,
      });

      // Send email via API
      const response = await fetch("/api/send-sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contacts: emergencyContacts,
          location: userLocation,
          timestamp: timestamp,
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error(
          "Server returned an invalid response. Please check server logs."
        );
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.details || "Failed to send SOS alerts"
        );
      }

      console.log("SOS Result:", result);

      setSosActivated(true);
    } catch (error) {
      console.error("SOS Error:", error);

      let errorMessage = "Could not send SOS alert. ";

      if (error instanceof Error) {
        if (
          error.message.includes("Location") ||
          error.message.includes("Geolocation")
        ) {
          errorMessage +=
            "Please enable location access in your browser settings and try again.";
        } else if (
          error.message.includes("Server") ||
          error.message.includes("invalid response")
        ) {
          errorMessage +=
            "Server error. Please contact emergency services directly at 911.";
        } else if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("network")
        ) {
          errorMessage +=
            "Network error. Please check your internet connection.";
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage +=
          "Please try again or contact emergency services directly.";
      }

      alert(errorMessage);
      setSosActivated(false);
      setCountdown(null);
    } finally {
      setIsSending(false);
    }
  };

  const handleSosActivation = () => {
    if (emergencyContacts.length === 0) {
      alert("Please add at least one emergency contact first");
      setShowContactDialog(true);
      return;
    }

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
    setSosActivated(false);
    setLocation(null);
    setIsSending(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="font-heading text-3xl font-bold text-destructive md:text-4xl lg:text-5xl">
            Emergency SOS
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
            Immediate help and resources for emergency situations
          </p>
        </div>

        {/* Emergency Contacts Setup */}
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Emergency Contacts
                </CardTitle>
                <CardDescription>
                  Add trusted contacts who will receive email alerts when you
                  press SOS
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowContactDialog(true)}
              >
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {emergencyContacts.length === 0 ? (
              <div className="text-center py-6">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-3">
                  No emergency contacts added yet
                </p>
                <Button onClick={() => setShowContactDialog(true)}>
                  Add First Contact
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {contact.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Will receive email
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main SOS Button */}
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center p-8 md:p-12">
            {!sosActivated && countdown === null && !isSending && (
              <div className="flex flex-col items-center gap-6">
                <Button
                  onClick={handleSosActivation}
                  size="lg"
                  disabled={isSending}
                  className="h-32 w-32 rounded-full bg-destructive text-destructive-foreground shadow-2xl transition-all hover:scale-110 hover:bg-destructive/90 md:h-40 md:w-40"
                  style={{
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="h-12 w-12 md:h-16 md:w-16" />
                    <span className="text-lg font-bold md:text-xl">SOS</span>
                  </div>
                </Button>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">
                    Press for Emergency Help
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This will share your location and alert{" "}
                    {emergencyContacts.length > 0
                      ? `${emergencyContacts.length} trusted contact${
                          emergencyContacts.length > 1 ? "s" : ""
                        }`
                      : "emergency contacts"}
                  </p>
                </div>
              </div>
            )}

            {countdown !== null && !isSending && (
              <div className="flex flex-col items-center gap-6">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-destructive text-destructive-foreground md:h-40 md:w-40">
                  <span className="text-5xl font-bold md:text-6xl">
                    {countdown}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">
                    Activating SOS Alert...
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Preparing to send email alerts
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {isSending && (
              <div className="flex flex-col items-center gap-6">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-blue-600 text-white md:h-40 md:w-40">
                  <Mail className="h-16 w-16 md:h-20 md:w-20 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">
                    Sending Emergency Alerts...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Emailing {emergencyContacts.length} contact
                    {emergencyContacts.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}

            {sosActivated && !isSending && (
              <div className="flex flex-col items-center gap-6">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-green-600 text-white md:h-40 md:w-40">
                  <CheckCircle className="h-16 w-16 md:h-20 md:w-20" />
                </div>
                <div className="text-center space-y-3">
                  <p className="text-lg font-semibold text-green-600">
                    SOS Alert Sent Successfully! ✓
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email alerts sent to {emergencyContacts.length} contact
                    {emergencyContacts.length > 1 ? "s" : ""}
                  </p>
                  {location && (
                    <div className="text-xs text-muted-foreground space-y-2">
                      <p className="font-medium">Location shared:</p>
                      <p>
                        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapPin className="mr-2 h-3 w-3" />
                          View on Google Maps
                        </a>
                      </Button>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="mt-4"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Hotlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-destructive" />
              Emergency Hotlines
            </CardTitle>
            <CardDescription>
              24/7 support available immediately
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {hotlines.map((contact, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-lg border border-border p-4 transition-all hover:border-destructive sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">
                    {contact.name}
                  </p>
                  <p className="text-sm font-medium text-destructive">
                    {contact.number}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {contact.available}
                  </Badge>
                  <Button size="sm" variant="destructive" asChild>
                    <a href={contact.url}>
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Nearby Shelters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Nearby Safe Shelters
            </CardTitle>
            <CardDescription>
              Find immediate safe housing near you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {nearbyShelters.map((shelter, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-lg border border-border p-4 transition-all hover:border-primary sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">
                    {shelter.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {shelter.address}
                  </p>
                  <a
                    href={`tel:${shelter.phone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {shelter.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{shelter.distance}</Badge>
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(
                        shelter.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Directions
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Safety Guidance */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Immediate Safety Steps
            </CardTitle>
            <CardDescription>
              Follow these steps to ensure your safety
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {safetySteps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-sm text-foreground md:text-base">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-muted">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 flex-shrink-0 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Privacy & Security</p>
                <p className="text-xs text-muted-foreground">
                  Your emergency contacts are stored locally in your browser for
                  privacy. Location is only shared when you activate SOS. Real
                  emails will be sent to your emergency contacts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contacts Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Emergency Contacts</DialogTitle>
            <DialogDescription>
              Add people who will receive an email alert when you press SOS
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Existing Contacts */}
            {emergencyContacts.length > 0 && (
              <div className="space-y-2">
                <Label>Your Emergency Contacts</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {emergencyContacts.map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {contact.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {contact.email}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContact(index)}
                        className="ml-2 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Contact */}
            <div className="space-y-3 pt-4 border-t">
              <Label>Add New Contact</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Contact Name (e.g., John Doe)"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addContact();
                    }
                  }}
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addContact();
                    }
                  }}
                />
              </div>
              <Button onClick={addContact} className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
