'use client';

import React, { useState } from 'react';
import { VerificationResult } from '@/types';
import { Activity, CheckCircle, ChevronDown, ChevronUp, Layers, Terminal } from 'lucide-react';

interface PipelineInspectorProps {
  result: VerificationResult;
}

export const PipelineInspector: React.FC<PipelineInspectorProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 backdrop-blur-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/60 hover:bg-slate-900/90 transition-colors text-left"
      >
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Pipeline Transparency Inspector
          </span>
          <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
            {result.processingTimeMs}ms total
          </span>
        </div>
        <div className="flex items-center space-x-1 text-slate-400 text-xs">
          <span>{isOpen ? 'Hide stages' : 'View 5 stages'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 space-y-3 border-t border-slate-800/80 bg-slate-950/90 font-mono text-xs">
          {result.pipelineStages.map((stage, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 font-semibold">{stage.stage}</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-5.5">{stage.details}</p>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                {stage.durationMs}ms
              </span>
            </div>
          ))}

          {/* Raw Claim Meta */}
          <div className="mt-3 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5 text-slate-300 font-bold mb-1">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Extracted Claim Meta</span>
            </div>
            <p><strong>Entity:</strong> {result.extractedClaim.entity}</p>
            <p><strong>Category:</strong> {result.extractedClaim.category}</p>
            <p><strong>Normalized:</strong> {result.extractedClaim.normalizedClaim}</p>
          </div>
        </div>
      )}
    </div>
  );
};
