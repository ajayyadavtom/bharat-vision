"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Crown, ArrowLeft, Star, Leaf, ShieldAlert, Gift, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// ABSOLUTE ALIAS PATHS
import { useAppStore } from "@/lib/store";

interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardScreen() {
  const { userName, karmaPoints } = useAppStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    // Generate a dynamic mock leaderboard injected with the current user's live data
    const mockData: LeaderboardUser[] = [
      { rank: 1, name: "Aditi S.", points: 2450 },
      { rank: 2, name: "Rahul K.", points: 2120 },
      { rank: 3, name: "Priya V.", points: 1890 },
      { rank: 4, name: "Karthik N.", points: 1540 },
    ];

    // Insert current user into the ranking logic
    const currentUser = { rank: 0, name: userName || "You", points: karmaPoints, isCurrentUser: true };
    
    const combined = [...mockData, currentUser].sort((a, b) => b.points - a.points);
    
    // Recalculate ranks after sorting
    const ranked = combined.map((user, index) => ({ ...user, rank: index + 1 }));
    setLeaderboard(ranked);
  }, [userName, karmaPoints]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown size={20} className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />;
      case 2: return <Medal size={20} className="text-gray-300 drop-shadow-[0_0_10px_rgba(209,213,219,0.8)]" />;
      case 3: return <Medal size={20} className="text-amber-700 drop-shadow-[0_0_10px_rgba(180,83,9,0.8)]" />;
      default: return <span className="font-bold text-gray-500 w-5 text-center">{rank}</span>;
    }
  };

  const calculateLevel = (points: number) => {
    if (points >= 2000) return { tier: "Platinum", color: "text-indigo-400", border: "border-indigo-500/50", bg: "bg-indigo-900/20" };
    if (points >= 1000) return { tier: "Gold", color: "text-amber-400", border: "border-amber-500/50", bg: "bg-amber-900/20" };
    if (points >= 500) return { tier: "Silver", color: "text-gray-300", border: "border-gray-400/50", bg: "bg-gray-800/40" };
    return { tier: "Bronze", color: "text-amber-700", border: "border-amber-900/50", bg: "bg-amber-950/30" };
  };

  const userLevel = calculateLevel(karmaPoints);

  return (
    <div className="flex flex-col min-h-screen h-full overflow-y-auto no-scrollbar pb-[120px] bg-surface-black px-4 pt-8 [&>*]:shrink-0">
      
      {/* Navigation Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile" className="p-2 bg-surface-dark border border-brand-dark rounded-full hover:bg-brand-dark transition-colors">
          <ArrowLeft size={20} className="text-white" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-white">Civic Leaderboard</h2>
          <p className="text-xs text-gray-400">Namma Bengaluru Commuter Ranks</p>
        </div>
      </div>

      {/* Current User Status Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-6 rounded-3xl border shadow-xl mb-8 relative overflow-hidden ${userLevel.bg} ${userLevel.border}`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-300 font-bold mb-1 flex items-center gap-1">
              <Star size={12} className={userLevel.color} /> Current Status
            </p>
            <h3 className="text-3xl font-black text-white">{karmaPoints} <span className="text-sm font-semibold text-gray-400">pts</span></h3>
            <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${userLevel.color} ${userLevel.border}`}>
              {userLevel.tier} Commuter
            </span>
          </div>
          
          <div className="w-16 h-16 bg-surface-black rounded-2xl border border-white/10 flex items-center justify-center shadow-inner">
            <Trophy size={32} className={userLevel.color} />
          </div>
        </div>
      </motion.div>

      {/* Top 5 Leaderboard List */}
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Top Commuters This Week</h3>
      <div className="bg-surface-dark border border-brand-dark rounded-3xl p-2 mb-8 shadow-lg flex flex-col gap-1">
        {leaderboard.slice(0, 5).map((user, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
              user.isCurrentUser ? "bg-brand-base/20 border border-brand-base shadow-md" : "bg-transparent border border-transparent"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 flex justify-center">
                {getRankIcon(user.rank)}
              </div>
              <div>
                <p className={`text-sm font-bold ${user.isCurrentUser ? "text-brand-accent" : "text-white"}`}>
                  {user.name} {user.isCurrentUser && "(You)"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-gray-200">{user.points} pts</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ways to Earn & Redeem */}
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Earn & Redeem</h3>
      <div className="grid grid-cols-2 gap-3">
        
        <div className="bg-surface-dark border border-brand-dark p-4 rounded-2xl flex flex-col gap-2">
          <div className="bg-emerald-900/30 w-8 h-8 rounded-lg flex items-center justify-center mb-1">
            <Leaf size={16} className="text-emerald-400" />
          </div>
          <h4 className="text-xs font-bold text-white">Green Transit</h4>
          <p className="text-[10px] text-gray-400 leading-tight">Earn +5 pts for choosing multi-modal routes over private cabs.</p>
        </div>

        <div className="bg-surface-dark border border-brand-dark p-4 rounded-2xl flex flex-col gap-2">
          <div className="bg-red-900/30 w-8 h-8 rounded-lg flex items-center justify-center mb-1">
            <ShieldAlert size={16} className="text-red-400" />
          </div>
          <h4 className="text-xs font-bold text-white">SafeKeep Intel</h4>
          <p className="text-[10px] text-gray-400 leading-tight">Earn +15 pts for reporting accurate hazards and crowd surges.</p>
        </div>

      </div>

      <button className="w-full mt-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold py-4 rounded-2xl text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
        <Gift size={18} />
        <span>Redeem 500 Pts for 1-Day Pass</span>
      </button>

    </div>
  );
}