"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// --- Teams ---
export async function updateTeam(id: string, data: { name: string; division_id: string; coach_name?: string; logo_url?: string }) {
  const { error } = await supabase
    .from("teams")
    .update({ name: data.name, division_id: data.division_id, coach_name: data.coach_name, logo_url: data.logo_url })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/teams");
  revalidatePath("/standings");
  return { success: true };
}

export async function deleteTeam(id: string) {
  const { error } = await supabase
    .from("teams")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/teams");
  revalidatePath("/standings");
  return { success: true };
}

// --- Players ---
export async function updatePlayer(id: string, data: { name: string; jersey_no: number; team_id: string; position?: string; image_url?: string }) {
  const { error } = await supabase
    .from("players")
    .update({ 
      name: data.name, 
      jersey_no: data.jersey_no, 
      position: data.position,
      image_url: data.image_url
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/players");
  revalidatePath(`/teams/${data.team_id}`);
  return { success: true };
}

export async function deletePlayer(id: string) {
  const { error } = await supabase
    .from("players")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/players");
  revalidatePath("/teams");
  return { success: true };
}

// --- Games ---
export async function updateGame(id: string, data: { 
  home_score: number; 
  away_score: number; 
  game_date: string;
  division_id: string;
  home_team_id: string;
  away_team_id: string;
}) {
  const { error } = await supabase
    .from("games")
    .update(data)
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/games");
  revalidatePath("/standings");
  revalidatePath("/");
  return { success: true };
}

export async function deleteGame(id: string) {
  const { error } = await supabase
    .from("games")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/games");
  revalidatePath("/standings");
  revalidatePath("/");
  return { success: true };
}
