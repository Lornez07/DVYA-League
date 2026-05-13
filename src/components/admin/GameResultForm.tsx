"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { addGameResult } from "@/app/actions/game-actions";
import { Trophy, Calendar, Hash, Clock, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  division_id: z.string().uuid("Please select a division"),
  home_team_id: z.string().uuid("Please select a home team"),
  away_team_id: z.string().uuid("Please select an away team"),
  home_score: z.number().min(0, "Score cannot be negative"),
  away_score: z.number().min(0, "Score cannot be negative"),
  game_date: z.string().min(1, "Please select a date"),
  is_final: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  divisions: any[];
  teams: any[];
}

export function GameResultForm({ divisions, teams }: Props) {
  const [loading, setLoading] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      home_score: 0,
      away_score: 0,
      is_final: true,
    }
  });

  const selectedDivision = watch("division_id");
  const filteredTeams = teams.filter(t => t.division_id === selectedDivision);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // If scheduled, ensure scores are 0 (or we could handle this in the action)
      const submissionData = {
        ...data,
        home_score: isScheduled ? 0 : data.home_score,
        away_score: isScheduled ? 0 : data.away_score,
        game_date: new Date(data.game_date).toISOString(),
      };

      const result = await addGameResult(submissionData);

      if (result.success) {
        toast.success(isScheduled ? "Match Scheduled!" : "Game Result Saved!", {
          style: { background: "#FFD700", color: "#000080", fontWeight: "bold" },
        });
        reset();
        setIsScheduled(false);
      } else {
        toast.error(result.error || "Failed to save game");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
      {/* Mode Selector */}
      <div className="flex p-1 bg-gray-50 rounded-2xl">
        <button
          type="button"
          onClick={() => setIsScheduled(false)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
            !isScheduled ? "bg-navy text-white shadow-lg" : "text-gray-400 hover:text-navy"
          )}
        >
          <Trophy className="w-4 h-4" /> Record Result
        </button>
        <button
          type="button"
          onClick={() => setIsScheduled(true)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
            isScheduled ? "bg-gold text-navy shadow-lg" : "text-gray-400 hover:text-navy"
          )}
        >
          <Clock className="w-4 h-4" /> Schedule Match
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Division Selection */}
        <div className="col-span-full">
          <label className="block text-sm font-bold text-navy uppercase tracking-widest mb-2">Division</label>
          <div className="relative">
            <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              {...register("division_id")}
              className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-gray-50 focus:border-gold outline-none transition-all font-bold text-navy appearance-none"
            >
              <option value="">Select Division</option>
              {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          {errors.division_id && <p className="text-red-500 text-xs mt-1 font-bold">{errors.division_id.message}</p>}
        </div>

        {/* Home Team */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-navy uppercase tracking-widest">Home Team</label>
          <select
            {...register("home_team_id")}
            className="w-full px-6 py-4 rounded-xl border-2 border-gray-50 focus:border-gold outline-none transition-all font-bold text-navy"
          >
            <option value="">Select Home Team</option>
            {filteredTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          {!isScheduled && (
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                {...register("home_score", { valueAsNumber: true })}
                placeholder="Home Score"
                className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-gray-50 focus:border-gold outline-none transition-all font-bold text-navy"
              />
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-navy uppercase tracking-widest">Away Team</label>
          <select
            {...register("away_team_id")}
            className="w-full px-6 py-4 rounded-xl border-2 border-gray-50 focus:border-gold outline-none transition-all font-bold text-navy"
          >
            <option value="">Select Away Team</option>
            {filteredTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          {!isScheduled && (
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                {...register("away_score", { valueAsNumber: true })}
                placeholder="Away Score"
                className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-gray-50 focus:border-gold outline-none transition-all font-bold text-navy"
              />
            </div>
          )}
        </div>

        {/* Game Date */}
        <div className="col-span-full">
          <label className="block text-sm font-bold text-navy uppercase tracking-widest mb-2">
            {isScheduled ? "Match Date & Time" : "Game Date"}
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="datetime-local"
              {...register("game_date")}
              className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-gray-50 focus:border-gold outline-none transition-all font-bold text-navy"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "w-full py-6 font-athletic text-3xl rounded-2xl transition-all shadow-xl disabled:opacity-50",
          isScheduled ? "bg-gold text-navy hover:bg-navy hover:text-gold" : "bg-navy text-gold hover:bg-gold hover:text-navy"
        )}
      >
        {loading ? "SAVING..." : isScheduled ? "SCHEDULE MATCH" : "PUBLISH RESULT"}
      </button>
    </form>
  );
}
