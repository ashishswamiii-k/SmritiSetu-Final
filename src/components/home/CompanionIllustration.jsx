import React from 'react';

export function CompanionIllustration() {
  return (
    <div className="card-product p-5 flex flex-col justify-between relative overflow-hidden bg-white shadow-xs">
      {/* Background Drifting Leaf Effect */}
      <div className="absolute top-2 right-6 pointer-events-none opacity-40 animate-drifting-leaf">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#7FA593">
          <path d="M17.5 3C10.5 3 4.5 9 4.5 16C4.5 18.5 6 21 8.5 21C15.5 21 21.5 15 21.5 8C21.5 5.5 20 3 17.5 3Z" />
        </svg>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B6461]">Daily Presence</span>
          <h3 className="text-base font-bold text-[#1B3A3A]">Warm Companionship</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-[#7FA593]/15 text-[#1B3A3A] rounded-full">
          Calm & Peaceful
        </span>
      </div>

      {/* SVG Illustration Container */}
      <div className="w-full h-36 bg-[#F6F3EC] rounded-xl flex items-center justify-center p-3 relative overflow-hidden border border-[#1B3A3A]/08">
        <svg viewBox="0 0 320 140" className="w-full h-full max-w-[280px]">
          {/* Table Base */}
          <rect x="70" y="105" width="180" height="12" rx="4" fill="#1B3A3A" opacity="0.15" />
          <rect x="80" y="95" width="160" height="10" rx="3" fill="#1B3A3A" opacity="0.85" />

          {/* Left Companion (Teal Outfit) */}
          <g className="animate-sway-left" style={{ transformOrigin: '110px 95px' }}>
            {/* Body */}
            <rect x="90" y="55" width="40" height="42" rx="12" fill="#1B3A3A" />
            {/* Head */}
            <circle cx="110" cy="40" r="16" fill="#F6F3EC" stroke="#1B3A3A" strokeWidth="2.5" />
            {/* Glasses */}
            <circle cx="106" cy="40" r="4.5" fill="none" stroke="#1B3A3A" strokeWidth="2" />
            <circle cx="116" cy="40" r="4.5" fill="none" stroke="#1B3A3A" strokeWidth="2" />
            <line x1="110.5" y1="40" x2="111.5" y2="40" stroke="#1B3A3A" strokeWidth="2" />
            {/* Gentle Smile */}
            <path d="M106 47 Q110 50 114 47" fill="none" stroke="#1B3A3A" strokeWidth="2" strokeLinecap="round" />
            {/* Arm holding cup */}
            <path d="M125 65 Q135 72 142 78" fill="none" stroke="#1B3A3A" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Right Companion (Coral Outfit) */}
          <g className="animate-sway-right" style={{ transformOrigin: '210px 95px' }}>
            {/* Body */}
            <rect x="190" y="55" width="40" height="42" rx="12" fill="#E8825F" />
            {/* Head */}
            <circle cx="210" cy="40" r="16" fill="#F6F3EC" stroke="#1B3A3A" strokeWidth="2.5" />
            {/* Hair bun */}
            <circle cx="224" cy="36" r="6" fill="#7FA593" />
            {/* Eye & Smile */}
            <circle cx="204" cy="39" r="1.5" fill="#1B3A3A" />
            <path d="M204 47 Q208 50 212 47" fill="none" stroke="#1B3A3A" strokeWidth="2" strokeLinecap="round" />
            {/* Arm holding cup */}
            <path d="M195 65 Q185 72 178 78" fill="none" stroke="#E8825F" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Center Teapot & Cups */}
          <g>
            {/* Teapot */}
            <path d="M152 85 Q160 72 168 85 Z" fill="#7FA593" stroke="#1B3A3A" strokeWidth="2" />
            <rect x="156" y="85" width="8" height="10" fill="#7FA593" stroke="#1B3A3A" strokeWidth="2" />
            <circle cx="160" cy="73" r="3" fill="#E8825F" />

            {/* Left Cup */}
            <rect x="140" y="85" width="8" height="8" rx="2" fill="#E8825F" stroke="#1B3A3A" strokeWidth="1.5" />
            {/* Right Cup */}
            <rect x="172" y="85" width="8" height="8" rx="2" fill="#1B3A3A" stroke="#1B3A3A" strokeWidth="1.5" />

            {/* Animated Tea Steam Curling Upward */}
            <path d="M144 80 Q142 74 145 70" fill="none" stroke="#E8825F" strokeWidth="1.5" strokeLinecap="round" className="animate-steam" />
            <path d="M176 80 Q178 74 175 70" fill="none" stroke="#7FA593" strokeWidth="1.5" strokeLinecap="round" className="animate-steam" style={{ animationDelay: '1s' }} />
          </g>
        </svg>
      </div>

      <p className="text-xs text-[#5B6461] mt-3 font-medium text-center italic">
        "Sharing tea and quiet moments together."
      </p>
    </div>
  );
}
