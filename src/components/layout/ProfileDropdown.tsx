import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../api/profileService';
import { UserProfileDto } from '../../types';
import {
  User as UserIcon,
  ChevronDown,
  Trophy,
  Award,
  LayoutDashboard,
  Map,
  Star,
  Settings,
  Target,
  HelpCircle,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

export const ProfileDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  useEffect(() => {
    let isMounted = true;
    profileService.getProfile().then((d) => { if (isMounted) setProfile(d); }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Close on outside click / Escape
  useEffect(() => {
    if (!isOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const handleLogout = () => { setIsOpen(false); logout(); navigate('/'); };

  const displayName  = profile?.displayName || user?.username || 'User';
  const level        = profile?.levelProgress?.currentLevel  ?? profile?.currentLevel ?? 1;
  const currentXp    = profile?.levelProgress?.currentXp     ?? profile?.totalXp      ?? 0;
  const nextLevelXp  = profile?.levelProgress?.xpRequiredForNextLevel ?? (level * 500);
  const xpProgress   = Math.min(100, Math.max(0,
    profile?.levelProgress?.progressPercentage ?? Math.round((currentXp / nextLevelXp) * 100)
  ));

  const menuLink = (
    to: string,
    icon: React.ReactNode,
    label: string,
    hoverClass = 'hover:bg-slate-800/60 hover:text-slate-100',
  ) => (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className={`flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-300 transition-colors ${hoverClass} rounded`}
    >
      <span className="shrink-0 opacity-70">{icon}</span>
      {label}
    </Link>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Trigger ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 transition-all focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-sm shrink-0">
          <UserIcon className="w-3.5 h-3.5" />
        </div>
        {/* Name + level */}
        <div className="hidden sm:flex flex-col leading-none text-left">
          <span className="text-[13px] font-semibold text-slate-100">{displayName}</span>
          <span className="text-[11px] text-slate-400">Level {level} ●</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ── Panel ── */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 rounded-xl shadow-2xl border border-slate-700/80 bg-[#0f1729] backdrop-blur-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 pt-4 pb-3 bg-[#111a2e] border-b border-slate-700/60">
            {/* Avatar + name */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shrink-0">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-100">{displayName}</div>
                <div className="text-xs text-slate-400">Algorithms Explorer</div>
              </div>
            </div>

            {/* Level row */}
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300">Level {level}</span>
              <span className="font-mono text-slate-400 text-[11px]">{currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</span>
            </div>
            {/* XP bar */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>

          {/* Nav items */}
          <div className="py-1.5 text-xs">
            {menuLink('/profile',      <UserIcon className="w-4 h-4" />,         'Profile')}
            {menuLink('/achievements', <Trophy className="w-4 h-4 text-amber-400" />,  'Achievements')}
            {menuLink('/badges',       <Award className="w-4 h-4 text-cyan-400" />,   'Badges')}
            {menuLink('/dashboard',    <LayoutDashboard className="w-4 h-4 text-purple-400" />, 'Dashboard')}
            {menuLink('/roadmap',      <Map className="w-4 h-4 text-indigo-400" />,    'Roadmap')}
            {menuLink('/favorites',    <Star className="w-4 h-4 text-amber-400" />,    'Favorites')}

            <div className="my-1 border-t border-slate-700/60" />

            {menuLink('/profile',    <Settings className="w-4 h-4" />,    'Settings')}
            {menuLink('/assessment', <Target className="w-4 h-4 text-emerald-400" />,  'Learning Preferences')}
            {menuLink('/algorithms', <HelpCircle className="w-4 h-4" />,  'Help & Support')}

            {isAdmin && (
              <>
                <div className="my-1 border-t border-slate-700/60" />
                {menuLink('/admin', <ShieldCheck className="w-4 h-4 text-rose-400" />, 'Admin Panel', 'hover:bg-rose-500/10 hover:text-rose-300')}
              </>
            )}

            <div className="my-1 border-t border-slate-700/60" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-rose-400 hover:bg-rose-500/10 transition-colors rounded"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
