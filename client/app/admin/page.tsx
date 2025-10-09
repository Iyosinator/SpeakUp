"use client";

import { useState, useEffect } from "react";
import {
  Check,
  X,
  Eye,
  Clock,
  AlertCircle,
  FileText,
  User,
  MapPin,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "../../lib/supabaseClient";

// Interfaces
interface Report {
  id: string;
  session_id: string;
  victim_full_name?: string;
  victim_phone?: string;
  victim_email?: string;
  victim_address?: string;
  incident_type: string;
  incident_date?: string;
  incident_time?: string;
  location?: string;
  description: string;
  assailant_info?: any;
  witnesses?: any[];
  is_anonymous: boolean;
  consent_to_share: boolean;
  evidence_urls?: string[];
  status: string;
  created_at: string;
  updated_at?: string;
}

interface Counselor {
  id?: string;
  name: string;
  category: string;
  specialization: string;
  photo_url?: string;
  phone: string;
  email: string;
  languages: string[];
  available_timeframe: string;
}

const emptyForm: Counselor = {
  name: "",
  category: "Legal",
  specialization: "",
  photo_url: "",
  phone: "",
  email: "",
  languages: [],
  available_timeframe: "",
};

export default function AdminDashboard() {
  // Reports State
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportTab, setReportTab] = useState("pending");

  // Counselors State
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [isCounselorModalOpen, setIsCounselorModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Counselor>(emptyForm);
  const [languagesInput, setLanguagesInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchCounselors();
  }, []);

  // Reports Functions
  const fetchReports = async () => {
    setReportsLoading(true);
    const { data, error } = await supabase
      .from("incident_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
    } else {
      setReports(data as Report[]);
    }
    setReportsLoading(false);
  };

  const updateReportStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("incident_reports")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } else {
      alert(`Report ${newStatus}!`);
      fetchReports();
      setIsReportModalOpen(false);
    }
  };

  // Counselors Functions
  const fetchCounselors = async () => {
    const { data, error } = await supabase
      .from("counselors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching counselors:", error);
    } else {
      setCounselors(data as Counselor[]);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async () => {
    if (!photoFile) return null;

    setUploadingPhoto(true);
    const fileExt = photoFile.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("counselor-photos")
      .upload(fileName, photoFile);

    if (uploadError) {
      console.error("Error uploading photo:", uploadError);
      alert("Failed to upload photo");
      setUploadingPhoto(false);
      return null;
    }

    const { data } = supabase.storage
      .from("counselor-photos")
      .getPublicUrl(fileName);

    setUploadingPhoto(false);
    return data.publicUrl;
  };

  const handleSubmitCounselor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let photoUrl = formData.photo_url;
    if (photoFile) {
      const uploadedUrl = await uploadPhoto();
      if (uploadedUrl) photoUrl = uploadedUrl;
    }

    const counselorData = {
      ...formData,
      photo_url: photoUrl,
      languages: languagesInput.split(",").map((lang) => lang.trim()),
    };

    if (isEditing && formData.id) {
      const { error } = await supabase
        .from("counselors")
        .update(counselorData)
        .eq("id", formData.id);

      if (error) {
        alert("Failed to update counselor");
      } else {
        alert("Counselor updated successfully!");
      }
    } else {
      const { error } = await supabase.from("counselors").insert(counselorData);

      if (error) {
        alert("Failed to add counselor");
      } else {
        alert("Counselor added successfully!");
      }
    }

    setIsLoading(false);
    setIsCounselorModalOpen(false);
    setFormData(emptyForm);
    setLanguagesInput("");
    setPhotoFile(null);
    setPhotoPreview("");
    fetchCounselors();
  };

  const handleEditCounselor = (counselor: Counselor) => {
    setFormData(counselor);
    setLanguagesInput(counselor.languages.join(", "));
    setPhotoPreview(counselor.photo_url || "");
    setIsEditing(true);
    setIsCounselorModalOpen(true);
  };

  const handleDeleteCounselor = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    const { error } = await supabase.from("counselors").delete().eq("id", id);

    if (error) {
      alert("Failed to delete counselor");
    } else {
      alert("Counselor deleted successfully!");
      fetchCounselors();
    }
  };

  // Utility Functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "under_review":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "approved":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-700 border-red-500/20";
      case "resolved":
        return "bg-gray-500/10 text-gray-700 border-gray-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReportId = (id: string) => {
    return `SR-${id.substring(0, 8).toUpperCase()}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const filteredReports = reports.filter((report) => {
    if (reportTab === "all") return true;
    return report.status === reportTab;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage reports and counselors</p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="reports">📋 Reports</TabsTrigger>
            <TabsTrigger value="counselors">👥 Counselors</TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Badge variant="outline" className="text-base px-4 py-2">
                  Total: {reports.length}
                </Badge>
                <Badge className="text-base px-4 py-2 bg-yellow-500">
                  Pending:{" "}
                  {reports.filter((r) => r.status === "pending").length}
                </Badge>
              </div>
            </div>

            <Tabs value={reportTab} onValueChange={setReportTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="under_review">Under Review</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>

              <TabsContent value={reportTab} className="space-y-4 mt-6">
                {reportsLoading ? (
                  <div className="text-center py-12">Loading...</div>
                ) : filteredReports.length === 0 ? (
                  <Card className="p-12 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No reports found</p>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredReports.map((report) => (
                      <Card key={report.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base font-mono">
                                  {getReportId(report.id)}
                                </CardTitle>
                                {report.is_anonymous && (
                                  <Badge variant="outline" className="text-xs">
                                    Anonymous
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(report.created_at)}
                              </p>
                            </div>
                            <Badge
                              className={`border ${getStatusColor(
                                report.status
                              )}`}
                            >
                              {report.status.replace("_", " ").toUpperCase()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">
                                Incident Type
                              </p>
                              <p className="font-medium capitalize">
                                {report.incident_type.replace("-", " ")}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Location</p>
                              <p className="font-medium">
                                {report.location || "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReport(report);
                                setIsReportModalOpen(true);
                              }}
                              className="flex-1"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                            {report.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateReportStatus(report.id, "approved")
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    updateReportStatus(report.id, "rejected")
                                  }
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Counselors Tab */}
          <TabsContent value="counselors" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Counselor Management</h2>
                <p className="text-muted-foreground">
                  Add and manage counselors
                </p>
              </div>
              <Button
                onClick={() => {
                  setFormData(emptyForm);
                  setLanguagesInput("");
                  setPhotoFile(null);
                  setPhotoPreview("");
                  setIsEditing(false);
                  setIsCounselorModalOpen(true);
                }}
                size="lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Counselor
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {counselors.map((counselor) => (
                <Card key={counselor.id}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        {counselor.photo_url ? (
                          <AvatarImage
                            src={counselor.photo_url}
                            alt={counselor.name}
                          />
                        ) : (
                          <AvatarFallback>
                            {getInitials(counselor.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {counselor.name}
                        </CardTitle>
                        <Badge className="mt-1">{counselor.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Specialization:</strong>{" "}
                        {counselor.specialization}
                      </p>
                      <p>
                        <strong>Email:</strong> {counselor.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {counselor.phone}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditCounselor(counselor)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCounselor(counselor.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Report Detail Modal - Keep your existing modal code */}
        <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Report Details -{" "}
                {selectedReport && getReportId(selectedReport.id)}
              </DialogTitle>
            </DialogHeader>
            {/* Add all your existing report detail content here */}
          </DialogContent>
        </Dialog>

        {/* Counselor Modal - Keep your existing modal code */}
        <Dialog
          open={isCounselorModalOpen}
          onOpenChange={setIsCounselorModalOpen}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Counselor" : "Add New Counselor"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitCounselor} className="space-y-4">
              {/* Add all your existing counselor form fields here */}

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    {photoPreview ? (
                      <AvatarImage src={photoPreview} />
                    ) : (
                      <AvatarFallback>
                        <ImageIcon className="h-8 w-8" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Name & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="Legal">Legal</option>
                    <option value="Psychiatric">Psychiatric</option>
                    <option value="Financial">Financial</option>
                  </select>
                </div>
              </div>

              {/* Specialization */}
              <div className="space-y-2">
                <Label>Specialization *</Label>
                <Input
                  required
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <Label>Languages (comma-separated) *</Label>
                <Input
                  required
                  placeholder="English, Spanish"
                  value={languagesInput}
                  onChange={(e) => setLanguagesInput(e.target.value)}
                />
              </div>

              {/* Available Timeframe */}
              <div className="space-y-2">
                <Label>Available Timeframe *</Label>
                <Input
                  required
                  placeholder="Mon-Fri 9AM-5PM"
                  value={formData.available_timeframe}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      available_timeframe: e.target.value,
                    })
                  }
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCounselorModalOpen(false)}
                  disabled={isLoading || uploadingPhoto}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || uploadingPhoto}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading || uploadingPhoto
                    ? "Saving..."
                    : isEditing
                    ? "Update"
                    : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
