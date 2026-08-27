import React, { useState } from 'react';
import { GraphVisualizationRequest, GraphEdgeDto } from '../../types';
import { Button } from '../ui/Button';
import { Play, Network, AlertCircle } from 'lucide-react';

interface GraphInputProps {
  onGenerate: (graph: GraphVisualizationRequest) => void;
  isLoading?: boolean;
}

export const GraphInput: React.FC<GraphInputProps> = ({
  onGenerate,
  isLoading = false,
}) => {
  const [nodesStr, setNodesStr] = useState<string>('A, B, C, D, E');
  const [edgesStr, setEdgesStr] = useState<string>('A-B, A-C, B-D, C-E, D-E');
  const [startNode, setStartNode] = useState<string>('A');
  const [error, setError] = useState<string | null>(null);

  const parseAndValidate = (): GraphVisualizationRequest | null => {
    setError(null);

    // 1. Parse Nodes
    const trimmedNodes = nodesStr.trim();
    if (!trimmedNodes) {
      setError('Please provide graph nodes (e.g., A, B, C, D).');
      return null;
    }
    const nodes = Array.from(
      new Set(
        trimmedNodes
          .split(',')
          .map((n) => n.trim().toUpperCase())
          .filter((n) => n.length > 0)
      )
    );

    if (nodes.length === 0) {
      setError('At least one valid node is required.');
      return null;
    }

    // 2. Parse Start Node
    const trimmedStart = startNode.trim().toUpperCase();
    if (!trimmedStart) {
      setError('Start node is required.');
      return null;
    }
    if (!nodes.includes(trimmedStart)) {
      setError(`Start node "${trimmedStart}" must be one of the defined nodes (${nodes.join(', ')}).`);
      return null;
    }

    // 3. Parse Edges
    const edges: GraphEdgeDto[] = [];
    const rawEdgeTokens = edgesStr
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    for (const token of rawEdgeTokens) {
      // Supports formats: "A-B", "A->B", "A B"
      const match = token.split(/[-:> ]+/).map((s) => s.trim().toUpperCase());
      if (match.length >= 2 && match[0] && match[1]) {
        const from = match[0];
        const to = match[1];

        if (!nodes.includes(from)) {
          setError(`Edge endpoint "${from}" in "${token}" is not in the node list.`);
          return null;
        }
        if (!nodes.includes(to)) {
          setError(`Edge endpoint "${to}" in "${token}" is not in the node list.`);
          return null;
        }
        edges.push({ from, to });
      } else {
        setError(`Invalid edge format: "${token}". Use format "A-B" or "A->B".`);
        return null;
      }
    }

    return {
      nodes,
      edges,
      startNode: trimmedStart,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = parseAndValidate();
    if (result) {
      onGenerate(result);
    }
  };

  const handlePresetSample1 = () => {
    setNodesStr('A, B, C, D, E');
    setEdgesStr('A-B, A-C, B-D, C-E, D-E');
    setStartNode('A');
    setError(null);
  };

  const handlePresetSample2 = () => {
    setNodesStr('A, B, C, D, E, F, G');
    setEdgesStr('A-B, A-C, B-D, B-E, C-F, C-G');
    setStartNode('A');
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {/* Nodes Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Graph Nodes (comma-separated)
          </label>
          <input
            type="text"
            value={nodesStr}
            onChange={(e) => setNodesStr(e.target.value)}
            placeholder="e.g. A, B, C, D, E"
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Edges Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Directed Edges (comma or newline separated, e.g. A-B, A-C)
          </label>
          <textarea
            rows={2}
            value={edgesStr}
            onChange={(e) => setEdgesStr(e.target.value)}
            placeholder="e.g. A-B, A-C, B-D"
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Start Node Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Traversal Start Node
          </label>
          <input
            type="text"
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            placeholder="e.g. A"
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && (
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2 text-xs text-rose-400 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Preset Action Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium">Presets:</span>
        <button
          type="button"
          onClick={handlePresetSample1}
          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-md transition-colors cursor-pointer"
        >
          Graph (5 Nodes)
        </button>
        <button
          type="button"
          onClick={handlePresetSample2}
          className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Network className="w-3 h-3" />
          <span>Tree Graph (7 Nodes)</span>
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        isLoading={isLoading}
        leftIcon={<Play className="w-4 h-4 fill-white" />}
      >
        Generate Graph Visualization
      </Button>
    </form>
  );
};
