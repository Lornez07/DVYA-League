import { supabase } from "@/lib/supabase";
import { Users, Shield, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/home/AnimatedSection";

export const dynamic = 'force-dynamic';

export default async function PlayersPage() {
  const { data: players } = await supabase
    .from("players")
    .select("*, teams(name, divisions(name))")
    .order("name");

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-7xl font-athletic text-navy mb-2 tracking-tighter uppercase">PLAYER DIRECTORY</h1>
        <p className="text-gray-500 font-medium italic text-lg">Official registry of DVYA athletes.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!players || players.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium text-xl italic uppercase">No players found.</p>
            <Link href="/admin" className="text-gold font-bold text-sm mt-4 inline-block hover:underline uppercase tracking-widest">
              Add players in Admin Dashboard
            </Link>
          </div>
        ) : (
          players.map((player, index) => (
            <AnimatedSection 
              key={player.id} 
              delay={index * 0.03}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield className="w-12 h-12 text-navy" />
              </div>
              <div className="flex items-center gap-5">
                {/* Player Photo */}
                {player.image_url ? (
                  <img 
                    src={player.image_url} 
                    alt={player.name} 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-navy shadow-lg shadow-navy/20 group-hover:scale-110 transition-transform shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-navy text-gold rounded-2xl flex items-center justify-center font-athletic text-3xl shrink-0 shadow-lg shadow-navy/20 group-hover:scale-110 transition-transform">
                    {player.jersey_no}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-2xl font-athletic text-navy truncate group-hover:text-gold transition-colors">{player.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[10px] font-black text-white bg-navy px-2 py-0.5 rounded-full uppercase">
                      #{player.jersey_no}
                    </span>
                    {player.position && (
                      <span className="text-[10px] font-black text-navy bg-gold/20 px-2 py-0.5 rounded-full uppercase">
                        {player.position}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                      {(player.teams as any)?.name}
                    </span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <span className="text-[10px] font-bold text-gold uppercase tracking-widest shrink-0">
                      {((player.teams as any)?.divisions as any)?.name}
                    </span>
                  </div>
                </div>
              </div>
              <Link 
                href={`/teams/${player.team_id}`}
                className="mt-6 w-full py-2 bg-gray-50 text-navy text-[10px] font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-gold transition-colors uppercase tracking-widest"
              >
                VIEW TEAM <ArrowRight className="w-3 h-3" />
              </Link>
            </AnimatedSection>
          ))
        )}
      </div>
    </div>
  );
}
