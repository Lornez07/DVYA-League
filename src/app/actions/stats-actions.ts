"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function saveBoxScore(gameId: string, stats: any[]) {
  // Upsert stats for all players in this game
  const { error } = await supabase
    .from("player_game_stats")
    .upsert(
      stats.map(s => ({
        game_id: gameId,
        player_id: s.player_id,
        points: s.points || 0,
        rebounds: s.rebounds || 0,
        assists: s.assists || 0,
        steals: s.steals || 0,
        blocks: s.blocks || 0,
      })),
      { onConflict: 'game_id,player_id' }
    );

  if (error) return { success: false, error: error.message };

  revalidatePath("/games");
  revalidatePath(`/games/${gameId}`);
  revalidatePath("/players");
  return { success: true };
}
