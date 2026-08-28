import React from 'react';
import { PracticeSessionDto } from '../../types';
import { History, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface PracticeHistoryTableProps {
  sessions: PracticeSessionDto[];
}

export const PracticeHistoryTable: React.FC<PracticeHistoryTableProps> = ({ sessions }) => {
  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 text-center text-slate-400 text-sm">
        No past practice sessions found. Start a practice session above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Recent Practice Sessions</h3>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Mode</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Solved</th>
              <th className="px-6 py-4">Accuracy</th>
              <th className="px-6 py-4">XP Earned</th>
              <th className="px-6 py-4">Started At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sessions.map((s) => {
              const formattedDate = new Date(s.startedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 border border-slate-700 text-indigo-300">
                      {s.mode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {s.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    ) : s.status === 'IN_PROGRESS' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                        <XCircle className="w-3.5 h-3.5 text-slate-400" />
                        {s.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {s.solvedProblems} / {s.totalProblems}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-200">
                    {s.accuracyPercentage}%
                  </td>
                  <td className="px-6 py-4 font-bold text-amber-400">
                    +{s.xpEarned} XP
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">{formattedDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
