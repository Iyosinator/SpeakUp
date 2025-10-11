"use client";

import { FileText, Users, MessageCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "File a Report",
    description: "Submit anonymous reports safely and securely",
    href: "/dashboard/report",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with survivor groups and chatrooms",
    href: "/dashboard/community",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: MessageCircle,
    title: "Counseling Support",
    description: "Access AI and human counselors anytime",
    href: "/dashboard/counseling",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: BookOpen,
    title: "Resources Hub",
    description: "Find shelters, hotlines, NGOs, and legal aid",
    href: "/dashboard/resources",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

export function FeatureCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <Link key={feature.title} href={feature.href}>
            <Card className="group h-full transition-all hover:scale-105 hover:shadow-lg">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div
                  className={`mb-4 rounded-full ${feature.bgColor} p-4 transition-transform group-hover:scale-110`}
                >
                  <Icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
