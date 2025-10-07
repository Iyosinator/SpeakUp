"use client";

import { TrendingUp, Users, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    icon: Users,
    label: "Women Supported",
    value: "2,847",
    trend: "+12%",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: FileText,
    label: "Reports Filed",
    value: "1,234",
    trend: "+8%",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: TrendingUp,
    label: "Cases Resolved",
    value: "892",
    trend: "+15%",
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

export function AwarenessSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Impact Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-lg border border-border p-4"
            >
              <div className={`rounded-full ${stat.bgColor} p-3`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-heading text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <span className="text-xs font-medium text-success">
                    {stat.trend}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="mt-6 rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Did you know?</span>{" "}
            63% of harassment cases go unreported. Your voice matters and can
            help create change.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
