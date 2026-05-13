"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Calendar, User, Trophy, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Divisions", href: "/divisions", icon: Trophy },
  { name: "Teams", href: "/teams", icon: Users },
  { name: "Games", href: "/games", icon: Calendar },
  { name: "Players", href: "/players", icon: User },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-navy border-r border-gold/20 text-white z-50">
        <div className="p-6">
          <h1 className="text-3xl font-athletic text-gold tracking-wider">DVYA LEAGUE</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-gold text-navy shadow-lg" 
                    : "hover:bg-gold/10 text-gray-300 hover:text-gold"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-navy" : "group-hover:text-gold")} />
                <span className="font-semibold uppercase tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-gold/10 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-medium italic">Phase 1 Initialized</p>
          <Link href="/admin" className="text-gray-600 hover:text-gold transition-colors p-1">
            <Lock className="w-3 h-3" />
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-navy border-t border-gold/20 flex items-center justify-around px-2 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all",
                isActive ? "text-gold" : "text-gray-400 hover:text-gold/80"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold tracking-tighter">{item.name}</span>
            </Link>
          );
        })}
        {/* Subtle Admin Link on Mobile */}
        <Link href="/admin" className="flex flex-col items-center justify-center gap-1 text-gray-700">
          <Lock className="w-4 h-4" />
          <span className="text-[8px] uppercase font-bold tracking-tighter">Admin</span>
        </Link>
      </nav>
    </>
  );
}
