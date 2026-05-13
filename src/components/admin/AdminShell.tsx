"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, ShieldCheck, Users, Trophy, Settings2, 
  ChevronRight, LogOut, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

import { TeamForm } from "./TeamForm";
import { RosterTool } from "./RosterTool";
import { GameResultForm } from "./GameResultForm";
import { LeagueManager } from "./LeagueManager";

interface Props {
  divisions: any[];
  teams: any[];
  players: any[];
  games: any[];
}

const navItems = [
  { id: "teams", label: "Register Team", icon: ShieldCheck, description: "Add new teams to divisions" },
  { id: "roster", label: "Manage Roster", icon: Users, description: "Add players to team rosters" },
  { id: "games", label: "Games & Scores", icon: Trophy, description: "Schedule games & record results" },
  { id: "manager", label: "League Manager", icon: Settings2, description: "Edit or delete any record" },
];

export function AdminShell({ divisions, teams, players, games }: Props) {
  const [activeSection, setActiveSection] = useState("teams");

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[70vh]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 shrink-0">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden sticky top-28">
          {/* Sidebar Header */}
          <div className="bg-navy p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-navy" />
              </div>
              <div>
                <h2 className="text-lg font-athletic text-gold uppercase">Admin Panel</h2>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">DVYA Management</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 border-b border-gray-100">
            <div className="p-4 text-center border-r border-gray-100">
              <p className="text-2xl font-athletic text-navy">{teams.length}</p>
              <p className="text-[8px] font-black text-gray-400 uppercase">Teams</p>
            </div>
            <div className="p-4 text-center border-r border-gray-100">
              <p className="text-2xl font-athletic text-navy">{players.length}</p>
              <p className="text-[8px] font-black text-gray-400 uppercase">Players</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl font-athletic text-navy">{games.length}</p>
              <p className="text-[8px] font-black text-gray-400 uppercase">Games</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all text-left group",
                  activeSection === item.id 
                    ? "bg-navy text-white shadow-lg shadow-navy/20" 
                    : "hover:bg-gray-50 text-gray-500"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  activeSection === item.id ? "bg-gold text-navy" : "bg-gray-100 text-gray-400 group-hover:bg-gold/20 group-hover:text-navy"
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn(
                    "font-bold text-sm uppercase tracking-wide truncate",
                    activeSection === item.id ? "text-gold" : "text-navy"
                  )}>
                    {item.label}
                  </p>
                  <p className={cn(
                    "text-[10px] truncate",
                    activeSection === item.id ? "text-white/50" : "text-gray-400"
                  )}>
                    {item.description}
                  </p>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 shrink-0 transition-transform",
                  activeSection === item.id ? "text-gold rotate-0" : "text-gray-300 -rotate-90"
                )} />
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-2">
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-navy/10 text-navy font-bold text-xs uppercase hover:bg-white transition-all"
            >
              <Activity className="w-4 h-4" /> Back to Site
            </Link>
            <button
              onClick={() => {
                // Clear any auth or redirect
                window.location.href = "/";
              }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 font-bold text-xs uppercase hover:bg-red-100 transition-all"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="space-y-8">
          {/* Section Header */}
          <div className="flex items-center gap-4">
            {(() => {
              const current = navItems.find(n => n.id === activeSection)!;
              return (
                <>
                  <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center shadow-lg shadow-navy/20">
                    <current.icon className="w-7 h-7 text-gold" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-athletic text-navy uppercase">{current.label}</h1>
                    <p className="text-sm text-gray-400 font-medium italic">{current.description}</p>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Active Tool */}
          {activeSection === "teams" && (
            <TeamForm divisions={divisions} />
          )}

          {activeSection === "roster" && (
            <RosterTool teams={teams} players={players} />
          )}

          {activeSection === "games" && (
            <GameResultForm divisions={divisions} teams={teams} />
          )}

          {activeSection === "manager" && (
            <LeagueManager 
              teams={teams} 
              players={players} 
              games={games} 
              divisions={divisions} 
            />
          )}
        </div>
      </main>
    </div>
  );
}
