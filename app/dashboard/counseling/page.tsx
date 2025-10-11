"use client";

import {
  Search,
  Phone,
  Mail,
  Clock,
  Shield,
  Heart,
  Filter,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/app/components/dashboard/dashboard-header";
import { QuickSosButton } from "@/app/components/dashboard/quick-sos-button";
import { supabase } from "../../../lib/supabaseClient";

interface Counselor {
  id: string;
  name: string;
  category: string;
  specialization: string;
  photo_url?: string;
  phone: string;
  email: string;
  languages: string[];
  available_timeframe: string;
}

const selfCareResources = [
  {
    title: "Breathing Exercises",
    description: "5-minute guided breathing for anxiety relief",
    duration: "5 min",
    icon: Heart,
  },
  {
    title: "Grounding Techniques",
    description: "Stay present during difficult moments",
    duration: "3 min",
    icon: Shield,
  },
  {
    title: "Sleep Hygiene Tips",
    description: "Improve your sleep quality and rest",
    duration: "8 min",
    icon: Clock,
  },
];

export default function CounselingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("counselors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching counselors:", error);
    } else {
      setCounselors(data as Counselor[]);
    }
    setIsLoading(false);
  };

  const filteredCounselors = counselors.filter((counselor) => {
    if (selectedCategory && counselor.category !== selectedCategory)
      return false;
    if (searchQuery) {
      return (
        counselor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        counselor.specialization
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        counselor.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const categories = Array.from(new Set(counselors.map((c) => c.category)));

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 overflow-auto">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Counseling Support
              </h1>
              <p className="text-base text-muted-foreground md:text-lg">
                Connect with legal advisors, psychiatric counselors, and
                financial experts
              </p>
            </div>

            {/* Categories */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardHeader>
                  <Shield className="h-8 w-8 text-blue-500" />
                  <CardTitle className="text-lg">Legal Counseling</CardTitle>
                  <CardDescription>
                    Get legal advice and support
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-purple-500/20 bg-purple-500/5">
                <CardHeader>
                  <Heart className="h-8 w-8 text-purple-500" />
                  <CardTitle className="text-lg">Psychiatric Support</CardTitle>
                  <CardDescription>Mental health professionals</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <Clock className="h-8 w-8 text-green-500" />
                  <CardTitle className="text-lg">Financial Help</CardTitle>
                  <CardDescription>
                    Financial guidance and planning
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Search & Filter */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search counselors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={
                          selectedCategory === null ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedCategory(null)}
                      >
                        All
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={
                            selectedCategory === category
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Counselors Directory */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground md:text-2xl">
                Available Counselors
              </h2>
              {isLoading ? (
                <div className="text-center py-12">Loading counselors...</div>
              ) : filteredCounselors.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No counselors found</p>
                </Card>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCounselors.map((counselor) => (
                    <Card
                      key={counselor.id}
                      className="transition-all hover:shadow-lg overflow-hidden"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            {counselor.photo_url ? (
                              <AvatarImage
                                src={counselor.photo_url}
                                alt={counselor.name}
                              />
                            ) : (
                              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                                {getInitials(counselor.name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {counselor.name}
                            </CardTitle>
                            <Badge className="mt-0">{counselor.category}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <hr/>
                      <CardContent className="space-y-">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Specialization
                          </p>
                          <p className="text-sm">{counselor.specialization}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Contact Information
                          </p>
                          <div className="space-y-2">
                            <a
                              href={`tel:${counselor.phone}`}
                              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                            >
                              <Phone className="h-4 w-4" />
                              <span>{counselor.phone}</span>
                            </a>
                            <a
                              href={`mailto:${counselor.email}`}
                              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                            >
                              <Mail className="h-4 w-4" />
                              <span className="truncate">
                                {counselor.email}
                              </span>
                            </a>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Languages Spoken
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {counselor.languages.map((lang, index) => (
                              <Badge key={index} variant="outline">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Available Timeframe
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">
                              {counselor.available_timeframe}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 space-y-2">
                          <Button className="w-full" asChild>
                            <a href={`tel:${counselor.phone}`}>
                              <Phone className="mr-2 h-4 w-4" />
                              Call Now
                            </a>
                          </Button>
                          <Button className="w-full" variant="outline" asChild>
                            <a href={`mailto:${counselor.email}`}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            
            
          </div>
        </main>
      </div>

      <QuickSosButton />
    </div>
  );
}
