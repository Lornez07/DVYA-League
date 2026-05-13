"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  standings: any[];
  divisions: any[];
  recentGames: any[];
  initialDivision?: string;
}

export function StandingsTable({ standings, divisions, recentGames, initialDivision }: Props) {
  // Find division ID if name was passed as initialDivision
  const defaultDiv = divisions.find(d => d.name.toLowerCase() === initialDivision?.toLowerCase())?.id || divisions[0]?.id || "";
  const [activeDivision, setActiveDivision] = useState(defaultDiv);

  const divisionStandings = standings.filter(s => s.division_id === activeDivision);

  const getForm = (teamId: string) => {
    const games = recentGames
      .filter(g => g.home_team_id === teamId || g.away_team_id === teamId)
      .slice(0, 3);

    return games.map(g => {
      const isHome = g.home_team_id === teamId;
      const teamScore = isHome ? g.home_score : g.away_score;
      const oppScore = isHome ? g.away_score : g.home_score;
      
      if (teamScore > oppScore) return "W";
      if (teamScore < oppScore) return "L";
      return "D";
    });
  };

  return (
    <div className="space-y-8">
      {/* Horizontal Pill Menu */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {divisions.map((div) => (
          <button
            key={div.id}
            onClick={() => setActiveDivision(div.id)}
            className={cn(
              "relative px-8 py-3 rounded-full font-athletic text-2xl transition-all whitespace-nowrap",
              activeDivision === div.id 
                ? "text-navy" 
                : "text-gray-400 hover:text-navy/60"
            )}
          >
            {activeDivision === div.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-gold rounded-full -z-10 shadow-lg shadow-gold/20"
                transition={{ type: "spring", duration: 0.6 }}
              />
            )}
            {div.name}
          </button>
        ))}
      </div>

      {/* Standings Table */}
      <motion.div
        key={activeDivision}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-navy text-white font-athletic text-xl tracking-wider">
              <tr>
                <th className="px-6 py-5">TEAM</th>
                <th className="px-6 py-5 text-center">GP</th>
                <th className="px-6 py-5 text-center">W-L</th>
                <th className="px-6 py-5 text-center">PF-PA</th>
                <th className="px-6 py-5 text-center">FORM</th>
                <th className="px-6 py-5 text-right">WIN %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {divisionStandings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400 italic">
                    No games recorded in this division yet.
                  </td>
                </tr>
              ) : (
                divisionStandings.map((row, index) => {
                  const form = getForm(row.team_id);
                  return (
                    <motion.tr 
                      key={row.team_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-6 flex items-center gap-4">
                        <span className="text-gray-200 font-athletic text-3xl w-8">{index + 1}</span>
                        <Link href={`/teams/${row.team_id}`} className="group/name">
                          <p className="font-bold text-navy uppercase tracking-tight group-hover/name:text-gold transition-colors">{row.team_name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">View Roster</p>
                        </Link>
                      </td>
                      <td className="px-6 py-6 text-center font-bold text-gray-600">{row.gp}</td>
                      <td className="px-6 py-6 text-center font-bold text-navy">
                        {row.w}-{row.l}
                      </td>
                      <td className="px-6 py-6 text-center font-medium text-gray-400">
                        {row.pf}-{row.pa}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex justify-center gap-1.5">
                          {form.length === 0 ? <span className="text-gray-200">-</span> : form.map((res, i) => (
                            <div 
                              key={i}
                              className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
                                res === "W" ? "bg-green-500 shadow-sm shadow-green-200" : 
                                res === "L" ? "bg-red-500 shadow-sm shadow-red-200" : "bg-gray-400"
                              )}
                            >
                              {res}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <span className="font-athletic text-3xl text-navy">
                          {(row.win_pct * 100).toFixed(1)}%
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
