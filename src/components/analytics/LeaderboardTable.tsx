import React from 'react';
import { Crown, Medal, Trophy, User as UserIcon } from 'lucide-react';
import { LeaderboardUserDto } from '../../types';

interface LeaderboardTableProps {
  leaderboard: LeaderboardUserDto[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ leaderboard }) => {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-amber-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-slate-300" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-slate-500">#{rank}</span>;
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Global Leaderboard</h3>
        </div>
        <span className="text-xs text-slate-400">Top learners by total XP</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Level</th>
              <th className="py-3 px-4">Total XP</th>
              <th className="py-3 px-4 text-right">Problems Solved</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {leaderboard.map((user) => (
              <tr key={user.username} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1">{getRankBadge(user.rank)}</div>
                </td>
                <td className="py-3 px-4 font-semibold text-white">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <span>{user.username}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Lvl {user.currentLevel}
                  </span>
                </td>
                <td className="py-3 px-4 font-extrabold text-indigo-300">
                  {user.totalXp.toLocaleString()} XP
                </td>
                <td className="py-3 px-4 text-right font-bold text-emerald-400">
                  {user.problemsSolved}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
