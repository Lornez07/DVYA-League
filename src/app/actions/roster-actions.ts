"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addPlayer(team_id: string, name: string, jersey_no: number, position: string, image_url?: string) {
  const { error } = await supabase.from("players").insert([{ 
    team_id, 
    name, 
    jersey_no, 
    position,
    image_url
  }]);
  
  if (error) return { success: false, error: error.message };
  
  revalidatePath(`/teams/${team_id}`);
  revalidatePath("/players");
  return { success: true };
}

export async function removePlayer(player_id: string, team_id: string) {
  const { error } = await supabase.from("players").delete().eq("id", player_id);
  if (error) return { success: false, error: error.message };
  
  revalidatePath(`/teams/${team_id}`);
  revalidatePath("/players");
  return { success: true };
}
