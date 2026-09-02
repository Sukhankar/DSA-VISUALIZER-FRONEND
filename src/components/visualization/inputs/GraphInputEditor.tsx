import React, { useState, useEffect } from 'react';
import { VisualizationInputState, GraphNode, GraphEdge } from '../../../types/inputState';
import { Button } from '../../ui/Button';
import { Plus, Trash2, RotateCcw, Check, AlertTriangle, ArrowRight, Shuffle } from 'lucide-react';

interface GraphInputEditorProps {
  inputState: VisualizationInputState;
  onChange: (newState: VisualizationInputState) => void;
  onResetSample: () => void;
}

export const GraphInputEditor: React.FC<GraphInputEditorProps> = ({
  inputState,
  onChange,
  onResetSample,
}) => {
  const currentGraph = inputState.graph || {
    nodes: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
      { id: 'C', label: 'C' },
      { id: 'D', label: 'D' },
      { id: 'E', label: 'E' },
    ],
    edges: [
      { id: 'A-B', source: 'A', target: 'B', from: 'A', to: 'B', weight: 4 },
      { id: 'A-C', source: 'A', target: 'C', from: 'A', to: 'C', weight: 2 },
      { id: 'B-D', source: 'B', target: 'D', from: 'B', to: 'D', weight: 5 },
      { id: 'C-E', source: 'C', target: 'E', from: 'C', to: 'E', weight: 3 },
    ],
    startNode: 'A',
    directed: false,
    weighted: inputState.structureType === 'WEIGHTED_GRAPH',
  };

  const parsedNodes: GraphNode[] = (currentGraph.nodes || []).map((n) =>
    typeof n === 'string' ? { id: n, label: n } : n
  );

  const [nodesText, setNodesText] = useState<string>(parsedNodes.map((n) => n.id).join(', '));
  const [edges, setEdges] = useState<GraphEdge[]>(
    (currentGraph.edges || []).map((e) => ({
      id: e.id || `${e.source || e.from}-${e.target || e.to}`,
      source: e.source || e.from || 'A',
      target: e.target || e.to || 'B',
      from: e.from || e.source || 'A',
      to: e.to || e.target || 'B',
      weight: e.weight,
    }))
  );
  const [startNode, setStartNode] = useState<string>(currentGraph.startNode || 'A');
  const [targetNode, setTargetNode] = useState<string>(currentGraph.targetNode || '');
  const [directed, setDirected] = useState<boolean>(currentGraph.directed ?? false);
  const [weighted, setWeighted] = useState<boolean>(
    currentGraph.weighted ?? inputState.structureType === 'WEIGHTED_GRAPH'
  );

  const [newSource, setNewSource] = useState<string>('A');
  const [newTarget, setNewTarget] = useState<string>('B');
  const [newWeight, setNewWeight] = useState<string>('3');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (inputState.graph) {
      const pNodes: GraphNode[] = (inputState.graph.nodes || []).map((n) =>
        typeof n === 'string' ? { id: n, label: n } : n
      );
      setNodesText(pNodes.map((n) => n.id).join(', '));
      setEdges(
        (inputState.graph.edges || []).map((e) => ({
          id: e.id || `${e.source || e.from}-${e.target || e.to}`,
          source: e.source || e.from || 'A',
          target: e.target || e.to || 'B',
          from: e.from || e.source || 'A',
          to: e.to || e.target || 'B',
          weight: e.weight,
        }))
      );
      setStartNode(inputState.graph.startNode || (pNodes.length > 0 ? pNodes[0].id : 'A'));
      setTargetNode(inputState.graph.targetNode || '');
      setDirected(inputState.graph.directed ?? false);
      setWeighted(inputState.graph.weighted ?? inputState.structureType === 'WEIGHTED_GRAPH');
    }
  }, [inputState.graph, inputState.structureType]);

  const emitChange = (
    nList: GraphNode[],
    eList: GraphEdge[],
    sNode: string,
    tNode: string,
    isDirected: boolean,
    isWeighted: boolean
  ) => {
    if (nList.length === 0) {
      setErrorMsg('✕ Graph must contain at least 1 vertex.');
      return;
    }
    const nodeIds = nList.map((n) => n.id);
    if (!nodeIds.includes(sNode)) {
      sNode = nodeIds[0];
    }
    setErrorMsg(null);

    onChange({
      ...inputState,
      graph: {
        nodes: nList,
        edges: eList,
        startNode: sNode,
        targetNode: tNode,
        directed: isDirected,
        weighted: isWeighted,
      },
      customDataUsed: true,
    });
  };

  const handleNodesChange = (valStr: string) => {
    setNodesText(valStr);
    const names = valStr.split(/[\s,]+/).filter((t) => t.length > 0);
    const unique = Array.from(new Set(names));
    const newNodes: GraphNode[] = unique.map((id) => ({ id, label: id }));

    // Clean up edges referencing deleted nodes
    const validEdges = edges.filter((e) => unique.includes(e.source) && unique.includes(e.target));
    setEdges(validEdges);

    emitChange(newNodes, validEdges, startNode, targetNode, directed, weighted);
  };

  const handleAddEdge = () => {
    const src = newSource.trim().toUpperCase();
    const tgt = newTarget.trim().toUpperCase();
    const wt = weighted ? Number(newWeight) || 1 : undefined;

    if (!src || !tgt) {
      setErrorMsg('✕ Edge source and target cannot be empty.');
      return;
    }
    if (src === tgt) {
      setErrorMsg('✕ Self-loop edges are not recommended for graph visualizers.');
    }

    const nodeIds = parsedNodes.map((n) => n.id);
    if (!nodeIds.includes(src) || !nodeIds.includes(tgt)) {
      setErrorMsg(`✕ Source '${src}' and Target '${tgt}' must exist in node list.`);
      return;
    }

    const edgeId = `${src}-${tgt}`;
    const newEdge: GraphEdge = {
      id: edgeId,
      source: src,
      target: tgt,
      from: src,
      to: tgt,
      weight: wt,
    };

    const updatedEdges = [...edges, newEdge];
    setEdges(updatedEdges);
    emitChange(parsedNodes, updatedEdges, startNode, targetNode, directed, weighted);
  };

  const handleRemoveEdge = (idx: number) => {
    const updatedEdges = edges.filter((_, i) => i !== idx);
    setEdges(updatedEdges);
    emitChange(parsedNodes, updatedEdges, startNode, targetNode, directed, weighted);
  };

  const handleToggleDirected = () => {
    const nextDir = !directed;
    setDirected(nextDir);
    emitChange(parsedNodes, edges, startNode, targetNode, nextDir, weighted);
  };

  const handleToggleWeighted = () => {
    const nextW = !weighted;
    setWeighted(nextW);
    const updatedEdges = edges.map((e) => ({
      ...e,
      weight: nextW ? e.weight || 1 : undefined,
    }));
    setEdges(updatedEdges);
    emitChange(parsedNodes, updatedEdges, startNode, targetNode, directed, nextW);
  };

  const handleRandomize = () => {
    const defaultLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
    const count = 5 + Math.floor(Math.random() * 2);
    const rNodes: GraphNode[] = defaultLabels.slice(0, count).map((l) => ({ id: l, label: l }));

    const rEdges: GraphEdge[] = [];
    for (let i = 0; i < count; i++) {
      const next = (i + 1) % count;
      rEdges.push({
        id: `${rNodes[i].id}-${rNodes[next].id}`,
        source: rNodes[i].id,
        target: rNodes[next].id,
        from: rNodes[i].id,
        to: rNodes[next].id,
        weight: weighted ? Math.floor(Math.random() * 9) + 1 : undefined,
      });
    }
    // Add 2 random cross edges
    rEdges.push({
      id: `${rNodes[0].id}-${rNodes[2].id}`,
      source: rNodes[0].id,
      target: rNodes[2].id,
      from: rNodes[0].id,
      to: rNodes[2].id,
      weight: weighted ? Math.floor(Math.random() * 9) + 1 : undefined,
    });

    setNodesText(rNodes.map((n) => n.id).join(', '));
    setEdges(rEdges);
    setStartNode(rNodes[0].id);
    emitChange(rNodes, rEdges, rNodes[0].id, targetNode, directed, weighted);
  };

  return (
    <div className="space-y-4 font-mono text-xs text-slate-200 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
      {/* Toggles & Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={directed}
              onChange={handleToggleDirected}
              className="accent-indigo-500 w-4 h-4 rounded"
            />
            <span className="font-bold text-slate-300">Directed Edges (→)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={weighted}
              onChange={handleToggleWeighted}
              className="accent-purple-500 w-4 h-4 rounded"
            />
            <span className="font-bold text-slate-300">Weighted Edges (Wt)</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleRandomize}
            size="sm"
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] py-1 px-2.5 rounded-lg flex items-center gap-1"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" /> Randomize
          </Button>
          <Button
            onClick={onResetSample}
            size="sm"
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] py-1 px-2.5 rounded-lg flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Reset Sample
          </Button>
        </div>
      </div>

      {/* Graph Nodes Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-slate-300 font-bold">Graph Vertices (Nodes):</label>
          <span className="text-[11px] text-indigo-400 font-bold">{parsedNodes.length} vertices</span>
        </div>
        <input
          type="text"
          value={nodesText}
          onChange={(e) => handleNodesChange(e.target.value)}
          placeholder="e.g. A, B, C, D, E, F"
          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 outline-none transition-colors"
        />
      </div>

      {/* Start & Target Selectors */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-slate-300 font-bold">Start Vertex:</label>
          <select
            value={startNode}
            onChange={(e) => {
              setStartNode(e.target.value);
              emitChange(parsedNodes, edges, e.target.value, targetNode, directed, weighted);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
          >
            {parsedNodes.map((n) => (
              <option key={`start-${n.id}`} value={n.id}>
                Vertex {n.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-slate-300 font-bold">Target Vertex (Optional):</label>
          <select
            value={targetNode}
            onChange={(e) => {
              setTargetNode(e.target.value);
              emitChange(parsedNodes, edges, startNode, e.target.value, directed, weighted);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
          >
            <option value="">(None)</option>
            {parsedNodes.map((n) => (
              <option key={`target-${n.id}`} value={n.id}>
                Vertex {n.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Edge List Table */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-slate-300 font-bold">Graph Edges Network:</label>
          <span className="text-[11px] text-purple-400 font-bold">{edges.length} edges</span>
        </div>

        <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
          {edges.map((edge, idx) => (
            <div
              key={`edge-item-${idx}`}
              className="flex items-center justify-between bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-indigo-300">{edge.source}</span>
                <span className="text-slate-500 font-bold">{directed ? '──→' : '───'}</span>
                <span className="font-bold text-indigo-300">{edge.target}</span>
              </div>

              <div className="flex items-center gap-3">
                {weighted && (
                  <span className="text-amber-400 font-bold text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    weight = {edge.weight ?? 1}
                  </span>
                )}
                <button
                  onClick={() => handleRemoveEdge(idx)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                  title="Remove Edge"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Edge Controls */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
        <select
          value={newSource}
          onChange={(e) => setNewSource(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
        >
          {parsedNodes.map((n) => (
            <option key={`src-${n.id}`} value={n.id}>
              From: {n.label}
            </option>
          ))}
        </select>

        <ArrowRight className="w-4 h-4 text-slate-500" />

        <select
          value={newTarget}
          onChange={(e) => setNewTarget(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
        >
          {parsedNodes.map((n) => (
            <option key={`tgt-${n.id}`} value={n.id}>
              To: {n.label}
            </option>
          ))}
        </select>

        {weighted && (
          <input
            type="number"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="Weight"
            className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-center font-bold text-amber-300 outline-none"
          />
        )}

        <Button
          onClick={handleAddEdge}
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 ml-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Add Edge
        </Button>
      </div>

      {/* Validation Message */}
      {errorMsg ? (
        <div className="text-rose-400 font-bold flex items-center gap-2 bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : (
        <div className="text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/20 text-[11px]">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>
            ✓ Valid Graph Configuration ({parsedNodes.length} vertices, {edges.length} edges, Start Node: {startNode})
          </span>
        </div>
      )}
    </div>
  );
};
