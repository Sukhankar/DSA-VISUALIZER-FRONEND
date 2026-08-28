import React, { useState, useRef, useEffect } from 'react';
import { Bell, Trophy, Flame, Swords, Award, CheckCircle } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'achievement' | 'streak' | 'challenge' | 'badge';
  read: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Daily Challenge Ready! 🔥',
    message: 'Complete today\'s challenge to earn +50 Bonus XP and preserve your streak.',
    time: '10m ago',
    type: 'challenge',
    read: false,
  },
  {
    id: '2',
    title: 'Achievement Unlocked! 🏆',
    message: 'You earned the "Algorithm Explorer" achievement for completing 10 visualizer steps.',
    time: '2h ago',
    type: 'achievement',
    read: false,
  },
  {
    id: '3',
    title: 'Streak Milestone! ⚡',
    message: 'You reached a 12-day activity streak. Keep the momentum going!',
    time: '1d ago',
    type: 'streak',
    read: true,
  },
  {
    id: '4',
    title: 'New Badge Unlocked 🎖',
    message: 'You earned the "Sorting Master" badge.',
    time: '2d ago',
    type: 'badge',
    read: true,
  },
];

export const NotificationMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'streak':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'challenge':
        return <Swords className="w-4 h-4 text-emerald-400" />;
      case 'badge':
        return <Award className="w-4 h-4 text-cyan-400" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950 animate-pulse" />
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl border border-slate-800/90 bg-[#0B1020]/95 backdrop-blur-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-100">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 text-xs">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 flex items-start gap-3 hover:bg-slate-800/40 transition-colors ${
                  !item.read ? 'bg-indigo-950/20' : ''
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-slate-200 truncate">{item.title}</h5>
                    <span className="text-[10px] text-slate-500 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{item.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-slate-950/60 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">All notifications up to date</span>
          </div>
        </div>
      )}
    </div>
  );
};
