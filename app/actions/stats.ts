"use server";

import { supabase } from "@/lib/supabaseClient";

export async function getImpactStats() {
  const { data, error } = await supabase
    .from("platform_stats")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching stats:", error);
    return null;
  }

  return data;
}
