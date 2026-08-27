import React from 'react';
import { Cpu, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                CodeLoom DSA Visualizer Platform
              </p>
              <p className="text-xs text-slate-500">
                Interactive step-by-step Data Structures & Algorithms learning engine.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a
              href="http://localhost:8080/swagger-ui/index.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-indigo-400 transition-colors"
            >
              <span>Swagger API Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/Sukhankar/DSA-VISUALIZER-BACKEND"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-indigo-400 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900/80 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} CodeLoom DSA Visualizer. Built with React, TypeScript & Spring Boot.
        </div>
      </div>
    </footer>
  );
};
