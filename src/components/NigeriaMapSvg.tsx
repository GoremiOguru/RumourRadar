'use client';

import React, { useState } from 'react';
import { MapPin, Flame, Activity, ShieldCheck } from 'lucide-react';
import zonesData from '@/lib/nigeria-zones-data.json';
import { useTranslations } from '@/context/LanguageContext';

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
  const { t } = useTranslations();
  const [hoveredZone, setHoveredZone] = useState<GeopoliticalZone | null>(null);

  // Metadata for the 6 Geopolitical Zones
  const ZONE_META: Record<GeopoliticalZone, {
    label: string;
    center: [number, number];
    statesText: string;
    baseColor: string;
    hoverColor: string;
    activeColor: string;
  }> = {
    'North West': {
      label: 'North West',
      center: [330, 160],
      statesText: 'Kano, Kaduna, Katsina, Sokoto, Kebbi, Zamfara, Jigawa',
      baseColor: '#D5E7FA',
      hoverColor: '#93C5FD',
      activeColor: '#005A9C'
    },
    'North East': {
      label: 'North East',
      center: [680, 220],
      statesText: 'Borno, Yobe, Adamawa, Bauchi, Gombe, Taraba',
      baseColor: '#E2E8F0',
      hoverColor: '#CBD5E1',
      activeColor: '#2786D1'
    },
    'North Central': {
      label: 'North Central',
      center: [410, 380],
      statesText: 'Abuja (FCT), Plateau, Benue, Niger, Kwara, Kogi, Nasarawa',
      baseColor: '#EAF3FC',
      hoverColor: '#BFDBFE',
      activeColor: '#005A9C'
    },
    'South West': {
      label: 'South West',
      center: [180, 500],
      statesText: 'Lagos, Oyo, Ogun, Osun, Ondo, Ekiti',
      baseColor: '#E0F2FE',
      hoverColor: '#7DD3FC',
      activeColor: '#0284C7'
    },
    'South East': {
      label: 'South East',
      center: [420, 555],
      statesText: 'Enugu, Anambra, Imo, Abia, Ebonyi',
      baseColor: '#FEF3C7',
      hoverColor: '#FDE68A',
      activeColor: '#E6A23C'
    },
    'South South': {
      label: 'South South',
      center: [380, 630],
      statesText: 'Rivers, Delta, Edo, Akwa Ibom, Bayelsa, Cross River',
      baseColor: '#DCFCE7',
      hoverColor: '#86EFAC',
      activeColor: '#16A36A'
    }
  };

  const zonesList = Object.keys(ZONE_META) as GeopoliticalZone[];

  return (
    <div className="relative w-full rounded-3xl bg-white border border-[#D5E7FA] p-3 sm:p-5 shadow-sm overflow-hidden select-none">
      {/* Map Controls & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 pb-3 border-b border-[#D5E7FA]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#16A36A] animate-pulse" />
            <h4 className="text-sm font-bold text-[#0C2340] font-display">
              {t('map.subhead')}
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EAF3FC] text-[#005A9C] font-bold border border-[#D5E7FA]">
              36 States &amp; FCT
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            {t('map.instruction')}
          </p>
        </div>

        {/* Reset / All filter pill */}
        <button
          onClick={() => onSelectZone('ALL')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            selectedZone === 'ALL'
              ? 'bg-[#005A9C] text-white shadow-xs'
              : 'bg-[#EAF3FC] text-[#005A9C] hover:bg-blue-100'
          }`}
        >
          {t('map.viewAllBtn', { count: Object.values(zoneThreatCounts).reduce((a, b) => a + b, 0) })}
        </button>
      </div>

      {/* SVG Map Container */}
      <div className="relative w-full aspect-[954/734] max-h-[520px] mx-auto flex items-center justify-center">
        <svg
          viewBox="0 0 954 734"
          className="w-full h-full drop-shadow-sm transition-all"
        >
          {/* Render All 6 Geopolitical Zones with realistic boundary paths */}
          {zonesList.map((zone) => {
            const meta = ZONE_META[zone];
            const paths = (zonesData.zones as any)[zone] || [];
            const isSelected = selectedZone === zone;
            const isHovered = hoveredZone === zone;
            const hasCritical = (zoneCriticalCounts[zone] || 0) > 0;

            let fillColor = meta.baseColor;
            if (isSelected) {
              fillColor = meta.activeColor;
            } else if (isHovered) {
              fillColor = meta.hoverColor;
            }

            return (
              <g
                key={zone}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectZone(zone)}
                onMouseEnter={() => setHoveredZone(zone)}
                onMouseLeave={() => setHoveredZone(null)}
              >
                {paths.map((p: any, idx: number) => (
                  <path
                    key={`${zone}-${idx}`}
                    d={p.d}
                    fill={fillColor}
                    stroke={isSelected ? '#0C2340' : '#FFFFFF'}
                    strokeWidth={isSelected ? '2.5' : '1.2'}
                    strokeLinejoin="round"
                    className="transition-colors duration-200"
                  />
                ))}
              </g>
            );
          })}

          {/* Render Detailed State Internal & External Boundaries */}
          {zonesData.boundaries && zonesData.boundaries.map((b: any, idx: number) => (
            <path
              key={`boundary-${idx}`}
              d={b.d}
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="0.8"
              strokeDasharray="2,2"
              pointerEvents="none"
            />
          ))}

          {/* Zone Labels, Pins and Threat Badges */}
          {zonesList.map((zone) => {
            const meta = ZONE_META[zone];
            const [cx, cy] = meta.center;
            const count = zoneThreatCounts[zone] || 0;
            const critical = zoneCriticalCounts[zone] || 0;
            const isSelected = selectedZone === zone;
            const isHovered = hoveredZone === zone;

            return (
              <g
                key={`label-${zone}`}
                transform={`translate(${cx}, ${cy})`}
                className="pointer-events-none transition-transform duration-200"
                style={{ transform: isHovered || isSelected ? `translate(${cx}px, ${cy - 4}px) scale(1.08)` : `translate(${cx}px, ${cy}px)` }}
              >
                {/* Zone Pin Anchor */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? "18" : "15"}
                  fill={isSelected ? "#0C2340" : "#FFFFFF"}
                  stroke={isSelected ? "#FFFFFF" : meta.activeColor}
                  strokeWidth="2.5"
                  className="shadow-md"
                />

                {critical > 0 && (
                  <circle
                    cx="0"
                    cy="0"
                    r="22"
                    fill="none"
                    stroke="#E11D48"
                    strokeWidth="1.5"
                    className="animate-ping opacity-60"
                  />
                )}

                {/* Badge text / threat count inside pin */}
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="900"
                  fill={isSelected ? "#FFFFFF" : meta.activeColor}
                >
                  {count}
                </text>

                {/* Zone Name Label Card */}
                <g transform="translate(0, 24)">
                  <rect
                    x="-55"
                    y="-10"
                    width="110"
                    height="20"
                    rx="10"
                    fill={isSelected ? "#0C2340" : "#FFFFFF"}
                    stroke={isSelected ? "#005A9C" : "#D5E7FA"}
                    strokeWidth="1.5"
                    filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.08))"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="800"
                    fill={isSelected ? "#FFFFFF" : "#0C2340"}
                  >
                    {zone}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Hover / Active Floating Tooltip (Supports Mobile Tap & Desktop Hover) */}
        {(() => {
          const activeZone = hoveredZone || (selectedZone !== 'ALL' ? selectedZone : null);
          if (!activeZone) return null;
          return (
            <div className="absolute bottom-3 left-3 sm:left-4 z-20 pointer-events-none bg-white/95 backdrop-blur-md border border-[#D5E7FA] rounded-2xl p-3 shadow-xl max-w-xs animate-in fade-in">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-xs text-[#0C2340] font-display">
                  {activeZone}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF3FC] text-[#005A9C]">
                  {t('map.liveRumors', { count: zoneThreatCounts[activeZone] || 0 })}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1 leading-snug">
                {ZONE_META[activeZone].statesText}
              </p>
              {zoneCriticalCounts[activeZone] > 0 && (
                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-rose-600">
                  <Flame className="w-3 h-3 text-rose-500" />
                  <span>{t('map.highVelocityDetected', { count: zoneCriticalCounts[activeZone] })}</span>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Geopolitical Legend Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-3 pt-3 border-t border-[#D5E7FA]">
        {zonesList.map((z) => {
          const isSelected = selectedZone === z;
          return (
            <button
              key={`pill-${z}`}
              onClick={() => onSelectZone(z)}
              className={`p-2 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-[#EAF3FC] border-[#005A9C] shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold truncate ${isSelected ? 'text-[#005A9C]' : 'text-[#0C2340]'}`}>
                  {z}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 text-[#64748B] font-bold">
                  {zoneThreatCounts[z] || 0}
                </span>
              </div>
              <p className="text-[9px] text-[#64748B] truncate mt-0.5">
                {ZONE_META[z].statesText.split(',')[0]}...
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
