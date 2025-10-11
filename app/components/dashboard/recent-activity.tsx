"use client";

import {
  CheckCircle,
  Clock,
  MessageSquare,
  Heart,
  FileText,
  CheckCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { markAsRead, markAllAsRead } from "@/app/actions/notifications";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  link: string | null;
  read: boolean;
  created_at: string;
  metadata: any;
}

interface RecentActivityProps {
  sessionId: string;
  initialNotifications: Notification[] | null; // FIXED: Allow null
}

const getIcon = (type: string) => {
  switch (type) {
    case "like":
      return Heart;
    case "comment":
      return MessageSquare;
    case "report_status":
      return FileText;
    default:
      return CheckCircle;
  }
};

const getStatusColor = (type: string, read: boolean) => {
  if (read) {
    return {
      bg: "bg-muted",
      text: "text-muted-foreground",
    };
  }

  switch (type) {
    case "like":
      return { bg: "bg-pink-500/10", text: "text-pink-500" };
    case "comment":
      return { bg: "bg-blue-500/10", text: "text-blue-500" };
    case "report_status":
      return { bg: "bg-success/10", text: "text-success" };
    default:
      return { bg: "bg-primary/10", text: "text-primary" };
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

export function RecentActivity({
  sessionId,
  initialNotifications,
}: RecentActivityProps) {
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications || [] // FIXED: Handle undefined/null
  );
  const [unreadCount, setUnreadCount] = useState(
    initialNotifications?.filter((n) => !n.read).length || 0 // FIXED: Optional chaining + fallback
  );

  useEffect(() => {
    if (!sessionId) return;

    // Subscribe to new notifications
    const channel = supabase
      .channel("notifications_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          console.log("New notification:", payload);
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const updatedNotification = payload.new as Notification;
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === updatedNotification.id ? updatedNotification : n
            )
          );
          setUnreadCount((prev) => prev - (updatedNotification.read ? 1 : 0));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead(sessionId);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="font-heading">Recent Activity</CardTitle>
            {unreadCount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            const colors = getStatusColor(notification.type, notification.read);

            return (
              <div
                key={notification.id}
                className={`flex items-start gap-4 rounded-lg border p-4 transition-all hover:shadow-md cursor-pointer ${
                  !notification.read
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
                onClick={() =>
                  !notification.read && handleMarkAsRead(notification.id)
                }
              >
                <div className={`rounded-full p-2 ${colors.bg}`}>
                  <Icon className={`h-5 w-5 ${colors.text}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-foreground">
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <Badge variant="default" className="ml-2 text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(notification.created_at)}
                    </div>
                    {notification.link && (
                      <Link href={notification.link}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7"
                        >
                          View
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
