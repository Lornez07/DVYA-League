import { supabase } from "@/lib/supabase";
import { Calendar, Trophy, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/home/AnimatedSection";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function GamesPage() {
  const { data: games } = await supabase
    .from("games")
    .select("*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name), divisions(name)")
    .order("game_date", { ascending: true });

  const now = new Date();
  const upcomingGames = games?.filter(g => new Date(g.game_date) > now) || [];
  const pastGames = games?.filter(g => new Date(g.game_date) <= now).reverse() || [];

  return (
    <div className="space-y-16">
      <header>
        <h1 className="text-7xl font-athletic text-navy mb-2 tracking-tighter uppercase">GAME CENTER</h1>
        <p className="text-gray-500 font-medium italic text-lg">Official results and upcoming matchups.</p>
      </header>

      {/* Upcoming Section */}
      <section className="space-y-8">
        <h2 className="text-4xl font-athletic text-navy flex items-center gap-4">
          UPCOMING MATCHUPS
          <div className="h-1 flex-1 bg-gold/20 rounded-full"></div>
        </h2>
        {upcomingGames.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <Clock className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium italic">No matches scheduled for the coming week.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingGames.map((game, index) => (
              <AnimatedSection 
                key={game.id} 
                delay={index * 0.1}
                className="bg-white p-8 rounded-[2rem] border-2 border-gold/10 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-gold/10 text-gold px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {(game.divisions as any)?.name}
                  </span>
                  <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-tighter">
                    <Calendar className="w-3 h-3" />
                    {new Date(game.game_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 text-center">
                    <h4 className="text-2xl font-athletic text-navy">{(game.home_team as any)?.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Home</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-navy text-gold flex items-center justify-center font-athletic text-xl shadow-lg">VS</div>
                  <div className="flex-1 text-center">
                    <h4 className="text-2xl font-athletic text-navy">{(game.away_team as any)?.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Away</p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-navy font-bold text-xs">
                    <Clock className="w-4 h-4 text-gold" />
                    {new Date(game.game_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-2 text-navy font-bold text-xs">
                    <MapPin className="w-4 h-4 text-gold" />
                    DVYA MAIN COURT
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </section>

      {/* Past Results Section */}
      <section className="space-y-8">
        <h2 className="text-4xl font-athletic text-navy flex items-center gap-4">
          RECENT RESULTS
          <div className="h-1 flex-1 bg-navy/10 rounded-full"></div>
        </h2>
        <div className="space-y-4">
          {pastGames.length === 0 ? (
            <p className="text-gray-400 italic">No past results recorded yet.</p>
          ) : (
            pastGames.map((game, index) => (
              <Link 
                key={game.id} 
                href={`/games/${game.id}`}
                className="block group"
              >
                <AnimatedSection 
                  delay={index * 0.05}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-8 group-hover:border-gold group-hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className="hidden md:block w-16 text-center">
                      <p className="text-xs font-black text-gray-300 uppercase leading-none">{(game.divisions as any)?.name}</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-8">
                      <div className="text-right flex-1">
                        <span className={cn("text-xl font-athletic", game.home_score > game.away_score ? "text-navy" : "text-gray-400")}>
                          {(game.home_team as any)?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 bg-gray-50 px-6 py-2 rounded-xl border border-gray-100 group-hover:bg-navy group-hover:text-white transition-colors">
                        <span className="text-3xl font-athletic">{game.home_score}</span>
                        <span className="text-gray-300 font-athletic">-</span>
                        <span className="text-3xl font-athletic">{game.away_score}</span>
                      </div>
                      <div className="text-left flex-1">
                        <span className={cn("text-xl font-athletic", game.away_score > game.home_score ? "text-navy" : "text-gray-400")}>
                          {(game.away_team as any)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col items-end">
                    <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded italic mb-1">FINAL</span>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter group-hover:text-gold transition-colors">
                      View Box Score →
                    </p>
                  </div>
                </AnimatedSection>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
