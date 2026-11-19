'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

interface HowToUseButtonProps {
  onClick: () => void;
  isInputTyping?: boolean;
  label?: string;
}

export const HowToUseButton: React.FC<HowToUseButtonProps> = ({ 
  onClick, 
  isInputTyping = false,
  label = 'How to Use?'
}) => {
  const [isHinting, setIsHinting] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const text = label;
  const chars = text.split('');

  // Subtle idle attention hint: rolls once every 9 seconds if not interacted with and not typing
  useEffect(() => {
    if (hasInteracted || isInputTyping) return;

    const interval = setInterval(() => {
      setIsHinting(true);
      hintTimeoutRef.current = setTimeout(() => {
        setIsHinting(false);
      }, 700);
    }, 9000);

    return () => {
      clearInterval(interval);
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, [hasInteracted, isInputTyping]);

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setIsHinting(false);
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    }
  };

  return (
    <button
      onClick={() => {
        handleInteraction();
        onClick();
      }}
      onMouseEnter={handleInteraction}
      onFocus={handleInteraction}
      aria-label="How to use"
      className={`how-to-use-btn group inline-flex items-center justify-center gap-1.5 sm:gap-2 h-8 sm:h-[38px] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-[12px] border border-[#005b9c]/25 hover:border-[#005b9c] bg-white text-xs sm:text-sm font-semibold text-[#0b2540] hover:text-[#005b9c] transition-colors shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005b9c]/35 focus-visible:ring-offset-2 shrink-0 whitespace-nowrap select-none cursor-pointer ${
        isHinting ? 'is-hinting' : ''
      }`}
    >
      {/* Play Icon: scales to 1.1, nudges 2px right, fill changes with 200ms ease */}
      <span className="shrink-0 transition-all duration-200 ease-out group-hover:scale-110 group-hover:translate-x-0.5 group-focus-visible:scale-110 group-focus-visible:translate-x-0.5">
        <Play className="w-3.5 h-3.5 text-[#005b9c] fill-transparent group-hover:fill-[#005b9c] group-focus-visible:fill-[#005b9c] transition-colors duration-200" />
      </span>

      {/* Rolling Text Container */}
      <span className="rolling-label" aria-hidden="true">
        {chars.map((char, idx) => (
          <span
            key={idx}
            className="rolling-char"
            style={{ '--i': idx } as React.CSSProperties}
          >
            <span className="char-top">
              {char === ' ' ? '\u00A0' : char}
            </span>
            <span className="char-bottom">
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </span>
    </button>
  );
};
