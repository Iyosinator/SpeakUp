"use client";

import type React from "react";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
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
  Trash2,
  Clock,
  User,
  Phone,
  Mail,
  Home,
  UserX,
  Users,
  Plus,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "@/hooks/useSession";

interface UploadedFile {
  file: File;
  preview?: string;
}

interface Witness {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  whatTheyWitnessed: string;
}

export function ReportForm() {
  const sessionId = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [consent, setConsent] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string>("");

  // Victim Information
  const [victimFullName, setVictimFullName] = useState("");
  const [victimPhone, setVictimPhone] = useState("");
  const [victimEmail, setVictimEmail] = useState("");
  const [victimAddress, setVictimAddress] = useState("");

  // Incident Details
  const [incidentType, setIncidentType] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // Assailant Information
  const [assailantName, setAssailantName] = useState("");
  const [assailantNickname, setAssailantNickname] = useState("");
  const [assailantHeight, setAssailantHeight] = useState("");
  const [assailantHairColor, setAssailantHairColor] = useState("");
  const [assailantBuild, setAssailantBuild] = useState("");
  const [assailantClothing, setAssailantClothing] = useState("");
  const [relationshipToVictim, setRelationshipToVictim] = useState("");
  const [assailantAddress, setAssailantAddress] = useState("");
  const [assailantWorkplace, setAssailantWorkplace] = useState("");
  const [assailantSocialMedia, setAssailantSocialMedia] = useState("");

  // Witnesses - Dynamic Array
  const [witnesses, setWitnesses] = useState<Witness[]>([]);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Add Witness
  const addWitness = () => {
    const newWitness: Witness = {
      id: `witness-${Date.now()}`,
      name: "",
      contactNumber: "",
      email: "",
      whatTheyWitnessed: "",
    };
    setWitnesses([...witnesses, newWitness]);
  };

  // Remove Witness
  const removeWitness = (id: string) => {
    setWitnesses(witnesses.filter((w) => w.id !== id));
  };

  // Update Witness
  const updateWitness = (id: string, field: keyof Witness, value: string) => {
    setWitnesses(
      witnesses.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  // Drag and drop handlers
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "video/mp4",
      "video/quicktime",
    ];

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        setError(`File ${file.name} exceeds 10MB limit`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        setError(`File ${file.name} has unsupported format`);
        return false;
      }
      return true;
    });

    const newFiles: UploadedFile[] = validFiles.map((file) => {
      const uploadedFile: UploadedFile = { file };
      if (file.type.startsWith("image/")) {
        uploadedFile.preview = URL.createObjectURL(file);
      }
      return uploadedFile;
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setError(null);
  };

  const removeFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!incidentType || !description.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (description.length < 20) {
      setError("Description must be at least 20 characters");
      return;
    }

    if (!sessionId) {
      setError("Session not found. Please refresh the page.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Upload files to Supabase Storage
      const fileUrls: string[] = [];

      for (const { file } of uploadedFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${sessionId}-${Date.now()}.${fileExt}`;
        const filePath = `incident-reports/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("evidence")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`File upload failed: ${uploadError.message}`);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("evidence").getPublicUrl(filePath);

        fileUrls.push(publicUrl);
      }

      // Prepare assailant information
      const assailantInfo = {
        full_name: assailantName,
        nickname: assailantNickname,
        physical_description: {
          height: assailantHeight,
          hair_color: assailantHairColor,
          build: assailantBuild,
          clothing: assailantClothing,
        },
        relationship: relationshipToVictim,
        address: assailantAddress,
        workplace: assailantWorkplace,
        social_media: assailantSocialMedia,
      };

      // Insert report into database
      const { data, error: dbError } = await supabase
        .from("incident_reports")
        .insert({
          session_id: sessionId,
          // Victim Information
          victim_full_name: !isAnonymous ? victimFullName : null,
          victim_phone: !isAnonymous ? victimPhone : null,
          victim_email: !isAnonymous ? victimEmail : null,
          victim_address: !isAnonymous ? victimAddress : null,
          // Incident Details
          incident_type: incidentType,
          incident_date: incidentDate || null,
          incident_time: incidentTime || null,
          location: location || null,
          description: description,
          // Assailant Information
          assailant_info: assailantInfo,
          // Witnesses
          witnesses: witnesses,
          // Privacy
          is_anonymous: isAnonymous,
          consent_to_share: consent,
          evidence_urls: fileUrls,
          status: "pending",
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      const generatedId = `SR-${data.id.substring(0, 8).toUpperCase()}`;
      setReportId(generatedId);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = () => {
    const draft = {
      victimFullName,
      victimPhone,
      victimEmail,
      victimAddress,
      incidentType,
      incidentDate,
      incidentTime,
      location,
      description,
      assailantName,
      assailantNickname,
      assailantHeight,
      assailantHairColor,
      assailantBuild,
      assailantClothing,
      relationshipToVictim,
      assailantAddress,
      assailantWorkplace,
      assailantSocialMedia,
      witnesses,
      isAnonymous,
      consent,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("incident_report_draft", JSON.stringify(draft));
    alert("Draft saved successfully!");
  };

  const resetForm = () => {
    setVictimFullName("");
    setVictimPhone("");
    setVictimEmail("");
    setVictimAddress("");
    setIncidentType("");
    setIncidentDate("");
    setIncidentTime("");
    setLocation("");
    setDescription("");
    setAssailantName("");
    setAssailantNickname("");
    setAssailantHeight("");
    setAssailantHairColor("");
    setAssailantBuild("");
    setAssailantClothing("");
    setRelationshipToVictim("");
    setAssailantAddress("");
    setAssailantWorkplace("");
    setAssailantSocialMedia("");
    setWitnesses([]);
    setUploadedFiles([]);
    setIsAnonymous(true);
    setConsent(false);
    setIsSubmitted(false);
    setError(null);
  };

  if (isSubmitted) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
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
            {reportId}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Save this ID to track your report status
          </p>
        </div>
        <Button onClick={resetForm} className="mt-6">
          Submit Another Report
        </Button>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Victim Information */}
      {!isAnonymous && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Victim Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="victim-name" className="mb-2">
                <User className="mr-1 inline h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="victim-name"
                placeholder="Enter your full name"
                value={victimFullName}
                onChange={(e) => setVictimFullName(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="victim-phone" className="mb-2">
                  <Phone className="mr-1 inline h-4 w-4 " />
                  Phone Number
                </Label>
                <Input
                  id="victim-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={victimPhone}
                  onChange={(e) => setVictimPhone(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="victim-email" className="mb-2">
                  <Mail className="mr-1 inline h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="victim-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={victimEmail}
                  onChange={(e) => setVictimEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="victim-address" className="mb-2">
                <Home className="mr-1 inline h-4 w-4" />
                Home Address
              </Label>
              <Textarea
                id="victim-address"
                placeholder="Enter your full address"
                rows={2}
                value={victimAddress}
                onChange={(e) => setVictimAddress(e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}

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
            <Label htmlFor="incident-type" className="mb-2">
              Type of Incident *
            </Label>
            <Select
              value={incidentType}
              onValueChange={setIncidentType}
              required
            >
              <SelectTrigger id="incident-type">
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verbal-assault">Verbal Assault</SelectItem>
                <SelectItem value="cyber-assault">
                  Online/Cyber Assault
                </SelectItem>
                <SelectItem value="physical-assault">
                  Physical Assault
                </SelectItem>
                <SelectItem value="sexual-assault">Sexual Assault</SelectItem>
                <SelectItem value="aggravated-assault">
                  Aggravated Assault
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Helper text for incident types */}
            <div className="mt-3 rounded-lg border border-border bg-muted/50 p-3 text-xs">
              <p className="font-semibold text-foreground mb-2">
                💡 Need help choosing?
              </p>
              <div className="space-y-1.5 text-muted-foreground">
                <p>
                  • <strong className="text-foreground">Verbal:</strong> Words
                  used to harm, threaten, or intimidate
                </p>
                <p>
                  • <strong className="text-foreground">Online/Cyber:</strong>{" "}
                  Digital harassment, threats, or bullying
                </p>
                <p>
                  • <strong className="text-foreground">Physical:</strong> Any
                  intentional physical contact causing harm
                </p>
                <p>
                  • <strong className="text-foreground">Sexual:</strong>{" "}
                  Unwanted sexual contact without consent
                </p>
                <p>
                  • <strong className="text-foreground">Aggravated:</strong>{" "}
                  Severe assault with weapon or serious injury
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="incident-date" className="mb-2">
                <Calendar className="mr-1 inline h-4 w-4" />
                Date of Incident (Optional)
              </Label>
              <Input
                id="incident-date"
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="incident-time" className="mb-2">
                <Clock className="mr-1 inline h-4 w-4" />
                Time of Incident (Optional)
              </Label>
              <Input
                id="incident-time"
                type="time"
                value={incidentTime}
                onChange={(e) => setIncidentTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location" className="mb-2">
              <MapPin className="mr-1 inline h-4 w-4" />
              Location (Optional)
            </Label>
            <Input
              id="location"
              placeholder="Enter location or leave blank"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description" className="mb-2">
              Description / Your Story *
            </Label>
            <Textarea
              id="description"
              placeholder="Please describe what happened. Take your time and share as much or as little as you're comfortable with."
              className="min-h-[150px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-muted-foreground text-right">
              {description.length} characters
            </p>
          </div>
        </div>
      </Card>

      {/* Assailant Information */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <UserX className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Assailant Information
          </h2>
          <span className="ml-auto text-xs text-muted-foreground">
            (Optional but helpful)
          </span>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="assailant-name" className="mb-2">
                Full Name
              </Label>
              <Input
                id="assailant-name"
                placeholder="If known"
                value={assailantName}
                onChange={(e) => setAssailantName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="assailant-nickname" className="mb-2">
                Nickname / Alias
              </Label>
              <Input
                id="assailant-nickname"
                placeholder="Known as..."
                value={assailantNickname}
                onChange={(e) => setAssailantNickname(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 border border-border p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <User className="h-4 w-4" />
              Physical Description
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="assailant-height" className="mb-2">
                  Height
                </Label>
                <Input
                  id="assailant-height"
                  placeholder="e.g., 5'10&quot; or 178cm"
                  value={assailantHeight}
                  onChange={(e) => setAssailantHeight(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="assailant-hair" className="mb-2">
                  Hair Color
                </Label>
                <Input
                  id="assailant-hair"
                  placeholder="e.g., Black, Brown"
                  value={assailantHairColor}
                  onChange={(e) => setAssailantHairColor(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="assailant-build" className="mb-2">
                  Build
                </Label>
                <Select
                  value={assailantBuild}
                  onValueChange={setAssailantBuild}
                >
                  <SelectTrigger id="assailant-build">
                    <SelectValue placeholder="Select build" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slim">Slim</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="athletic">Athletic</SelectItem>
                    <SelectItem value="heavyset">Heavyset</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assailant-clothing" className="mb-2">
                  Clothing Description
                </Label>
                <Input
                  id="assailant-clothing"
                  placeholder="What they were wearing"
                  value={assailantClothing}
                  onChange={(e) => setAssailantClothing(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="relationship" className="mb-2">
              Relationship to You
            </Label>
            <Select
              value={relationshipToVictim}
              onValueChange={setRelationshipToVictim}
            >
              <SelectTrigger id="relationship">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stranger">Stranger</SelectItem>
                <SelectItem value="acquaintance">Acquaintance</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="family">Family Member</SelectItem>
                <SelectItem value="partner">Partner / Ex-Partner</SelectItem>
                <SelectItem value="colleague">Colleague</SelectItem>
                <SelectItem value="neighbor">Neighbor</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="assailant-address" className="mb-2">
              Known Address
            </Label>
            <Input
              id="assailant-address"
              placeholder="If known"
              value={assailantAddress}
              onChange={(e) => setAssailantAddress(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="assailant-workplace" className="mb-2">
              Workplace
            </Label>
            <Input
              id="assailant-workplace"
              placeholder="Company or place of work"
              value={assailantWorkplace}
              onChange={(e) => setAssailantWorkplace(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="assailant-social" className="mb-2">
              Social Media Profiles
            </Label>
            <Textarea
              id="assailant-social"
              placeholder="Facebook, Instagram, Twitter handles or profile links"
              rows={2}
              value={assailantSocialMedia}
              onChange={(e) => setAssailantSocialMedia(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Witnesses */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Witnesses
            </h2>
            <span className="text-xs text-muted-foreground">(Optional)</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addWitness}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Witness
          </Button>
        </div>

        {witnesses.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">
              No witnesses added yet
            </p>
            <p className="text-xs text-muted-foreground">
              Click "Add Witness" to include witness information
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {witnesses.map((witness, index) => (
              <div
                key={witness.id}
                className="rounded-lg border border-border bg-muted/50 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Witness {index + 1}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWitness(witness.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label
                      className="mb-2"
                      htmlFor={`witness-name-${witness.id}`}
                    >
                      Full Name
                    </Label>
                    <Input
                      id={`witness-name-${witness.id}`}
                      placeholder="Witness full name"
                      value={witness.name}
                      onChange={(e) =>
                        updateWitness(witness.id, "name", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label
                        className="mb-2"
                        htmlFor={`witness-phone-${witness.id}`}
                      >
                        Contact Number
                      </Label>
                      <Input
                        id={`witness-phone-${witness.id}`}
                        type="tel"
                        placeholder="Phone number"
                        value={witness.contactNumber}
                        onChange={(e) =>
                          updateWitness(
                            witness.id,
                            "contactNumber",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label
                        className="mb-2"
                        htmlFor={`witness-email-${witness.id}`}
                      >
                        Email
                      </Label>
                      <Input
                        id={`witness-email-${witness.id}`}
                        type="email"
                        placeholder="Email address"
                        value={witness.email}
                        onChange={(e) =>
                          updateWitness(witness.id, "email", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      className="mb-2"
                      htmlFor={`witness-testimony-${witness.id}`}
                    >
                      What They Witnessed
                    </Label>
                    <Textarea
                      id={`witness-testimony-${witness.id}`}
                      placeholder="Brief description of what this witness saw or heard"
                      rows={3}
                      value={witness.whatTheyWitnessed}
                      onChange={(e) =>
                        updateWitness(
                          witness.id,
                          "whatTheyWitnessed",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30 hover:border-primary/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf"
              onChange={handleFileInput}
              className="hidden"
            />

            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">
              Drag & drop files here, or click to select
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Photos, videos, or documents (Max 10MB each)
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Files
            </Button>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Selected Files ({uploadedFiles.length}):
              </p>
              {uploadedFiles.map((uploadedFile, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3"
                >
                  {uploadedFile.preview ? (
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                  )}

                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <Label
                htmlFor="anonymous"
                className="cursor-pointer font-medium text-foreground"
              >
                I want to remain anonymous
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Your identity will not be shared with anyone. Victim information
                fields will be hidden.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <Label
                htmlFor="consent"
                className="cursor-pointer font-medium text-foreground"
              >
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
              <Shield className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-foreground mb-1">
                  Your Safety is Our Priority
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  All reports are encrypted end-to-end. We never share your
                  information without your explicit consent. Your data is stored
                  securely and handled by trained professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-destructive/20 bg-destructive/5 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                Error Submitting Report
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Submit Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={saveDraft}
          disabled={isSubmitting}
          className="sm:order-1"
        >
          Save Draft
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="sm:order-2"
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Submitting...
            </>
          ) : (
            "Submit Report Securely"
          )}
        </Button>
      </div>

      {/* Emergency Note */}
      <Card className="border-destructive/20 bg-destructive/5 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-foreground mb-1">
              In Immediate Danger?
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If you're in immediate danger, use the Quick SOS button in the
              bottom-right corner or call emergency services directly. This form
              is for reporting past incidents.
            </p>
          </div>
        </div>
      </Card>
    </form>
  );
}
