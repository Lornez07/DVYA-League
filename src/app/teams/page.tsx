import { supabase } from "@/lib/supabase";
import { Users, Shield } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/home/AnimatedSection";

export const dynamic = 'force-dynamic';

export default async function TeamsPage() {
  const { data: teams } = await supabase.from("teams").select("*, divisions(name)");

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-7xl font-athletic text-navy mb-2 tracking-tighter uppercase">THE TEAMS</h1>
        <p className="text-gray-500 font-medium italic text-lg">Official league teams and their rosters.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!teams || teams.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-gray-100">
            <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium text-xl italic uppercase">No teams registered yet.</p>
            <p className="text-gray-300 text-sm mt-2 font-bold uppercase tracking-widest">Register teams in the admin dashboard</p>
          </div>
        ) : (
          teams.map((team, index) => (
            <AnimatedSection 
              key={team.id} 
              delay={index * 0.1}
              className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden"
            >
              {/* Logo Background Header */}
              {team.logo_url ? (
                <div className="relative h-40 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${team.logo_url})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="bg-navy text-white px-4 py-1 rounded-full font-athletic text-sm tracking-widest uppercase shadow-lg">
                      {(team.divisions as any)?.name}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative h-32 bg-navy overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Shield className="w-32 h-32" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-gold text-navy px-4 py-1 rounded-full font-athletic text-sm tracking-widest uppercase shadow-lg">
                      {(team.divisions as any)?.name}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-8 pt-4">
                <div className="flex items-center gap-4 mb-4">
                  {team.logo_url ? (
                    <img 
                      src={team.logo_url} 
                      alt={team.name} 
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-gray-100 shadow-lg -mt-10 group-hover:border-gold transition-colors"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center -mt-10 border-2 border-white shadow-lg group-hover:border-gold transition-colors">
                      <Shield className="w-7 h-7 text-gold" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-3xl font-athletic text-navy group-hover:text-gold transition-colors truncate">{team.name}</h3>
                    <p className="text-gray-400 font-medium text-sm truncate">Coach: {team.coach_name}</p>
                  </div>
                </div>
                <Link 
                  href={`/teams/${team.id}`}
                  className="w-full py-3 bg-gray-50 text-navy font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gold transition-colors text-sm uppercase tracking-widest"
                >
                  VIEW ROSTER
                </Link>
              </div>
            </AnimatedSection>
          ))
        )}
      </div>
    </div>
  );
}
