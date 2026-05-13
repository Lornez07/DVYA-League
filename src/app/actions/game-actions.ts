"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const GameResultSchema = z.object({
  division_id: z.string().uuid(),
  home_team_id: z.string().uuid(),
  away_team_id: z.string().uuid(),
  home_score: z.number().min(0),
  away_score: z.number().min(0),
  game_date: z.string().datetime(),
});

export async function addGameResult(data: z.infer<typeof GameResultSchema>) {
  const validated = GameResultSchema.parse(data);

  if (validated.home_team_id === validated.away_team_id) {
    throw new Error("Home and Away teams must be different");
  }

  const { error } = await supabase.from("games").insert([validated]);

  if (error) {
    console.error("Supabase Error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/standings");
  revalidatePath("/");
  return { success: true };
}

export async function deleteGame(id: string) {
  const { error } = await supabase.from("games").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/standings");
  return { success: true };
}
