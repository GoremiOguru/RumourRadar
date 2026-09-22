'use client';

import React from 'react';
import {
  X,
  ShieldAlert,
  Brain,
  Layers,
  Calculator,
  CheckCircle2,
  XCircle,
  Database,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface WhyRumorRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhyRumorRadarModal: React.FC<WhyRumorRadarModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel relative w-full max-w-4xl rounded-2xl overflow-hidden my-8 text-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                Why Rumor Radar?
              </h2>
              <p className="text-xs text-slate-400">
                A practical way to check fast-moving claims with Nigerian evidence.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Executive Summary Banner */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20 leading-relaxed text-slate-300">
            <strong className="text-emerald-300">Why this matters in Nigeria:</strong> A forwarded claim about a bank, election, health warning, school admission, or fuel price can reach thousands of people before an official correction does. Rumor Radar helps you test the claim, find the relevant Nigerian authority, and see clearly when the evidence is not strong enough for a confident verdict.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="border-l-2 border-emerald-500 pl-3">
              <h3 className="text-xs font-bold text-slate-200">Local context</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">Routes claims toward institutions Nigerians actually rely on.</p>
            </div>
            <div className="border-l-2 border-emerald-500 pl-3">
              <h3 className="text-xs font-bold text-slate-200">Visible evidence</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">Shows the sources behind the verdict instead of asking for blind trust.</p>
            </div>
            <div className="border-l-2 border-emerald-500 pl-3">
              <h3 className="text-xs font-bold text-slate-200">Room for uncertainty</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">Returns Unverified when the available evidence cannot support certainty.</p>
            </div>
          </div>

          {/* Comparison Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Head-to-Head Comparison
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-300">
                    <th className="p-3.5 font-bold">Feature / Capability</th>
                    <th className="p-3.5 font-bold text-rose-300 bg-rose-950/10 border-l border-r border-slate-800/60">Plain ChatGPT / Raw LLMs</th>
                    <th className="p-3.5 font-bold text-emerald-300 bg-emerald-950/20">Rumor Radar Pipeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="p-3.5 font-medium text-slate-200">
                      <strong>Grounding Mechanism</strong>
                      <p className="text-[11px] text-slate-400">Where the truth comes from</p>
                    </td>
                    <td className="p-3.5 text-slate-400 bg-rose-950/5 border-l border-r border-slate-800/60">
                      <div className="flex items-start gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span><strong>Memory-grounded:</strong> Confidently fabricates answers on breaking news outside its training cutoff.</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-200 bg-emerald-950/10">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Evidence-grounded:</strong> Prompt is forbidden from using pretraining memory; evaluates only retrieved live records.</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3.5 font-medium text-slate-200">
                      <strong>Retrieval Architecture</strong>
                      <p className="text-[11px] text-slate-400">How sources are discovered</p>
                    </td>
                    <td className="p-3.5 text-slate-400 bg-rose-950/5 border-l border-r border-slate-800/60">
                      <div className="flex items-start gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>Generic web search or single guess with no Nigerian regulatory awareness.</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-200 bg-emerald-950/10">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Google Fact Check Tools API + Nigeria-First Authority Router</strong> targeting CBN, INEC, NCDC, JAMB, etc.</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3.5 font-medium text-slate-200">
                      <strong>Source Ranking</strong>
                      <p className="text-[11px] text-slate-400">How credibility is calculated</p>
                    </td>
                    <td className="p-3.5 text-slate-400 bg-rose-950/5 border-l border-r border-slate-800/60">
                      <div className="flex items-start gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>Vibes / LLM token probability; no auditable scoring.</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-200 bg-emerald-950/10">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Deterministic Formula:</strong> 30% Authority + 25% Relevance + 20% Recency + 15% Corroboration + 10% Context.</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3.5 font-medium text-slate-200">
                      <strong>Verdict Schema</strong>
                      <p className="text-[11px] text-slate-400">Consistency of output</p>
                    </td>
                    <td className="p-3.5 text-slate-400 bg-rose-950/5 border-l border-r border-slate-800/60">
                      <div className="flex items-start gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>Free-form prose with inconsistent structure and unverified links.</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-200 bg-emerald-950/10">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Strict enum (<code className="text-emerald-300">Supported / Contradicted / Misleading / Unverified</code>) + 2–4 verified citations.</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3.5 font-medium text-slate-200">
                      <strong>Built-in Humility</strong>
                      <p className="text-[11px] text-slate-400">Handling lack of evidence</p>
                    </td>
                    <td className="p-3.5 text-slate-400 bg-rose-950/5 border-l border-r border-slate-800/60">
                      <div className="flex items-start gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>Tendency to generate plausible-sounding guesses even with zero facts.</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-200 bg-emerald-950/10">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Strict Fallback:</strong> If confidence falls below 60%, it deliberately yields <em>Unverified</em>.</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3.5 font-medium text-slate-200">
                      <strong>Production Hardening</strong>
                      <p className="text-[11px] text-slate-400">Speed, reliability & safety</p>
                    </td>
                    <td className="p-3.5 text-slate-400 bg-rose-950/5 border-l border-r border-slate-800/60">
                      <div className="flex items-start gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>Susceptible to prompt injections, jailbreaks, and satire confusion.</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-200 bg-emerald-950/10">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Pre-computed cache, rate-limit fallback chains, and adversarial satire defense tuned for Nigerian viral content.</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 6 Pillars Breakdown Cards */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              The 6 Architectural Pillars
            </h3>
            <div className="grid grid-flow-col auto-cols-[minmax(15rem,1fr)] gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <Brain className="w-4 h-4" />
                  <span>1. Evidence-Grounded, Not Memory-Grounded</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The LLM verifier prompt is explicitly blocked from relying on pretraining memory. It can only synthesize and reason over evidence retrieved live for that exact claim.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs">
                  <Database className="w-4 h-4" />
                  <span>2. Structured Retrieval & Authority Router</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Queries Google Fact Check Tools API and routes claims to official regulators (CBN, INEC, NCDC, WAEC) based on automatic claim categorization.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs">
                  <Calculator className="w-4 h-4" />
                  <span>3. Real Ranking Formula, Not Vibes</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evidence is ranked via an auditable formula: <code className="text-purple-300">0.30×Auth + 0.25×Rel + 0.20×Rec + 0.15×Corr + 0.10×Ctx</code> before it reaches the verifier.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs">
                  <Layers className="w-4 h-4" />
                  <span>4. Fixed Verdict Schema with Citations</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Produces strict typed verdicts (<code className="text-teal-300">SUPPORTED / CONTRADICTED / MISLEADING / UNVERIFIED</code>) alongside 2–4 verified source links and timestamps.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>5. Built-in Humility (&lt;60% Rule)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  If confidence falls below 60%, Rumor Radar automatically yields &quot;Unverified&quot; rather than hallucinating false certainty.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>6. Production & Adversarial Hardening</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Includes cache layer for viral instant replies, fallback provider chains, and protection against satire and WhatsApp chain-message jailbreaks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>NACOS National Hackathon • AI Track</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
