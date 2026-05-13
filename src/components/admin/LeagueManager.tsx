"use client";

import React, { useState } from "react";
import { Trash2, Edit2, Check, X, Search, Trophy, Users, Calendar, ClipboardList } from "lucide-react";
import { deleteTeam, updateTeam, deletePlayer, updatePlayer, deleteGame, updateGame } from "@/app/actions/management-actions";
import { BoxScoreTool } from "./BoxScoreTool";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  teams: any[];
  players: any[];
  games: any[];
  divisions: any[];
}

export function LeagueManager({ teams, players, games, divisions }: Props) {
  const [activeTab, setActiveTab] = useState<"teams" | "players" | "games">("teams");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [selectedGameForStats, setSelectedGameForStats] = useState<any>(null);

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const handleSave = async () => {
    let res;
    if (activeTab === "teams") res = await updateTeam(editingId!, editData);
    else if (activeTab === "players") res = await updatePlayer(editingId!, editData);
    else if (activeTab === "games") res = await updateGame(editingId!, editData);

    if (res?.success) {
      toast.success("Updated successfully!");
      setEditingId(null);
    } else {
      toast.error(res?.error || "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    
    let res;
    if (activeTab === "teams") res = await deleteTeam(id);
    else if (activeTab === "players") res = await deletePlayer(id);
    else if (activeTab === "games") res = await deleteGame(id);

    if (res?.success) toast.success("Deleted successfully!");
    else toast.error(res?.error || "Delete failed");
  };

  const filteredItems = (activeTab === "teams" ? teams : activeTab === "players" ? players : games)
    .filter(item => {
      const name = item.name || `${item.home_team?.name} vs ${item.away_team?.name}`;
      return name.toLowerCase().includes(search.toLowerCase());
    });

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      {/* Box Score Overlay */}
      {selectedGameForStats && (
        <BoxScoreTool 
          game={selectedGameForStats} 
          onClose={() => setSelectedGameForStats(null)} 
        />
      )}

      <div className="flex border-b border-gray-100">
        {[
          { id: "teams", icon: Users, label: "Teams" },
          { id: "players", icon: Trophy, label: "Players" },
          { id: "games", icon: Calendar, label: "Games" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setEditingId(null); }}
            className={cn(
              "flex-1 py-6 flex items-center justify-center gap-2 font-athletic text-2xl transition-all",
              activeTab === tab.id ? "bg-navy text-gold" : "text-gray-400 hover:bg-gray-50"
            )}
          >
            <tab.icon className="w-5 h-5" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 bg-gray-50 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-3 rounded-xl border border-gray-200 outline-none focus:border-gold transition-all"
          />
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">DETAILS</th>
              <th className="px-6 py-4">INFO</th>
              <th className="px-6 py-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={item.name ? editData.name : ""}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span className="font-bold text-navy">
                      {item.name || `${item.home_team?.name} vs ${item.away_team?.name}`}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {activeTab === "games" ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        disabled={editingId !== item.id}
                        value={editingId === item.id ? editData.home_score : item.home_score}
                        onChange={(e) => setEditData({...editData, home_score: parseInt(e.target.value) || 0})}
                        className="w-12 text-center border rounded"
                      />
                      <span>-</span>
                      <input 
                        type="number" 
                        disabled={editingId !== item.id}
                        value={editingId === item.id ? editData.away_score : item.away_score}
                        onChange={(e) => setEditData({...editData, away_score: parseInt(e.target.value) || 0})}
                        className="w-12 text-center border rounded"
                      />
                    </div>
                  ) : activeTab === "players" ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        disabled={editingId !== item.id}
                        value={editingId === item.id ? editData.position : item.position}
                        onChange={(e) => setEditData({...editData, position: e.target.value})}
                        className="w-12 text-center border rounded text-[10px] font-bold"
                        placeholder="POS"
                      />
                      <input
                        type="text"
                        disabled={editingId !== item.id}
                        value={editingId === item.id ? editData.image_url : ""}
                        onChange={(e) => setEditData({...editData, image_url: e.target.value})}
                        className={cn(
                          "flex-1 border rounded text-[10px] px-2 py-1",
                          editingId !== item.id && "hidden"
                        )}
                        placeholder="Image URL"
                      />
                      {editingId !== item.id && (
                        <span className="text-xs text-gray-400 font-bold uppercase">{item.position}</span>
                      )}
                    </div>
                  ) : activeTab === "teams" ? (
                    <div className="flex items-center gap-2">
                      {editingId === item.id ? (
                        <input
                          type="text"
                          value={editData.logo_url || ""}
                          onChange={(e) => setEditData({...editData, logo_url: e.target.value})}
                          className="flex-1 border rounded text-[10px] px-2 py-1"
                          placeholder="Logo URL"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          {item.logo_url && (
                            <img src={item.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover border border-gray-200" />
                          )}
                          <span className="text-xs text-gray-400 font-bold uppercase">{item.divisions?.name}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 font-bold uppercase">
                      {item.divisions?.name}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {activeTab === "games" && (
                      <button 
                        onClick={() => setSelectedGameForStats(item)}
                        className="p-2 text-gold bg-navy rounded-lg hover:bg-gold hover:text-navy transition-all"
                        title="Enter Box Score"
                      >
                        <ClipboardList className="w-4 h-4" />
                      </button>
                    )}
                    {editingId === item.id ? (
                      <>
                        <button onClick={handleSave} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 bg-gray-400 text-white rounded-lg">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(item)} className="p-2 text-navy hover:bg-navy/5 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 hover:border-red-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
