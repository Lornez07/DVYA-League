import { supabase } from "@/lib/supabase";
import { StandingsTable } from "@/components/standings/StandingsTable";

export const dynamic = 'force-dynamic';

export default async function StandingsPage({ searchParams }: { searchParams: { division?: string } }) {
  const { division: initialDivision } = await searchParams;
  const { data: standings } = await supabase.from("team_standings").select("*");
  const { data: divisions } = await supabase.from("divisions").select("*").order("name");
  const { data: recentGames } = await supabase
    .from("games")
    .select("*")
    .order("game_date", { ascending: false });

  return (
    <div className="space-y-12">
      <header className="text-center md:text-left">
        <h1 className="text-7xl font-athletic text-navy mb-2 leading-none tracking-tight">LEADERBOARD</h1>
        <p className="text-gray-500 font-medium italic text-lg">Live performance metrics and division rankings.</p>
      </header>

      <StandingsTable 
        standings={standings || []} 
        divisions={divisions || []} 
        recentGames={recentGames || []}
        initialDivision={initialDivision}
      />
    </div>
  );
}
