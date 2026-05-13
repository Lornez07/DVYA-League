import { supabase } from "@/lib/supabase";
import { Shield, Users, Trophy, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/home/AnimatedSection";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function BoxScorePage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // Fetch Game Details
  const { data: game } = await supabase
    .from("games")
    .select("*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*), divisions(name)")
    .eq("id", id)
    .single();

  // Fetch Player Stats
  const { data: stats } = await supabase
    .from("player_game_stats")
    .select("*, players(*)")
    .eq("game_id", id);

  if (!game) return <div className="p-20 text-center">Game not found</div>;

  const homeStats = stats?.filter(s => s.players.team_id === game.home_team_id) || [];
  const awayStats = stats?.filter(s => s.players.team_id === game.away_team_id) || [];

  const StatTable = ({ title, teamStats, color }: any) => (
    <div className="space-y-6">
      <h3 className={cn("text-3xl font-athletic flex items-center gap-3 pb-2 border-b-2", color)}>
        {title}
      </h3>
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">PLAYER</th>
              <th className="px-6 py-4 text-center">PTS</th>
              <th className="px-6 py-4 text-center">REB</th>
              <th className="px-6 py-4 text-center">AST</th>
              <th className="px-6 py-4 text-center">STL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {teamStats.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic text-sm">
                  No stats recorded for this team.
                </td>
              </tr>
            ) : (
              teamStats.sort((a: any, b: any) => b.points - a.points).map((s: any) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <span className="w-8 h-8 bg-navy text-gold rounded-lg flex items-center justify-center font-athletic text-xs">
                      {s.players.jersey_no}
                    </span>
                    <span className="font-bold text-navy uppercase text-sm">{s.players.name}</span>
                  </td>
                  <td className="px-6 py-4 text-center font-athletic text-xl text-navy">{s.points}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-400 text-sm">{s.rebounds}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-400 text-sm">{s.assists}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-400 text-sm">{s.steals}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <Link href="/games" className="inline-flex items-center gap-2 text-navy/60 hover:text-navy font-bold uppercase tracking-widest text-xs transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Games
      </Link>

      {/* Header Result Card */}
      <AnimatedSection className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-gray-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6">
          <span className="bg-red-500 text-white font-black px-4 py-1 rounded italic text-sm shadow-lg shadow-red-200">FINAL BOX SCORE</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-12 relative z-10">
          <div className="text-center md:text-right space-y-4">
            <div className="w-20 h-20 bg-navy rounded-3xl flex items-center justify-center mx-auto md:ml-auto">
              <Shield className="w-10 h-10 text-gold" />
            </div>
            <h2 className="text-5xl font-athletic text-navy">{(game.home_team as any).name}</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Home Team</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-8">
              <span className="text-8xl font-athletic text-navy leading-none">{game.home_score}</span>
              <span className="text-4xl font-athletic text-gray-200">-</span>
              <span className="text-8xl font-athletic text-navy leading-none">{game.away_score}</span>
            </div>
            <div className="mt-6 inline-block px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
              <p className="text-[10px] font-black text-navy uppercase tracking-widest">
                {(game.divisions as any).name} • {new Date(game.game_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="text-center md:text-left space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto md:mr-auto">
              <Shield className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-5xl font-athletic text-navy">{(game.away_team as any).name}</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Away Team</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        <AnimatedSection delay={0.1}>
          <StatTable 
            title={(game.home_team as any).name} 
            teamStats={homeStats} 
            color="border-gold/20 text-navy"
          />
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <StatTable 
            title={(game.away_team as any).name} 
            teamStats={awayStats} 
            color="border-gray-200 text-gray-400"
          />
        </AnimatedSection>
      </div>
    </div>
  );
}
