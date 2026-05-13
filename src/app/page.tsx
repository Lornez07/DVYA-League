import { Trophy, Users, Calendar, ArrowRight, Star, Crown, User } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { AnimatedSection } from "@/components/home/AnimatedSection";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: latestGames } = await supabase
    .from("games")
    .select("*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)")
    .order("game_date", { ascending: false })
    .limit(1);

  const featuredGame = latestGames?.[0];

  // Fetch League Leaders (Top Scorers)
  const { data: leaderStats } = await supabase
    .from("player_game_stats")
    .select("player_id, points, players(name, jersey_no, position, image_url, teams(name))");

  // Aggregate total points per player
  const playerTotals: Record<string, any> = {};
  leaderStats?.forEach((s: any) => {
    const pid = s.player_id;
    if (!playerTotals[pid]) {
      playerTotals[pid] = {
        player_id: pid,
        name: s.players.name,
        jersey_no: s.players.jersey_no,
        position: s.players.position,
        image_url: s.players.image_url,
        team_name: s.players.teams?.name,
        total_points: 0,
        games_played: 0,
      };
    }
    playerTotals[pid].total_points += s.points;
    playerTotals[pid].games_played += 1;
  });

  const leagueLeaders = Object.values(playerTotals)
    .sort((a: any, b: any) => b.total_points - a.total_points)
    .slice(0, 5);

  const divisions = [
    { name: "14U Division", icon: Trophy, color: "bg-blue-600" },
    { name: "18U Division", icon: Trophy, color: "bg-red-600" },
    { name: "Junior Division", icon: Users, color: "bg-green-600" },
    { name: "Senior Division", icon: Trophy, color: "bg-navy" },
  ];

  return (
    <div className="space-y-12">
      {/* Featured Game Hero */}
      {featuredGame && (
        <AnimatedSection className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-gold text-navy font-athletic px-4 py-1 rounded-full text-sm flex items-center gap-2">
              <Star className="w-4 h-4 fill-navy" /> FEATURED RESULT
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
            <div className="text-center space-y-2">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Home</p>
              <h3 className="text-4xl font-athletic text-navy">{(featuredGame.home_team as any)?.name}</h3>
            </div>
            <div className="text-center py-4 px-8 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-xs font-bold text-red-500 uppercase tracking-tighter mb-2 block">FINAL</span>
              <div className="flex items-center justify-center gap-6">
                <span className="text-6xl font-athletic text-navy">{featuredGame.home_score}</span>
                <span className="text-2xl font-athletic text-gray-300">-</span>
                <span className="text-6xl font-athletic text-navy">{featuredGame.away_score}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                {new Date(featuredGame.game_date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Away</p>
              <h3 className="text-4xl font-athletic text-navy">{(featuredGame.away_team as any)?.name}</h3>
            </div>
          </div>
        </AnimatedSection>
      )}

      <AnimatedSection 
        delay={0.2}
        className="relative overflow-hidden rounded-[2.5rem] bg-navy p-8 md:p-20 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-gold opacity-10 blur-3xl"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-6xl md:text-8xl font-athletic text-gold mb-4 leading-none tracking-tight">
            THE LEAGUE <br />
            IS HERE.
          </h1>
          <p className="text-xl text-gray-300 font-medium mb-8 max-w-md">
            DVYA Basketball League - Where legends are born and teamwork defines excellence.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/games" className="px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-white transition-colors flex items-center gap-2">
              VIEW SCHEDULE <Calendar className="w-5 h-5" />
            </Link>
            <Link href="/teams" className="px-8 py-4 border-2 border-white/20 hover:border-gold hover:text-gold font-bold rounded-xl transition-all">
              BROWSE TEAMS
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* League Leaders */}
      {leagueLeaders.length > 0 && (
        <section>
          <h2 className="text-4xl font-athletic text-navy mb-8 flex items-center gap-4">
            <Crown className="w-8 h-8 text-gold" />
            LEAGUE LEADERS
            <div className="h-1 flex-1 bg-gold/20 rounded-full"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {leagueLeaders.map((leader: any, index: number) => (
              <AnimatedSection 
                key={leader.player_id} 
                delay={index * 0.1}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group relative"
              >
                {index === 0 && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-yellow-400 to-gold"></div>
                )}
                <div className="p-6 text-center space-y-4">
                  <div className="relative inline-block">
                    {leader.image_url ? (
                      <img 
                        src={leader.image_url} 
                        alt={leader.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 group-hover:border-gold transition-colors mx-auto"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-navy text-gold flex items-center justify-center font-athletic text-3xl mx-auto border-4 border-gray-100 group-hover:border-gold transition-colors">
                        {leader.jersey_no}
                      </div>
                    )}
                    <span className="absolute -top-1 -right-1 w-8 h-8 bg-navy text-gold rounded-full flex items-center justify-center font-athletic text-sm border-2 border-white shadow-lg">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-athletic text-navy uppercase truncate">{leader.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{leader.team_name}</p>
                    {leader.position && (
                      <span className="inline-block mt-1 text-[9px] font-black text-gold bg-navy/5 px-2 py-0.5 rounded-full uppercase">{leader.position}</span>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-3xl font-athletic text-navy">{leader.total_points}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Points</p>
                  </div>
                  <p className="text-[10px] text-gray-300 font-bold">{leader.games_played} GP · {(leader.total_points / leader.games_played).toFixed(1)} PPG</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-4xl font-athletic text-navy mb-8 flex items-center gap-4">
          EXPLORE DIVISIONS
          <div className="h-1 flex-1 bg-gold/20 rounded-full"></div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {divisions.map((div) => (
            <Link 
              key={div.name} 
              href={`/standings?division=${div.name.split(' ')[0]}`}
              className="group p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${div.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                <div.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-athletic text-navy mb-2 group-hover:text-gold transition-colors">{div.name}</h3>
              <p className="text-sm text-gray-500 font-medium mb-4">View standings, teams, and game results for this division.</p>
              <span className="text-gold font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
                Explore <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-athletic text-navy">LATEST GAMES</h2>
          <Link href="/games" className="text-navy/60 hover:text-navy font-bold text-sm uppercase tracking-widest flex items-center gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
          <p className="text-gray-400 font-medium italic">No recent games found. Season starting soon!</p>
        </div>
      </section>
    </div>
  );
}
