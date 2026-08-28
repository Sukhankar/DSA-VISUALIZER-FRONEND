import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationMenu } from './NotificationMenu';
import { GlobalSearch } from './GlobalSearch';
import {
  Code2,
  LogIn,
  UserPlus,
  Menu,
  X,
  Search,
  User as UserIcon,
  LogOut,
} from 'lucide-react';

// All primary nav items shown in the screenshot
const NAV_ITEMS = [
  { label: 'Home',           path: '/',             authRequired: false },
  { label: 'Algorithms',     path: '/algorithms',   authRequired: false },
  { label: 'Problems',       path: '/problems',     authRequired: false },
  { label: 'Roadmap',        path: '/roadmap',      authRequired: true  },
  { label: 'Practice Arena', path: '/practice',     authRequired: true  },
  { label: 'Achievements',   path: '/achievements', authRequired: true  },
  { label: 'Badges',         path: '/badges',       authRequired: true  },
  { label: 'Dashboard',      path: '/dashboard',    authRequired: true  },
  { label: 'Favorites',      path: '/favorites',    authRequired: true  },
];

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((p) => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.authRequired || isAuthenticated
  );

  return (
    <>
      {/* ═══ Main navbar ═══ */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070B16]/95 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[52px] gap-3">

            {/* ── Brand / Logo ── */}
            <Link to="/" className="flex items-center gap-2 group shrink-0 mr-2">
              <div className="p-1.5 bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 rounded-lg border border-indigo-500/30 group-hover:border-indigo-400/60 transition-all">
                <Code2 className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-slate-100 text-sm tracking-tight flex items-center gap-1">
                  CodeLoom
                  <span className="text-indigo-400 text-[9px] px-1 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 font-mono">
                    DSA
                  </span>
                </span>
                <span className="text-[8px] text-slate-500 tracking-widest font-mono">VISUALIZER</span>
              </div>
            </Link>

            {/* ── Primary Nav (desktop) — text-only, underline active ── */}
            <div className="hidden lg:flex items-center gap-1 flex-1 min-w-0">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative whitespace-nowrap text-[13px] font-medium px-2.5 py-1 rounded transition-colors
                    ${isActive(item.path)
                      ? 'text-slate-100'
                      : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                  {item.label}
                  {/* Underline indicator */}
                  {isActive(item.path) && (
                    <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-indigo-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* ── Right side ── */}
            <div className="flex items-center gap-2 ml-auto shrink-0">

              {/* Search button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-all"
              >
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline text-slate-500">Search algorithms, problems...</span>
                <kbd className="hidden md:inline-block text-[10px] font-mono text-slate-600 bg-slate-950/80 border border-slate-800 rounded px-1.5 py-0.5">
                  ⌘K
                </kbd>
              </button>

              {/* Notification bell */}
              {isAuthenticated && <NotificationMenu />}

              {/* Profile dropdown OR auth buttons */}
              {isAuthenticated ? (
                <ProfileDropdown />
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" leftIcon={<LogIn className="w-3.5 h-3.5" />}>
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-3.5 h-3.5" />}>
                      Register
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800/60"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 px-4 pt-3 pb-5 bg-[#070B16] space-y-2">
            <button
              onClick={() => { setMobileMenuOpen(false); setIsSearchOpen(true); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs"
            >
              <Search className="w-4 h-4 text-indigo-400" />
              <span>Search algorithms, problems...</span>
            </button>

            <div className="space-y-0.5 pt-1">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors
                    ${isActive(item.path)
                      ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-900 rounded-xl">
                    <UserIcon className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-slate-200">{user?.username}</span>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-slate-900"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" fullWidth>Sign In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" fullWidth>Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Global search modal */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
