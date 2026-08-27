import React, { useState } from 'react';
import { AlgorithmImplementation } from '../../types';
import { Check, Copy, Code2 } from 'lucide-react';

interface CodeSnippetViewerProps {
  implementations: AlgorithmImplementation[];
}

export const CodeSnippetViewer: React.FC<CodeSnippetViewerProps> = ({ implementations }) => {
  const [selectedLang, setSelectedLang] = useState<string>(
    implementations[0]?.language || 'JAVA'
  );
  const [copied, setCopied] = useState<boolean>(false);

  if (!implementations || implementations.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800">
        No code implementations available yet.
      </div>
    );
  }

  const activeImpl =
    implementations.find((impl) => impl.language.toUpperCase() === selectedLang.toUpperCase()) ||
    implementations[0];

  const handleCopy = () => {
    if (!activeImpl?.code) return;
    navigator.clipboard.writeText(activeImpl.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang.toUpperCase()) {
      case 'JAVA':
        return 'Java';
      case 'PYTHON':
        return 'Python';
      case 'JAVASCRIPT':
      case 'JS':
        return 'JavaScript';
      case 'CPP':
      case 'C++':
        return 'C++';
      default:
        return lang;
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
      {/* Header Bar with Language Switcher Tabs & Copy Button */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {implementations.map((impl) => {
            const isSelected = impl.language.toUpperCase() === selectedLang.toUpperCase();
            return (
              <button
                key={impl.language}
                onClick={() => setSelectedLang(impl.language)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {getLanguageLabel(impl.language)}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/50"
          title="Copy code snippet"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Display Area */}
      <div className="relative p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[400px]">
        <pre>
          <code>{activeImpl.code}</code>
        </pre>
      </div>

      {/* Code Explanation Footer if available */}
      {activeImpl.explanation && (
        <div className="px-4 py-2.5 bg-slate-900/50 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span>{activeImpl.explanation}</span>
        </div>
      )}
    </div>
  );
};
