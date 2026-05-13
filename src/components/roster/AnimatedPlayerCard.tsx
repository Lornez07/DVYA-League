"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export const AnimatedPlayerCard = ({ player, index }: { player: any, index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
    className="group relative rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden h-72"
  >
    {/* Background Image */}
    {player.image_url ? (
      <>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${player.image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
      </>
    ) : (
      <>
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <User className="w-40 h-40" />
        </div>
        <div className="absolute -right-4 -bottom-4 text-white/5 font-athletic text-[12rem] leading-none pointer-events-none">
          {player.jersey_no}
        </div>
      </>
    )}

    {/* Content Overlay */}
    <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-3xl font-athletic text-white mb-1 group-hover:text-gold transition-colors truncate drop-shadow-lg">
            {player.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {player.position && (
              <span className="text-[10px] font-black text-navy bg-gold px-2 py-0.5 rounded-full uppercase shadow-lg">
                {player.position}
              </span>
            )}
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
              #{player.jersey_no}
            </span>
          </div>
        </div>
        <div className="w-14 h-14 bg-gold text-navy rounded-2xl flex items-center justify-center font-athletic text-3xl shrink-0 shadow-xl group-hover:scale-110 transition-transform">
          {player.jersey_no}
        </div>
      </div>
    </div>
  </motion.div>
);
