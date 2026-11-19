'use client';

import React, { useState } from 'react';
import { VerificationResult } from '@/types';
import { CheckCircle, ChevronDown, ChevronUp, Layers, Terminal } from 'lucide-react';

interface PipelineInspectorProps {
  result: VerificationResult;
}

export const PipelineInspector: React.FC<PipelineInspectorProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-[#D5E7FA] bg-white shadow-xs overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#F8FAFC] hover:bg-[#EAF3FC]/60 transition-colors text-left"
      >
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#005A9C]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#0C2340]">
            Pipeline Transparency Inspector
          </span>
          <span className="text-[10px] bg-[#EAF3FC] text-[#005A9C] px-2 py-0.5 rounded-full font-mono font-bold border border-[#D5E7FA]">
            {result.processingTimeMs}ms total
          </span>
        </div>
        <div className="flex items-center space-x-1 text-[#64748B] text-xs font-medium">
          <span>{isOpen ? 'Hide stages' : 'View execution stages'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 space-y-3 border-t border-[#D5E7FA] bg-white font-mono text-xs">
          {result.pipelineStages.map((stage, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#D5E7FA]"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#16A36A] shrink-0" />
                  <span className="text-[#0C2340] font-bold">{stage.stage}</span>
                </div>
                <p className="text-[11px] text-[#64748B] pl-5.5">{stage.details}</p>
              </div>
              <span className="text-[10px] text-[#005A9C] bg-[#EAF3FC] px-2 py-0.5 rounded-md border border-[#D5E7FA] font-bold shrink-0">
                {stage.durationMs}ms
              </span>
            </div>
          ))}

          {/* Raw Claim Meta */}
          <div className="mt-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#D5E7FA] text-[11px] text-[#64748B]">
            <div className="flex items-center space-x-1.5 text-[#0C2340] font-bold mb-1">
              <Terminal className="w-3.5 h-3.5 text-[#005A9C]" />
              <span>Extracted Claim Meta</span>
            </div>
            <p><strong>Entity:</strong> {result.extractedClaim.entity || 'General Claim'}</p>
            <p><strong>Category:</strong> {result.extractedClaim.category}</p>
            <p><strong>Language:</strong> {result.extractedClaim.detectedLanguage?.name || 'English'}</p>
          </div>
        </div>
      )}
    </div>
  );
};
