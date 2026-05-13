"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addTeam(division_id: string, name: string, coach_name: string, logo_url?: string) {
  const { error } = await supabase.from("teams").insert([{ division_id, name, coach_name, logo_url }]);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/teams");
  return { success: true };
}
