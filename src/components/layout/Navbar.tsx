import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import {
  Code2,
  LayoutDashboard,
  ShieldCheck,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Star,
  Terminal,
  Trophy,
  Swords
} from 'lucide-react';


export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-indigo-600/20 rounded-xl border border-indigo-500/30 group-hover:border-indigo-400/50 transition-colors">
              <Code2 className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-100 tracking-tight text-base flex items-center gap-1.5">
                CodeLoom <span className="text-indigo-400 text-xs px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 font-mono">DSA</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-mono">VISUALIZER</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-slate-100'
              }`}
            >
              Home
            </Link>

            <Link
              to="/algorithms"
              className={`text-sm font-medium transition-colors ${
                isActive('/algorithms') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-slate-100'
              }`}
            >
              Algorithms
            </Link>

            <Link
              to="/problems"
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/problems') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-slate-100'
              }`}
            >
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Problems</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/practice"
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/practice') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <Swords className="w-4 h-4 text-emerald-400" />
                  <span>Practice Arena</span>
                </Link>

                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/dashboard') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  Dashboard
                </Link>


                <Link
                  to="/analytics"
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/analytics') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Analytics & Badges</span>
                </Link>

                <Link
                  to="/favorites"
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/favorites') ? 'text-amber-400 font-semibold' : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                  Favorites
                </Link>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/admin') ? 'text-rose-400 font-semibold' : 'text-slate-300 hover:text-rose-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                Admin
              </Link>
            )}
          </div>

          {/* User Auth Buttons / User Identity */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-200">{user?.username}</span>
                    <span className="text-[9px] text-indigo-400 font-mono">
                      {isAdmin ? 'ADMIN' : 'USER'}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  leftIcon={<LogOut className="w-3.5 h-3.5" />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" leftIcon={<LogIn className="w-4 h-4" />}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800/60"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 bg-slate-950">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200 hover:text-indigo-400"
          >
            Home
          </Link>
          <Link
            to="/algorithms"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200 hover:text-indigo-400"
          >
            Algorithms
          </Link>
          <Link
            to="/problems"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200 hover:text-indigo-400"
          >
            Problems
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-200 hover:text-indigo-400"
              >
                Dashboard
              </Link>
              <Link
                to="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-200 hover:text-indigo-400"
              >
                Analytics & Badges
              </Link>
              <Link
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-200 hover:text-amber-400"
              >
                Favorites
              </Link>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-rose-400 hover:text-rose-300"
            >
              Admin Panel
            </Link>
          )}

          <div className="pt-4 border-t border-slate-800 space-y-2">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-900 rounded-lg">
                  <UserIcon className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-slate-200">{user?.username}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={handleLogout}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" fullWidth>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" fullWidth>
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
