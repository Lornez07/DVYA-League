import { supabase } from "@/lib/supabase";
import { User, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AnimatedPlayerCard } from "@/components/roster/AnimatedPlayerCard";

export const dynamic = 'force-dynamic';

export default async function TeamRosterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: team } = await supabase
    .from("teams")
    .select("*, divisions(name)")
    .eq("id", id)
    .single();

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .eq("team_id", id)
    .order("jersey_no");

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link href="/standings" className="text-gold font-bold flex items-center gap-2 text-sm uppercase tracking-widest hover:text-navy transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Standings
          </Link>
          <h1 className="text-7xl font-athletic text-navy leading-none tracking-tight uppercase">
            {team?.name}
          </h1>
          <div className="flex items-center gap-4">
            <span className="bg-navy text-white px-4 py-1 rounded-full font-athletic text-xl tracking-wider">
              {(team?.divisions as any)?.name} DIVISION
            </span>
            <span className="text-gray-400 font-medium italic">Coach: {team?.coach_name}</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex items-center gap-4">
          <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-gold" />
          </div>
          <div>
            <p className="text-3xl font-athletic text-navy leading-none">{players?.length || 0}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Players</p>
          </div>
        </div>
      </header>

      <section>
        <h2 className="text-4xl font-athletic text-navy mb-8 flex items-center gap-4">
          OFFICIAL ROSTER
          <div className="h-1 flex-1 bg-gold/20 rounded-full"></div>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {players?.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-gray-100">
              <User className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-medium italic">No players registered for this roster yet.</p>
            </div>
          ) : (
            players?.map((player, index) => (
              <AnimatedPlayerCard key={player.id} player={player} index={index} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
