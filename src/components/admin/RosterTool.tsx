"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { addPlayer, removePlayer } from "@/app/actions/roster-actions";
import { UserPlus, Trash2, User, Image as ImageIcon } from "lucide-react";

interface Props {
  teams: any[];
  players: any[];
}

export function RosterTool({ teams, players }: Props) {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [newName, setNewName] = useState("");
  const [newJersey, setNewJersey] = useState("");
  const [newPosition, setNewPosition] = useState("G");
  const [newImage, setNewImage] = useState("");
  const [loading, setLoading] = useState(false);

  const teamPlayers = players.filter(p => p.team_id === selectedTeam);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !newName || !newJersey) return;
    
    setLoading(true);
    const result = await addPlayer(selectedTeam, newName, parseInt(newJersey), newPosition, newImage);
    if (result.success) {
      toast.success("Player Added", { style: { background: "#000080", color: "#FFD700" } });
      setNewName("");
      setNewJersey("");
      setNewImage("");
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const result = await removePlayer(id, selectedTeam);
    if (result.success) {
      toast.info("Player Removed", { icon: <Trash2 className="w-4 h-4" /> });
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8">
      <div>
        <label className="block text-sm font-bold text-navy uppercase tracking-widest mb-2">Select Team</label>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="w-full px-6 py-4 rounded-xl border-2 border-gray-50 focus:border-gold outline-none transition-all font-bold text-navy"
        >
          <option value="">Choose a Team</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {selectedTeam && (
        <>
          <form onSubmit={handleAdd} className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Full Name</label>
                <input
                  placeholder="Player Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl border-2 border-white outline-none focus:border-gold font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Jersey #</label>
                <input
                  placeholder="Jersey #"
                  type="number"
                  value={newJersey}
                  onChange={(e) => setNewJersey(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl border-2 border-white outline-none focus:border-gold font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Position</label>
                <select
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl border-2 border-white outline-none focus:border-gold font-bold"
                >
                  <option value="PG">Point Guard (PG)</option>
                  <option value="SG">Shooting Guard (SG)</option>
                  <option value="SF">Small Forward (SF)</option>
                  <option value="PF">Power Forward (PF)</option>
                  <option value="C">Center (C)</option>
                  <option value="G">Guard (G)</option>
                  <option value="F">Forward (F)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Photo URL (Optional)</label>
                <input
                  placeholder="https://..."
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl border-2 border-white outline-none focus:border-gold font-bold"
                />
              </div>
            </div>
            <button
              disabled={loading}
              className="w-full bg-navy text-gold font-athletic text-2xl py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gold hover:text-navy transition-all shadow-lg"
            >
              <UserPlus className="w-6 h-6" /> ADD PLAYER TO ROSTER
            </button>
          </form>

          <div className="space-y-4">
            <h4 className="text-navy font-athletic text-2xl border-b-2 border-gold/20 pb-2">CURRENT ROSTER</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teamPlayers.length === 0 ? (
                <p className="text-gray-400 italic col-span-2">No players found for this team.</p>
              ) : (
                teamPlayers.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 group hover:border-gold/30 transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-full object-cover border-2 border-navy" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-navy font-athletic text-lg">#{p.jersey_no}</span>
                          <span className="font-bold text-navy uppercase text-sm">{p.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-gold bg-navy/5 px-2 py-0.5 rounded uppercase">{p.position}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="p-2 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
