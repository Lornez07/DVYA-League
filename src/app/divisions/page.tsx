import { Trophy, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/home/AnimatedSection";

const divisions = [
  { name: "14U", description: "Competitive youth basketball for ages 14 and under.", color: "bg-blue-600" },
  { name: "18U", description: "High-intensity league for teens and high school players.", color: "bg-red-600" },
  { name: "Junior", description: "Entry-level skills development for younger athletes.", color: "bg-green-600" },
  { name: "Senior", description: "Premier league for advanced and adult players.", color: "bg-navy" },
];

export default function DivisionsPage() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-7xl font-athletic text-navy mb-2 tracking-tighter uppercase">LEAGUE DIVISIONS</h1>
        <p className="text-gray-500 font-medium italic text-lg">Explore standings and teams across all age groups.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {divisions.map((div, index) => (
          <AnimatedSection 
            key={div.name} 
            delay={index * 0.1}
            className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group"
          >
            <div className={`w-16 h-16 ${div.color} rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-lg`}>
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-5xl font-athletic text-navy mb-4 group-hover:text-gold transition-colors">{div.name} DIVISION</h3>
            <p className="text-gray-500 font-medium mb-8 text-lg">{div.description}</p>
            <div className="flex gap-4">
              <Link 
                href={`/standings?division=${div.name}`}
                className="flex-1 py-4 bg-navy text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gold hover:text-navy transition-all uppercase tracking-widest text-sm"
              >
                VIEW STANDINGS <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href={`/teams`}
                className="px-6 py-4 border-2 border-gray-100 text-navy font-bold rounded-xl hover:border-gold hover:text-gold transition-all uppercase tracking-widest text-sm"
              >
                TEAMS
              </Link>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
