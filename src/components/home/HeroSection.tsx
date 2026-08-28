import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Terminal } from 'lucide-react';
import { Button } from '../ui/Button';
import { AlgorithmIllustration } from './AlgorithmIllustration';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-[#0c1222]" style={{ minHeight: '280px' }}>
      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-purple-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[280px]">
        {/* ── Left content ── */}
        <div className="lg:col-span-6 p-8 lg:p-10 flex flex-col justify-center space-y-5">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            ✧ Interactive Data Structures &amp; Algorithms Engine
          </div>

          {/* Heading */}
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
            Visualize Algorithms with{' '}
            <br />
            <span className="text-gradient-precision">Precision</span>{' '}
            &amp;{' '}
            <span className="text-gradient-clarity">Clarity</span>
          </h1>

          {/* Description */}
          <p className="text-sm text-slate-400 leading-relaxed max-w-md">
            Explore step-by-step visual execution of sorting, searching,
            trees, dynamic programming, and graph algorithms. Master complex
            DSA concepts visually.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/algorithms">
              <Button
                size="md"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg border-0 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                Explore All Algorithms <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="http://localhost:8080/swagger-ui/index.html" target="_blank" rel="noreferrer">
              <Button
                variant="outline"
                size="md"
                className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2"
              >
                <Terminal className="w-4 h-4 text-indigo-400" />
                View OpenAPI Docs
              </Button>
            </a>
          </div>

          {/* Backend status */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50 shrink-0" />
            Backend Connected:{' '}
            <code className="text-indigo-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 font-mono text-[11px]">
              http://localhost:8080/api/v1
            </code>
          </div>
        </div>

        {/* ── Right: Algorithm illustration ── */}
        <div className="lg:col-span-6 relative flex items-center justify-center p-6 lg:p-8">
          <AlgorithmIllustration />
        </div>
      </div>
    </section>
  );
};
