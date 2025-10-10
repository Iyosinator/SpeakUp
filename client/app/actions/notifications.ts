"use server";

import { supabase } from "@/lib/supabaseClient"; // FIXED: Use your existing import

export async function getNotifications(sessionId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  return data;
}

export async function markAsRead(notificationId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);

  if (error) {
    console.error("Error marking notification as read:", error);
  }
}

export async function markAllAsRead(sessionId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("session_id", sessionId)
    .eq("read", false);

  if (error) {
    console.error("Error marking all as read:", error);
  }
}

export async function getUnreadCount(sessionId: string) {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("session_id", sessionId)
    .eq("read", false);

  if (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }

  return count || 0;
}
