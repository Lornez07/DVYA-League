"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { saveBoxScore } from "@/app/actions/stats-actions";
import { toast } from "sonner";
import { Check, X, Shield, Users, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  game: any;
  onClose: () => void;
}

export function BoxScoreTool({ game, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    async function loadData() {
      // Load all players for both teams
      const { data: teamPlayers } = await supabase
        .from("players")
        .select("*")
        .in("team_id", [game.home_team_id, game.away_team_id]);

      // Load existing stats if any
      const { data: existingStats } = await supabase
        .from("player_game_stats")
        .select("*")
        .eq("game_id", game.id);

      const initialStats: any = {};
      teamPlayers?.forEach(p => {
        const existing = existingStats?.find(s => s.player_id === p.id);
        initialStats[p.id] = existing || {
          player_id: p.id,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0
        };
      });

      setPlayers(teamPlayers || []);
      setStats(initialStats);
      setLoading(false);
    }
    loadData();
  }, [game]);

  const handleStatChange = (playerId: string, field: string, value: number) => {
    setStats({
      ...stats,
      [playerId]: { ...stats[playerId], [field]: value }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await saveBoxScore(game.id, Object.values(stats));
    if (res.success) {
      toast.success("Box Score Saved!");
      onClose();
    } else {
      toast.error(res.error || "Failed to save stats");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-navy font-bold">LOADING ROSTERS...</div>;

  const homePlayers = players.filter(p => p.team_id === game.home_team_id);
  const awayPlayers = players.filter(p => p.team_id === game.away_team_id);

  const StatInput = ({ playerId, field, label }: any) => (
    <div className="flex flex-col gap-1">
      <span className="text-[8px] font-black text-gray-400 uppercase text-center">{label}</span>
      <input
        type="number"
        value={stats[playerId][field]}
        onChange={(e) => handleStatChange(playerId, field, parseInt(e.target.value) || 0)}
        className="w-10 h-8 text-center border rounded-lg text-xs font-bold text-navy focus:border-gold outline-none"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-navy/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
        <header className="p-8 bg-navy text-white flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-athletic text-gold">BOX SCORE ENTRY</h2>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
              {game.home_team?.name} vs {game.away_team?.name}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-8 h-8" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Home Team */}
            <div className="space-y-6">
              <h3 className="text-2xl font-athletic text-navy flex items-center gap-3 pb-2 border-b-2 border-gold/20">
                <Shield className="w-6 h-6 text-gold" />
                {game.home_team?.name}
              </h3>
              <div className="space-y-3">
                {homePlayers.map(player => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-navy text-gold rounded-lg flex items-center justify-center font-athletic text-sm">
                        {player.jersey_no}
                      </span>
                      <span className="font-bold text-navy text-sm uppercase">{player.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <StatInput playerId={player.id} field="points" label="PTS" />
                      <StatInput playerId={player.id} field="rebounds" label="REB" />
                      <StatInput playerId={player.id} field="assists" label="AST" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Away Team */}
            <div className="space-y-6">
              <h3 className="text-2xl font-athletic text-navy flex items-center gap-3 pb-2 border-b-2 border-gray-100 text-right justify-end">
                {game.away_team?.name}
                <Shield className="w-6 h-6 text-gray-300" />
              </h3>
              <div className="space-y-3">
                {awayPlayers.map(player => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center font-athletic text-sm">
                        {player.jersey_no}
                      </span>
                      <span className="font-bold text-navy text-sm uppercase">{player.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <StatInput playerId={player.id} field="points" label="PTS" />
                      <StatInput playerId={player.id} field="rebounds" label="REB" />
                      <StatInput playerId={player.id} field="assists" label="AST" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <footer className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 border-2 border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-white transition-all uppercase tracking-widest text-sm"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-4 bg-navy text-gold font-athletic text-2xl rounded-2xl hover:bg-gold hover:text-navy transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {saving ? "SAVING..." : <><Check className="w-6 h-6" /> SAVE BOX SCORE</>}
          </button>
        </footer>
      </div>
    </div>
  );
}
