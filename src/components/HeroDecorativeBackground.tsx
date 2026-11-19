'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const HeroDecorativeBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Stylized City Map Base with Roads, Contours, and Waterways */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-75"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <radialGradient id="mapRadarSweepGradient" cx="250" cy="250" r="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#005b9c" stopOpacity="0" />
            <stop offset="65%" stopColor="#005b9c" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#005b9c" stopOpacity="0.32" />
          </radialGradient>
        </defs>

        {/* Soft Background Tint: Matches base color #dcebf6 */}
        <rect width="1440" height="900" fill="#dcebf6" />

        {/* Soft Contour Blocks / Terrain Areas */}
        <path
          d="M 50 80 Q 200 40 380 90 T 520 280 T 360 480 T 120 440 T 40 220 Z"
          fill="#eaf3fa"
        />
        <path
          d="M 220 320 Q 450 260 620 380 T 780 620 T 550 780 T 260 680 Z"
          fill="#e5eff8"
          fillOpacity="0.6"
        />
        <path
          d="M 850 100 Q 1100 60 1280 180 T 1380 440 T 1150 560 T 900 380 Z"
          fill="#eaf3fa"
        />
        <path
          d="M 60 580 Q 220 540 380 640 T 440 860 T 180 890 Z"
          fill="#e2edf7"
          fillOpacity="0.7"
        />

        {/* Stylized River / Waterway in #005b9c tint */}
        <path
          d="M -60 280 C 180 340 360 220 620 310 C 920 420 1140 290 1500 360"
          stroke="#005b9c"
          strokeWidth="3.5"
          strokeOpacity="0.2"
          fill="none"
        />
        <path
          d="M -40 300 C 200 360 380 240 640 330 C 940 440 1160 310 1520 380"
          stroke="#005b9c"
          strokeWidth="1.5"
          strokeOpacity="0.12"
          fill="none"
        />

        {/* Primary White Arterial Roads (3-4px stroke) */}
        <g stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="-80" y1="160" x2="680" y2="520" />
          <line x1="120" y1="-60" x2="540" y2="780" />
          <line x1="420" y1="-40" x2="980" y2="720" />
          <line x1="-40" y1="460" x2="720" y2="880" />
          <line x1="320" y1="880" x2="1180" y2="280" />
          <line x1="780" y1="-40" x2="1480" y2="440" />
          <line x1="680" y1="780" x2="1480" y2="180" />
        </g>

        {/* Secondary White Neighborhood Roads (1.5-2px stroke) */}
        <g stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="0" y1="80" x2="520" y2="340" />
          <line x1="180" y1="120" x2="40" y2="420" />
          <line x1="380" y1="180" x2="160" y2="580" />
          <line x1="560" y1="280" x2="340" y2="680" />
          <line x1="80" y1="360" x2="480" y2="600" />
          <line x1="280" y1="440" x2="640" y2="660" />
          <line x1="520" y1="520" x2="920" y2="760" />
          <line x1="860" y1="160" x2="720" y2="480" />
          <line x1="1040" y1="240" x2="900" y2="580" />
          <line x1="1240" y1="340" x2="1080" y2="700" />
          <line x1="820" y1="420" x2="1280" y2="680" />
          <line x1="980" y1="520" x2="1440" y2="780" />
        </g>

        {/* Dashed Route Lines connecting the revised Pin positions */}
        <g fill="none">
          {/* Route 1: Top-Left to Mid-Left to Bottom-Left to Lower-Center */}
          <path
            d="M 60 170 L 45 460 L 115 720 L 720 790"
            stroke="#005b9c"
            strokeWidth="2"
            strokeDasharray="6 4"
            strokeOpacity="0.4"
          />
          {/* Route 2: Cross connector */}
          <path
            d="M 120 720 L 340 760 L 720 790 L 1100 700"
            stroke="#005b9c"
            strokeWidth="1.8"
            strokeDasharray="5 4"
            strokeOpacity="0.35"
          />
        </g>

        {/* Junction Node Dots */}
        <g fill="#005b9c" fillOpacity="0.6">
          <circle cx="60" cy="170" r="4" />
          <circle cx="45" cy="460" r="4" />
          <circle cx="115" cy="720" r="4" />
          <circle cx="720" cy="790" r="4" />
        </g>
        <g fill="#ffffff">
          <circle cx="60" cy="170" r="1.8" />
          <circle cx="45" cy="460" r="1.8" />
          <circle cx="115" cy="720" r="1.8" />
          <circle cx="720" cy="790" r="1.8" />
        </g>
      </svg>

      {/* 2. Soft Radial White Fade Behind Headline and Input */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.85)_40%,rgba(255,255,255,0)_75%)]" />

      {/* 3. Exactly 4 Floating Location Pins in #005b9c (strictly outside content column) */}
      {/* Pin 1: Top-Left Margin (Clear of headline) */}
      <div className="absolute top-[18%] left-[3%] sm:left-[5%] flex flex-col items-center animate-pin-float-1">
        <div className="relative">
          <svg width="22" height="30" viewBox="0 0 24 32" fill="none">
            <path
              d="M12 0C5.37258 0 0 5.37258 0 12C0 19.5 12 32 12 32C12 32 24 19.5 24 12C24 5.37258 18.6274 0 12 0Z"
              fill="#005b9c"
              fillOpacity="0.85"
            />
            <circle cx="12" cy="11" r="4" fill="#FFFFFF" />
          </svg>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-[#005b9c]/25 rounded-full blur-[1px]" />
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-2 border border-[#005b9c]/40 rounded-full animate-ping opacity-60" />
        </div>
      </div>

      {/* Pin 2: Mid-Far Left Margin (Clear of input box) */}
      <div className="absolute top-[50%] left-[2%] sm:left-[4%] flex flex-col items-center animate-pin-float-2">
        <div className="relative">
          <svg width="20" height="28" viewBox="0 0 24 32" fill="none">
            <path
              d="M12 0C5.37258 0 0 5.37258 0 12C0 19.5 12 32 12 32C12 32 24 19.5 24 12C24 5.37258 18.6274 0 12 0Z"
              fill="#005b9c"
              fillOpacity="0.8"
            />
            <circle cx="12" cy="11" r="3.5" fill="#FFFFFF" />
          </svg>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-1.5 bg-[#005b9c]/25 rounded-full blur-[1px]" />
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-2 border border-[#005b9c]/40 rounded-full animate-ping opacity-60" />
        </div>
      </div>

      {/* Pin 3: Bottom-Left Margin (Clear of viral chips) */}
      <div className="absolute top-[80%] left-[6%] sm:left-[9%] flex flex-col items-center animate-pin-float-3">
        <div className="relative">
          <svg width="20" height="28" viewBox="0 0 24 32" fill="none">
            <path
              d="M12 0C5.37258 0 0 5.37258 0 12C0 19.5 12 32 12 32C12 32 24 19.5 24 12C24 5.37258 18.6274 0 12 0Z"
              fill="#005b9c"
              fillOpacity="0.75"
            />
            <circle cx="12" cy="11" r="3.5" fill="#FFFFFF" />
          </svg>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-1.5 bg-[#005b9c]/20 rounded-full blur-[1px]" />
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-2 border border-[#005b9c]/35 rounded-full animate-ping opacity-60" />
        </div>
      </div>

      {/* Pin 4: Lower-Center (Desktop only to prevent overlap with mobile bottom nav) */}
      <div className="hidden sm:flex absolute top-[88%] left-1/2 -translate-x-1/2 flex-col items-center animate-pin-float-4">
        <div className="relative">
          <svg width="19" height="26" viewBox="0 0 24 32" fill="none">
            <path
              d="M12 0C5.37258 0 0 5.37258 0 12C0 19.5 12 32 12 32C12 32 24 19.5 24 12C24 5.37258 18.6274 0 12 0Z"
              fill="#005b9c"
              fillOpacity="0.7"
            />
            <circle cx="12" cy="11" r="3.5" fill="#FFFFFF" />
          </svg>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-1.5 bg-[#005b9c]/20 rounded-full blur-[1px]" />
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-2 border border-[#005b9c]/30 rounded-full animate-ping opacity-50" />
        </div>
      </div>

      {/* 4. Large Radar Graphic (Right Side) — Hidden on screens <768px to prevent mobile overlap */}
      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-3 sm:right-6 md:right-8 lg:right-12 w-[clamp(240px,26vw,380px)] aspect-square opacity-70 lg:opacity-85 pointer-events-none">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Concentric Radar Rings */}
          <circle cx="250" cy="250" r="65" stroke="#005b9c" strokeWidth="1.2" strokeOpacity="0.22" strokeDasharray="4 4" />
          <circle cx="250" cy="250" r="120" stroke="#005b9c" strokeWidth="1.5" strokeOpacity="0.28" />
          <circle cx="250" cy="250" r="175" stroke="#005b9c" strokeWidth="1.2" strokeOpacity="0.2" strokeDasharray="6 4" />
          <circle cx="250" cy="250" r="230" stroke="#005b9c" strokeWidth="1.5" strokeOpacity="0.25" />

          {/* Radial Crosshairs through exact center (250, 250) */}
          <line x1="20" y1="250" x2="480" y2="250" stroke="#005b9c" strokeWidth="1" strokeOpacity="0.22" strokeDasharray="3 3" />
          <line x1="250" y1="20" x2="250" y2="480" stroke="#005b9c" strokeWidth="1" strokeOpacity="0.22" strokeDasharray="3 3" />
          <line x1="75" y1="75" x2="425" y2="425" stroke="#005b9c" strokeWidth="0.8" strokeOpacity="0.14" />
          <line x1="75" y1="425" x2="425" y2="75" stroke="#005b9c" strokeWidth="0.8" strokeOpacity="0.14" />

          {/* Rotating Radar Sweep Sector (Anchored at 250, 250) */}
          <g className="animate-radar-sweep origin-[250px_250px]">
            <path
              d="M 250 250 L 480 250 A 230 230 0 0 1 412 412 Z"
              fill="url(#mapRadarSweepGradient)"
            />
          </g>

          {/* Azimuth Angle Tick Marks on the 175px circle */}
          {[...Array(24)].map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x1 = 250 + 171 * Math.cos(angle);
            const y1 = 250 + 171 * Math.sin(angle);
            const x2 = 250 + 179 * Math.cos(angle);
            const y2 = 250 + 179 * Math.sin(angle);
            return (
              <line
                key={`tick-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#005b9c"
                strokeWidth="1.2"
                strokeOpacity="0.3"
              />
            );
          })}
        </svg>

        {/* Shield Location Pin at the Center of Radar */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <svg
              width="58"
              height="74"
              viewBox="0 0 68 88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-md"
            >
              <path
                d="M34 0C15.2223 0 0 15.2223 0 34C0 56 34 88 34 88C34 88 68 56 68 34C68 15.2223 52.7777 0 34 0Z"
                fill="#005b9c"
              />
              <circle cx="34" cy="34" r="19" fill="#FFFFFF" />
            </svg>
            <div className="absolute top-[16px] left-[16px] w-6 h-6 flex items-center justify-center text-[#005b9c]">
              <ShieldCheck className="w-5 h-5 stroke-[2.4]" />
            </div>
          </div>
          <div className="relative -mt-1 flex items-center justify-center">
            <span className="w-6 h-2 bg-[#005b9c]/30 rounded-full blur-[1px]" />
            <span className="absolute w-10 h-3 border border-[#005b9c]/40 rounded-full animate-ping opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};
