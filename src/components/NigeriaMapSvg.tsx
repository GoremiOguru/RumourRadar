'use client';

import React, { useState } from 'react';
import { MapPin, Flame, Activity } from 'lucide-react';

export type GeopoliticalZone = 
  | 'South West' 
  | 'South East' 
  | 'South South' 
  | 'North Central' 
  | 'North West' 
  | 'North East';

interface NigeriaMapSvgProps {
  selectedZone: GeopoliticalZone | 'ALL';
  onSelectZone: (zone: GeopoliticalZone | 'ALL') => void;
  zoneThreatCounts: Record<GeopoliticalZone, number>;
  zoneCriticalCounts: Record<GeopoliticalZone, number>;
}

export function NigeriaMapSvg({
  selectedZone,
  onSelectZone,
  zoneThreatCounts,
  zoneCriticalCounts
}: NigeriaMapSvgProps) {
  const [hoveredZone, setHoveredZone] = useState<GeopoliticalZone | null>(null);

  // SVG paths for the 6 Nigerian Geopolitical Zones (viewBox 0 0 800 650)
  const ZONES_DATA: Array<{
    id: GeopoliticalZone;
    label: string;
    path: string;
    center: [number, number];
    statesText: string;
    baseColor: string;
    activeColor: string;
  }> = [
    {
      id: 'North West',
      label: 'North West',
      // Northwest polygon covering Sokoto, Zamfara, Katsina, Kano, Jigawa, Kebbi, Kaduna
      path: 'M 70 80 L 260 50 L 440 60 L 460 180 L 400 240 L 330 260 L 220 280 L 140 230 L 70 190 Z',
      center: [260, 160],
      statesText: 'Kano, Kaduna, Katsina, Sokoto, Kebbi, Zamfara, Jigawa',
      baseColor: '#38bdf8', // Light Blue / Sky
      activeColor: '#0284c7'
    },
    {
      id: 'North East',
      label: 'North East',
      // Northeast polygon covering Borno, Yobe, Adamawa, Bauchi, Gombe, Taraba
      path: 'M 440 60 L 680 40 L 750 150 L 730 330 L 620 400 L 530 350 L 460 270 L 460 180 Z',
      center: [580, 190],
      statesText: 'Borno, Yobe, Adamawa, Bauchi, Gombe, Taraba',
      baseColor: '#a855f7', // Purple
      activeColor: '#7e22ce'
    },
    {
      id: 'North Central',
      label: 'North Central (Middle Belt)',
      // Middle Belt covering Niger, Kwara, FCT Abuja, Plateau, Benue, Kogi, Nasarawa
      path: 'M 140 230 L 220 280 L 330 260 L 400 240 L 460 270 L 530 350 L 580 450 L 470 480 L 330 460 L 200 410 L 120 340 Z',
      center: [340, 360],
      statesText: 'Abuja (FCT), Plateau, Benue, Niger, Kwara, Kogi, Nasarawa',
      baseColor: '#f59e0b', // Amber
      activeColor: '#d97706'
    },
    {
      id: 'South West',
      label: 'South West',
      // Southwest covering Lagos, Oyo, Ogun, Osun, Ondo, Ekiti
      path: 'M 120 340 L 200 410 L 260 440 L 240 550 L 170 570 L 80 520 L 70 420 Z',
      center: [160, 470],
      statesText: 'Lagos, Oyo, Ogun, Osun, Ondo, Ekiti',
      baseColor: '#10b981', // Emerald / Teal
      activeColor: '#059669'
    },
    {
      id: 'South South',
      label: 'South South (Niger Delta)',
      // South South covering Edo, Delta, Bayelsa, Rivers, Akwa Ibom, Cross River
      path: 'M 240 550 L 260 440 L 330 460 L 400 480 L 420 540 L 520 560 L 490 620 L 320 620 L 230 590 Z',
      center: [360, 560],
      statesText: 'Rivers, Delta, Edo, Akwa Ibom, Bayelsa, Cross River',
      baseColor: '#f43f5e', // Rose / Red
      activeColor: '#e11d48'
    },
    {
      id: 'South East',
      label: 'South East',
      // South East covering Enugu, Anambra, Imo, Abia, Ebonyi
      path: 'M 400 480 L 470 480 L 500 550 L 420 540 Z',
      center: [450, 510],
      statesText: 'Enugu, Anambra, Imo, Abia, Ebonyi',
      baseColor: '#06b6d4', // Cyan
      activeColor: '#0891b2'
    }
  ];

  return (
    <div className="relative w-full rounded-2xl bg-slate-950/90 border border-slate-800 p-3 sm:p-5 overflow-hidden shadow-2xl">
      {/* Map Header & Info Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span className="text-xs sm:text-sm font-bold text-slate-200">
            Interactive Geopolitical Zone Selector
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <button
            onClick={() => onSelectZone('ALL')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              selectedZone === 'ALL'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🇳🇬 All Nigeria View
          </button>
          <span className="text-slate-400 hidden sm:inline">• Tap any zone to filter</span>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[380px] flex items-center justify-center">
        <svg
          viewBox="40 20 730 610"
          className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-300"
        >
          {/* Subtle Nigeria Outer Border Glow */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {ZONES_DATA.map((zone) => {
            const isSelected = selectedZone === zone.id;
            const isHovered = hoveredZone === zone.id;
            const threatCount = zoneThreatCounts[zone.id] || 0;
            const criticalCount = zoneCriticalCounts[zone.id] || 0;

            return (
              <g
                key={zone.id}
                onClick={() => onSelectZone(isSelected ? 'ALL' : zone.id)}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                className="cursor-pointer transition-all duration-300"
              >
                {/* Zone Polygon Path */}
                <path
                  d={zone.path}
                  fill={isSelected ? zone.activeColor : zone.baseColor}
                  fillOpacity={isSelected ? 0.85 : isHovered ? 0.6 : 0.25}
                  stroke={isSelected ? '#ffffff' : isHovered ? zone.baseColor : '#334155'}
                  strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter={isSelected ? 'url(#glow)' : undefined}
                  className="transition-all duration-300 hover:scale-[1.01] transform-gpu origin-center"
                />

                {/* Zone Center Label Pill (Compact, translucent so map geometry is never blocked) */}
                <g transform={`translate(${zone.center[0]}, ${zone.center[1]})`}>
                  <rect
                    x="-52"
                    y="-14"
                    width="104"
                    height="28"
                    rx="6"
                    fill="#020617"
                    fillOpacity="0.78"
                    stroke={isSelected ? '#ffffff' : zone.baseColor}
                    strokeWidth={isSelected ? 1.5 : 0.8}
                  />
                  <text
                    x="0"
                    y="-2"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="9.5"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {zone.label}
                  </text>
                  <text
                    x="0"
                    y="8"
                    textAnchor="middle"
                    fill={criticalCount > 0 ? '#f43f5e' : '#34d399'}
                    fontSize="8"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    {threatCount} alerts {criticalCount > 0 ? `• 🔥 ${criticalCount} crit` : ''}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Active Zone & Telemetry Bar Below Map (No Overlap) */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="font-bold text-slate-100">
            {hoveredZone || (selectedZone !== 'ALL' ? selectedZone : 'All 6 Geopolitical Zones Active')}
          </span>
          <span className="text-slate-400 text-[11px] hidden md:inline">
            ({ZONES_DATA.find(z => z.id === (hoveredZone || selectedZone))?.statesText || 'National Federal Coverage'})
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono self-end sm:self-auto">
          <span className="text-slate-300">
            Total Monitored: <strong className="text-emerald-400">{Object.values(zoneThreatCounts).reduce((a, b) => a + b, 0)}</strong>
          </span>
          <span className="text-rose-400 font-bold">
            🔥 {Object.values(zoneCriticalCounts).reduce((a, b) => a + b, 0)} Critical
          </span>
        </div>
      </div>
    </div>
  );
}
