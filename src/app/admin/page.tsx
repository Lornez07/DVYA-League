import { supabase } from "@/lib/supabase";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const { data: divisions } = await supabase.from("divisions").select("*").order("name");
  
  const { data: teamsFull } = await supabase
    .from("teams")
    .select("*, divisions(name)")
    .order("name");

  const { data: playersFull } = await supabase
    .from("players")
    .select("*, teams(name, divisions(name))")
    .order("name");

  const { data: gamesFull } = await supabase
    .from("games")
    .select("*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name), divisions(name)")
    .order("game_date", { ascending: false });

  return (
    <div className="pb-20">
      <AdminShell
        divisions={divisions || []}
        teams={teamsFull || []}
        players={playersFull || []}
        games={gamesFull || []}
      />
    </div>
  );
}
