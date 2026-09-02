import React, { useEffect, useState } from 'react';
import { visualizationService } from '../api/visualizationService';
import { VisualizationAuditDto, VisualizationAuditItem } from '../types/contract';
import { CheckCircle, AlertTriangle, XCircle, Search, RefreshCw, BarChart2, Layers, Cpu, Component } from 'lucide-react';

export const AdminVisualizationAuditPage: React.FC = () => {
  const [auditData, setAuditData] = useState<VisualizationAuditDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchAuditReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await visualizationService.getAuditReport();
      setAuditData(data);
    } catch (err: any) {
      console.error('Failed to load visualization audit report:', err);
      setError(err.message || 'Failed to connect to visualization audit service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditReport();
  }, []);

  const filteredItems = (auditData?.items || []).filter((item) => {
    const matchesSearch =
      item.algorithmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.algorithmSlug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rendererKey.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'READY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" /> READY
          </span>
        );
      case 'MISSING_GENERATOR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> NO GENERATOR
          </span>
        );
      case 'MISSING_RENDERER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> NO RENDERER
          </span>
        );
      case 'INVALID_DATA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> INVALID DATA
          </span>
        );
      case 'MISSING_CONTRACT':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <XCircle className="w-3.5 h-3.5" /> UNCONFIGURED
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Universal Visualization Audit
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Live database contract readiness, generator registration, and frontend renderer audit engine
            </p>
          </div>
          <button
            onClick={fetchAuditReport}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg font-medium text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Audit
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="text-sm font-medium">{error}</div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Algorithms</span>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{auditData?.totalAlgorithms ?? 0}</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Ready (Contract Engine)</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">{auditData?.readyCount ?? 0}</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Unconfigured / Missing</span>
              <XCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400">
              {(auditData?.missingContractCount ?? 0) + (auditData?.missingGeneratorCount ?? 0) + (auditData?.missingRendererCount ?? 0)}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Customizable vs Fixed</span>
              <BarChart2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-slate-200">
              <span className="text-blue-400">{auditData?.customizableCount ?? 0}</span> / <span className="text-slate-400">{auditData?.fixedDemoCount ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search algorithm, slug, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['ALL', 'READY', 'MISSING_CONTRACT', 'MISSING_GENERATOR', 'MISSING_RENDERER', 'INVALID_DATA'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Algorithm</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Visualization Type</th>
                  <th className="py-3.5 px-4">Generator Key</th>
                  <th className="py-3.5 px-4">Renderer Family</th>
                  <th className="py-3.5 px-4">Input Mode</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                      <div className="inline-flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                        Fetching live algorithm audit metadata...
                      </div>
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                      No algorithms matched current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.algorithmSlug} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-100">
                        {item.algorithmName}
                        <span className="block text-xs font-mono text-slate-500">{item.algorithmSlug}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="inline-block bg-slate-800/60 px-2 py-0.5 rounded text-xs text-slate-400">
                          {item.categoryName}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-blue-300">{item.visualizationType}</td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">{item.generatorKey}</td>
                      <td className="py-3 px-4 font-mono text-xs text-purple-300">{item.rendererKey}</td>
                      <td className="py-3 px-4 text-xs font-medium text-slate-300">
                        {item.inputMode === 'CUSTOMIZABLE' ? (
                          <span className="text-emerald-400">CUSTOMIZABLE</span>
                        ) : (
                          <span className="text-amber-400">FIXED DEMO</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">{getStatusBadge(item.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
