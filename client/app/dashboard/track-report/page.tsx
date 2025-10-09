"use client";

import { useState } from "react";
import {
  Search,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/app/components/dashboard/dashboard-header";
import { QuickSosButton } from "@/app/components/dashboard/quick-sos-button";
import { supabase } from "../../../lib/supabaseClient";

interface Report {
  id: string;
  incident_type: string;
  description: string;
  location?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export default function TrackReportPage() {
  const [reportId, setReportId] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportId.trim()) {
      setError("Please enter a Report ID");
      return;
    }

    // Extract just the ID part (remove "SR-" prefix if present)
    const cleanId = reportId.toUpperCase().replace("SR-", "").trim();

    console.log("Searching for ID:", cleanId); // Debug log

    setIsLoading(true);
    setError("");
    setReport(null);

    try {
      // Get all reports and filter in JavaScript (simpler approach)
      const { data: allReports, error: searchError } = await supabase
        .from("incident_reports")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("All reports:", allReports); // Debug log

      if (searchError) {
        console.error("Search error:", searchError);
        setError("Error searching for report. Please try again.");
        return;
      }

      // Find report where ID starts with the cleanId
      const foundReport = allReports?.find((r) =>
        r.id.toLowerCase().startsWith(cleanId.toLowerCase())
      );

      console.log("Found report:", foundReport); // Debug log

      if (!foundReport) {
        setError(
          "Report not found. Please check your Report ID and try again."
        );
      } else {
        setReport(foundReport as Report);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `SR-${report?.id.substring(0, 8).toUpperCase()}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "under_review":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "approved":
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
      case "closed":
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "under_review":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "approved":
      case "resolved":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-700 border-red-500/20";
      case "closed":
        return "bg-gray-500/10 text-gray-700 border-gray-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          title: "Your report has been received",
          description: "We will review it shortly and take appropriate action.",
        };
      case "under_review":
        return {
          title: "Your report is being reviewed",
          description: "Our team is currently investigating your case.",
        };
      case "approved":
        return {
          title: "Your report has been approved",
          description:
            "We're taking action on your case and connecting you with support.",
        };
      case "resolved":
        return {
          title: "Your report has been resolved",
          description: "Thank you for reporting. The case has been handled.",
        };
      case "rejected":
        return {
          title: "Your report could not be processed",
          description: "Please contact support for more information.",
        };
      case "closed":
        return {
          title: "Your report has been closed",
          description: "No further action is required at this time.",
        };
      default:
        return {
          title: "Report status",
          description: "Contact support for more information.",
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 overflow-auto">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Track Your Report
              </h1>
              <p className="text-muted-foreground">
                Enter your Report ID to check the status of your submission
              </p>
            </div>

            {/* Search Form */}
            <Card>
              <CardHeader>
                <CardTitle>Report ID Lookup</CardTitle>
                <CardDescription>
                  Enter the Report ID you received when submitting (e.g.,
                  SR-76B92D54)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Enter Report ID (e.g., SR-76B92D54)"
                        value={reportId}
                        onChange={(e) =>
                          setReportId(e.target.value.toUpperCase())
                        }
                        className="pl-10 uppercase font-mono"
                        maxLength={15}
                      />
                    </div>
                    <Button type="submit" disabled={isLoading} size="lg">
                      {isLoading ? "Searching..." : "Track Report"}
                    </Button>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </form>
              </CardContent>
            </Card>

            {/* Report Details */}
            {report && (
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Report Details
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className="font-mono font-semibold">
                          SR-{report.id.substring(0, 8).toUpperCase()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopy}
                          className="h-6 px-2"
                        >
                          {copied ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </CardDescription>
                    </div>
                    <Badge
                      className={`border ${getStatusColor(report.status)}`}
                    >
                      {report.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Status */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">
                      Current Status
                    </h3>
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      {getStatusIcon(report.status)}
                      <div className="flex-1">
                        <p className="font-medium">
                          {getStatusMessage(report.status).title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getStatusMessage(report.status).description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Report Information */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Incident Type
                      </p>
                      <p className="font-medium capitalize">
                        {report.incident_type.replace("-", " ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Submitted On
                      </p>
                      <p className="font-medium">
                        {formatDate(report.created_at)}
                      </p>
                    </div>
                    {report.location && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Location
                        </p>
                        <p className="font-medium">{report.location}</p>
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Description
                      </p>
                      <p className="text-sm leading-relaxed line-clamp-3">
                        {report.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">
                      Progress Timeline
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Report Submitted</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {report.status === "pending" ? (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-sm">Under Review</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {report.status === "approved" ||
                        report.status === "resolved" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : report.status === "rejected" ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-gray-300" />
                        )}
                        <span className="text-sm">
                          {report.status === "rejected"
                            ? "Rejected"
                            : "Approved/Resolved"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Help Section */}
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>Need help?</strong> If you have questions about
                      your report or need additional support, please use the SOS
                      button or visit our Community Support section.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Information Card */}
            {!report && !error && !isLoading && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    How to Track Your Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>
                    <strong>1.</strong> When you submit a report, you receive a
                    unique Report ID (e.g., SR-76B92D54)
                  </p>
                  <p>
                    <strong>2.</strong> Enter this ID in the search box above to
                    check your report status
                  </p>
                  <p>
                    <strong>3.</strong> Your report status will be one of the
                    following:
                  </p>
                  <ul className="ml-6 space-y-1 list-disc">
                    <li>
                      <strong>Pending:</strong> Report received, awaiting review
                    </li>
                    <li>
                      <strong>Under Review:</strong> Our team is investigating
                    </li>
                    <li>
                      <strong>Approved:</strong> Report approved, action being
                      taken
                    </li>
                    <li>
                      <strong>Resolved:</strong> Case has been handled
                    </li>
                    <li>
                      <strong>Rejected:</strong> Report could not be processed
                    </li>
                  </ul>
                  <p className="pt-2 text-xs text-muted-foreground">
                    💡 <strong>Tip:</strong> Save your Report ID in a secure
                    place for future reference
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      <QuickSosButton />
    </div>
  );
}
