"use client";

import { CheckCircle, Clock, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: 1,
    type: "report",
    title: "Report #2847 Status Update",
    description:
      "Your report has been reviewed and forwarded to local authorities",
    time: "2 hours ago",
    status: "success",
    icon: CheckCircle,
  },
  {
    id: 2,
    type: "counselor",
    title: "Counselor Reply",
    description: "Dr. Sarah has responded to your message",
    time: "5 hours ago",
    status: "new",
    icon: MessageSquare,
  },
  {
    id: 3,
    type: "community",
    title: "Community Chat Notification",
    description: "3 new messages in 'Survivors Support Group'",
    time: "1 day ago",
    status: "pending",
    icon: MessageSquare,
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <div
                className={`rounded-full p-2 ${
                  activity.status === "success"
                    ? "bg-success/10"
                    : activity.status === "new"
                    ? "bg-primary/10"
                    : "bg-muted"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    activity.status === "success"
                      ? "text-success"
                      : activity.status === "new"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-foreground">
                    {activity.title}
                  </h4>
                  {activity.status === "new" && (
                    <Badge variant="default" className="ml-2">
                      New
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
