"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { addTeam } from "@/app/actions/team-actions";
import { ShieldPlus, User, Trophy, Image as ImageIcon } from "lucide-react";

interface Props {
  divisions: any[];
}

export function TeamForm({ divisions }: Props) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [coach, setCoach] = useState("");
  const [division, setDivision] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !division) return;

    setLoading(true);
    const result = await addTeam(division, name, coach, logoUrl);
    if (result.success) {
      toast.success("Team Registered!", { style: { background: "#000080", color: "#FFD700" } });
      setName("");
      setCoach("");
      setLogoUrl("");
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-navy uppercase tracking-widest mb-2">Division</label>
          <select
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            className="w-full px-6 py-4 rounded-xl border-2 border-gray-50 focus:border-gold outline-none transition-all font-bold text-navy"
          >
            <option value="">Select Division</option>
            {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-navy uppercase tracking-widest mb-2">Team Name</label>
            <div className="relative">
              <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                placeholder="e.g. Warriors"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-gray-50 outline-none focus:border-gold font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-navy uppercase tracking-widest mb-2">Coach Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                placeholder="e.g. Coach Phil"
                value={coach}
                onChange={(e) => setCoach(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-gray-50 outline-none focus:border-gold font-bold"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-navy uppercase tracking-widest mb-2">Team Logo URL (Optional)</label>
          <div className="flex gap-4 items-center">
            {logoUrl && (
              <img src={logoUrl} alt="Logo preview" className="w-14 h-14 rounded-xl object-cover border-2 border-gold shrink-0" />
            )}
            <div className="relative flex-1">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                placeholder="https://example.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-gray-50 outline-none focus:border-gold font-bold"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gold text-navy font-athletic text-2xl rounded-xl flex items-center justify-center gap-2 hover:bg-navy hover:text-gold transition-all shadow-lg"
      >
        <ShieldPlus className="w-6 h-6" /> REGISTER TEAM
      </button>
    </form>
  );
}
