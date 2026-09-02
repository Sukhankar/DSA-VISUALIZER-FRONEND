import React from 'react';
import { VisualizationInputState } from '../../../types/inputState';
import { Eye, ArrowRight, Layers, GitBranch, Hash, GitMerge } from 'lucide-react';

interface InputPreviewProps {
  inputState: VisualizationInputState;
}

export const InputPreview: React.FC<InputPreviewProps> = ({ inputState }) => {
  const { structureType, input, listInput, stackInput, queueInput, trieInput, graph, hashTableInput, heapInput, slidingWindowInput, twoPointerInput } = inputState;

  return (
    <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl space-y-2">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[11px] font-mono">
        <span className="text-slate-400 font-bold flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Live Structure Preview</span>
        </span>
        <span className="text-[10px] text-cyan-400 font-bold px-2 py-0.5 bg-cyan-950/60 border border-cyan-500/30 rounded">
          {structureType}
        </span>
      </div>

      {/* Render Preview according to structureType */}
      <div className="py-2 overflow-x-auto min-h-[48px] flex items-center justify-center">
        {/* ARRAY / ARRAY_BARS / ARRAY_CELLS / POINTER_ARRAY */}
        {(structureType === 'ARRAY_BARS' || structureType === 'ARRAY_CELLS' || structureType === 'POINTER_ARRAY' || !structureType) && (
          <div className="flex items-center gap-1.5">
            {(input || [5, 1, 4, 2, 8]).map((val, idx) => (
              <div
                key={idx}
                className="w-8 h-9 rounded-lg bg-slate-900 border border-slate-700 flex flex-col items-center justify-center font-mono text-xs font-bold text-cyan-200"
              >
                <span>{val}</span>
                <span className="text-[8px] text-slate-500 font-normal">[{idx}]</span>
              </div>
            ))}
          </div>
        )}

        {/* TWO POINTERS */}
        {structureType === 'TWO_POINTERS' && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {(twoPointerInput?.values || input || [3, 8, 12, 17, 21]).map((val, idx, arr) => (
                <div
                  key={idx}
                  className={`w-9 h-10 rounded-lg border flex flex-col items-center justify-center font-mono text-xs font-bold ${
                    idx === 0
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                      : idx === arr.length - 1
                      ? 'bg-purple-950/80 border-purple-500 text-purple-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>{val}</span>
                  <span className="text-[8px] text-slate-400">
                    {idx === 0 ? 'L' : idx === arr.length - 1 ? 'R' : `[${idx}]`}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-[11px] font-mono text-amber-300 font-bold px-2 py-1 bg-slate-900 border border-slate-800 rounded">
              Target: {twoPointerInput?.targetSum || inputState.target || 29}
            </div>
          </div>
        )}

        {/* SLIDING WINDOW */}
        {structureType === 'SLIDING_WINDOW' && (
          <div className="flex items-center gap-1.5">
            {(slidingWindowInput?.values || input || [2, 1, 5, 1, 3, 2]).map((val, idx) => {
              const k = slidingWindowInput?.windowSize || 3;
              const inWindow = idx < k;
              return (
                <div
                  key={idx}
                  className={`w-8 h-9 rounded-lg border flex flex-col items-center justify-center font-mono text-xs font-bold ${
                    inWindow
                      ? 'bg-purple-950/90 border-purple-500 text-purple-100 shadow-md shadow-purple-950'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span>{val}</span>
                  <span className="text-[8px] text-slate-500">[{idx}]</span>
                </div>
              );
            })}
          </div>
        )}

        {/* LINKED LIST / DOUBLY LINKED LIST */}
        {(structureType === 'LINKED_LIST' || structureType === 'DOUBLY_LINKED_LIST') && (
          <div className="flex items-center gap-1.5">
            {(listInput || [10, 20, 30, 40, 50]).map((val, idx, arr) => (
              <React.Fragment key={idx}>
                <div className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs font-bold text-slate-200 shadow">
                  [{val}]
                </div>
                {idx < arr.length - 1 ? (
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                ) : (
                  <span className="text-[10px] font-mono text-rose-400 font-bold">→ NULL</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* STACK */}
        {structureType === 'STACK' && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-purple-400 font-bold mr-1">TOP →</span>
            {(stackInput || [10, 20, 30, 40]).slice().reverse().map((val, idx) => (
              <div
                key={idx}
                className="px-2.5 py-1 bg-purple-950/80 border border-purple-500/50 rounded-md font-mono text-xs font-bold text-purple-200"
              >
                [{val}]
              </div>
            ))}
          </div>
        )}

        {/* QUEUE */}
        {structureType === 'QUEUE' && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-cyan-400 font-bold">FRONT →</span>
            {(queueInput || [10, 20, 30, 40]).map((val, idx) => (
              <div
                key={idx}
                className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-md font-mono text-xs font-bold text-slate-200"
              >
                [{val}]
              </div>
            ))}
            <span className="text-[10px] font-mono text-purple-400 font-bold">← REAR</span>
          </div>
        )}

        {/* TREE / BST / AVL / BINARY_TREE */}
        {(structureType === 'BST' || structureType === 'AVL_TREE' || structureType === 'BINARY_TREE' || structureType === 'TREE') && (
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-purple-400 shrink-0" />
            <div className="flex items-center gap-1 font-mono text-xs">
              {(input || [50, 30, 70, 20, 40]).map((val, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${
                    idx === 0
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                      : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  {idx === 0 ? `Root:${val}` : val}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* HEAP */}
        {structureType === 'HEAP' && (
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-500/30 rounded font-bold">
              {heapInput?.heapType || 'MIN'} HEAP
            </span>
            <div className="flex items-center gap-1">
              {(heapInput?.values || input || [20, 15, 30, 10, 25, 5]).map((val, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-bold">
                  {val}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* GRAPH / WEIGHTED_GRAPH */}
        {(structureType === 'GRAPH' || structureType === 'WEIGHTED_GRAPH') && (
          <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
            <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-500/30 rounded font-bold">
              Nodes: [{(graph?.nodes || ['A', 'B', 'C', 'D', 'E']).join(', ')}]
            </span>
            <span className="text-slate-400">
              Edges: {graph?.edges ? graph.edges.length : 5}
            </span>
          </div>
        )}

        {/* HASH TABLE */}
        {structureType === 'HASH_TABLE' && (
          <div className="flex items-center gap-2 font-mono text-xs">
            <Hash className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300">
              Keys: [{(hashTableInput?.keys || ['apple', 'banana', 'cat', 'dog']).join(', ')}]
            </span>
          </div>
        )}

        {/* TRIE */}
        {structureType === 'TRIE' && (
          <div className="flex items-center gap-2 font-mono text-xs">
            <GitMerge className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300">
              Words: [{(trieInput || ['cat', 'car', 'card', 'care', 'dog']).join(', ')}]
            </span>
          </div>
        )}

        {/* RECURSION_TREE */}
        {structureType === 'RECURSION_TREE' && (
          <div className="flex items-center gap-2 font-mono text-xs">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-purple-300 font-bold">
              Recursion N = {inputState.recursionInput?.n || input?.[0] || 5}
            </span>
          </div>
        )}

        {/* CONVEX_HULL / POINT_SET */}
        {(structureType === 'CONVEX_HULL' || structureType === 'POINT_SET') && (
          <div className="flex items-center gap-3 font-mono text-xs text-slate-200">
            <span className="px-2 py-0.5 bg-purple-950/80 border border-purple-500/40 text-purple-300 rounded font-bold">
              Point Set ({inputState.pointsInput ? inputState.pointsInput.length : 6} points)
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs py-1">
              {(inputState.pointsInput || [
                { x: 1, y: 1, label: 'P1' },
                { x: 2, y: 5, label: 'P2' },
                { x: 5, y: 4, label: 'P3' },
                { x: 7, y: 2, label: 'P4' },
              ]).slice(0, 4).map((pt, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] text-cyan-300">
                  {pt.label || `P${idx+1}`}({pt.x},{pt.y})
                </span>
              ))}
              {(inputState.pointsInput?.length || 6) > 4 && (
                <span className="text-[10px] text-slate-400 font-bold">+{ (inputState.pointsInput?.length || 6) - 4 } more</span>
              )}
            </div>
          </div>
        )}

        {/* DP_TABLE */}
        {structureType === 'DP_TABLE' && (
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            {inputState.knapsackInput ? (
              <span>Knapsack Capacity = {inputState.knapsackInput.capacity} (Items = {inputState.knapsackInput.weights.length})</span>
            ) : (
              <span>DP Target N = {input?.[0] || 7}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
