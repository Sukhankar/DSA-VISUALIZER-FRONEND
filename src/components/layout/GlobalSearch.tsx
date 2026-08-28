import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Code2, Terminal, Map, Layers, ArrowRight, X } from 'lucide-react';
import { algorithmService } from '../../api/algorithmService';
import { problemService } from '../../api/problemService';
import { getCategories } from '../../api/categoryService';
import { Algorithm, ProblemSummary } from '../../types';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Algorithm' | 'Problem' | 'Roadmap' | 'Category';
  url: string;
  badge?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Live search fetch
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [algoRes, probRes, catRes] = await Promise.allSettled([
          algorithmService.getAlgorithms({ search: query.trim(), size: 5 }),
          problemService.getProblems({ search: query.trim(), size: 5 }),
          getCategories(),
        ]);

        const items: SearchResultItem[] = [];

        // Algorithms
        if (algoRes.status === 'fulfilled' && algoRes.value?.content) {
          algoRes.value.content.forEach((algo: Algorithm) => {
            items.push({
              id: `algo-${algo.id}`,
              title: algo.name,
              subtitle: algo.description || `${algo.categoryName} Algorithm`,
              category: 'Algorithm',
              url: `/algorithms/${algo.slug}`,
              badge: algo.difficulty,
            });
          });
        }

        // Problems
        if (probRes.status === 'fulfilled' && probRes.value?.content) {
          probRes.value.content.forEach((prob: ProblemSummary) => {
            items.push({
              id: `prob-${prob.id}`,
              title: prob.title,
              subtitle: `Practice Problem • ${prob.categoryName}`,
              category: 'Problem',
              url: `/problems/${prob.slug}`,
              badge: prob.difficulty,
            });
          });
        }

        // Categories
        if (catRes.status === 'fulfilled' && catRes.value) {
          const matchedCats = catRes.value.filter((cat) =>
            cat.name.toLowerCase().includes(query.toLowerCase())
          );
          matchedCats.forEach((cat) => {
            items.push({
              id: `cat-${cat.id}`,
              title: cat.name,
              subtitle: cat.description || 'Algorithm Category',
              category: 'Category',
              url: `/algorithms?category=${cat.slug}`,
            });
          });
        }

        // Standard Roadmap shortcut
        if ('roadmap'.includes(query.toLowerCase())) {
          items.push({
            id: 'roadmap-main',
            title: 'DSA Learning Roadmap',
            subtitle: 'Structured step-by-step topic curriculum',
            category: 'Roadmap',
            url: '/roadmap',
          });
        }

        setResults(items);
        setSelectedIndex(0);
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        navigate(results[selectedIndex].url);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'Algorithm':
        return <Code2 className="w-4 h-4 text-indigo-400" />;
      case 'Problem':
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'Roadmap':
        return <Map className="w-4 h-4 text-amber-400" />;
      case 'Category':
        return <Layers className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl glass-panel rounded-2xl border border-slate-800 bg-[#0B1020]/95 shadow-2xl overflow-hidden flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search algorithms, practice problems, roadmap topics, categories..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800"
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Searching platform catalog...</span>
            </div>
          ) : query.trim() && results.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No matching algorithms or practice problems found for &quot;{query}&quot;
            </div>
          ) : !query.trim() ? (
            <div className="py-8 px-4 text-center space-y-3">
              <p className="text-xs text-slate-400">Type a search term to find algorithms, topics, or practice problems</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['Bubble Sort', 'Binary Search', 'Two Sum', 'Roadmap', 'Graphs'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 text-indigo-300 hover:border-indigo-500/40 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            results.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  navigate(item.url);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                  idx === selectedIndex ? 'bg-indigo-600/20 border border-indigo-500/40 text-slate-100' : 'hover:bg-slate-900 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-slate-100 truncate">{item.title}</h4>
                      <span className="px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-950 rounded border border-slate-800">
                        {item.category}
                      </span>
                    </div>
                    {item.subtitle && (
                      <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${
                        item.badge === 'EASY'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : item.badge === 'MEDIUM'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 bg-slate-900 border border-slate-800 rounded">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 py-0.5 bg-slate-900 border border-slate-800 rounded">↵</kbd> Select</span>
          </div>
          <span>CodeLoom Global Search</span>
        </div>
      </div>
    </div>
  );
};
