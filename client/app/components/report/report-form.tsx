"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Upload,
  Shield,
  MapPin,
  Calendar,
  FileText,
  CheckCircle2,
} from "lucide-react";

export function ReportForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [consent, setConsent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsSubmitted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  if (isSubmitted) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Report Submitted Safely
        </h2>
        <p className="mt-2 text-muted-foreground">
          Help is on the way. Your report has been received and will be reviewed
          by our trusted partners.
        </p>
        <div className="mt-6 rounded-lg bg-muted p-4">
          <p className="text-sm font-medium text-foreground">
            Your Anonymous Report ID:
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-primary">
            SR-{Math.random().toString(36).substring(2, 10).toUpperCase()}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Save this ID to track your report status
          </p>
        </div>
        <Button onClick={() => setIsSubmitted(false)} className="mt-6">
          Submit Another Report
        </Button>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Incident Details */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Incident Details
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="incident-type" className="mb-2 block">
              Type of Incident *
            </Label>
            <Select required>
              <SelectTrigger id="incident-type">
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="sexual-abuse">
                  Sexual Abuse / Assault
                </SelectItem>
                <SelectItem value="domestic-violence">
                  Domestic Violence
                </SelectItem>
                <SelectItem value="bullying">Bullying</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="incident-date" className="mb-2 block">
                <Calendar className="mr-2 inline h-3 w-3 mb-1 block" />
                Date of Incident (Optional)
              </Label>
              <Input id="incident-date" type="date" />
            </div>
            <div>
              <Label htmlFor="incident-time" className="mb-2 block">
                Time of Incident (Optional)
              </Label>
              <Input id="incident-time" type="time" />
            </div>
          </div>

          <div>
            <Label htmlFor="location" className="mb-2 block">
              <MapPin className="mr-2 inline h-3 w-3 mb-1 block" />
              Location (Optional)
            </Label>
            <Input id="location" placeholder="Enter location or leave blank" />
          </div>

          <div>
            <Label className="mb-2 block"  htmlFor="description">
              Description / Your Story *
            </Label>
            <Textarea
              id="description"
              placeholder="Please describe what happened. Take your time and share as much or as little as you're comfortable with."
              className="min-h-[150px]"
              required
            />
          </div>
        </div>
      </Card>

      {/* Evidence Upload */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Evidence / Media Upload (Optional)
          </h2>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-foreground">
              Drag & drop files here, or click to select
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Photos, videos, or documents (Max 10MB each)
            </p>
            <Input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="mt-4"
            />
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Selected Files:
              </p>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-lg bg-muted p-2 text-sm"
                >
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Anonymity & Consent */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Privacy & Consent
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="anonymous" className="cursor-pointer font-medium">
                I want to remain anonymous
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Your identity will not be shared with anyone
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="consent" className="cursor-pointer font-medium">
                I consent to share this report with trusted NGOs / authorities
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Your data is encrypted and only shared with authorized support
                organizations
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 flex-shrink-0 text-primary" />
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  Your Safety is Our Priority
                </p>
                <p className="mt-1 text-muted-foreground">
                  All reports are encrypted end-to-end. We never share your
                  information without your explicit consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Submit Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          className="sm:order-1 bg-transparent"
        >
          Save Draft
        </Button>
        <Button type="submit" size="lg" className="sm:order-2">
          Submit Report Securely
        </Button>
      </div>

      {/* Emergency Note */}
      <Card className="border-destructive/20 bg-destructive/5 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
          <div className="text-sm">
            <p className="font-medium text-foreground">In Immediate Danger?</p>
            <p className="mt-1 text-muted-foreground">
              If you're in immediate danger, use the Quick SOS button in the
              bottom-right corner or call emergency services.
            </p>
          </div>
        </div>
      </Card>
    </form>
  );
}
