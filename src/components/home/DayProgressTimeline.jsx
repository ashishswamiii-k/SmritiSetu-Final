import React, { useState, useEffect } from 'react';
import { Sun, Sunset, Moon, Coffee, Utensils } from 'lucide-react';

export function DayProgressTimeline() {
  const [progressPercent, setProgressPercent] = useState(50);
  const [currentSegment, setCurrentSegment] = useState('Afternoon');

  useEffect(() => {
    function calculateDayProgress() {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes();

      // Calculate progress starting from 6:00 AM (0%) to 6:00 AM next day (100%)
      const currentMinFrom6AM = (hours * 60 + mins - 360 + 1440) % 1440;
      const pct = Math.min(100, Math.max(2, Math.round((currentMinFrom6AM / 1440) * 100)));
      setProgressPercent(pct);

      // Determine segment label
      if (hours >= 6 && hours < 12) setCurrentSegment('Morning (6 AM - 12 PM)');
      else if (hours >= 12 && hours < 14) setCurrentSegment('Midday (12 PM - 2 PM)');
      else if (hours >= 14 && hours < 18) setCurrentSegment('Afternoon (2 PM - 6 PM)');
      else if (hours >= 18 && hours < 21) setCurrentSegment('Evening (6 PM - 9 PM)');
      else setCurrentSegment('Night (9 PM - 6 AM)');
    }

    calculateDayProgress();
    const interval = setInterval(calculateDayProgress, 60000);
    return () => clearInterval(interval);
  }, []);

  const segments = [
    { label: 'Morning', range: '6 AM - 12 PM', icon: Coffee },
    { label: 'Midday', range: '12 PM - 2 PM', icon: Utensils },
    { label: 'Afternoon', range: '2 PM - 6 PM', icon: Sun },
    { label: 'Evening', range: '6 PM - 9 PM', icon: Sunset },
    { label: 'Night', range: '9 PM - 6 AM', icon: Moon }
  ];

  return (
    <div className="card-product p-5 space-y-4 bg-white shadow-xs">
      {/* Title & Current Segment Info */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B6461]">Daily Rhythm</span>
          <h3 className="text-lg font-bold text-[#1B3A3A]">Day Progress</h3>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-[#F6F3EC] rounded-full border border-[#1B3A3A]/12 text-xs font-semibold text-[#1B3A3A]">
          <span className="w-2 h-2 rounded-full bg-[#E8825F] animate-pulse" />
          <span>Currently: {currentSegment}</span>
        </div>
      </div>

      {/* Segments Labels Grid */}
      <div className="grid grid-cols-5 gap-1 text-center">
        {segments.map((seg, idx) => {
          const Icon = seg.icon;
          return (
            <div key={idx} className="flex flex-col items-center space-y-1">
              <div className="w-7 h-7 rounded-lg bg-[#F6F3EC] text-[#1B3A3A] flex items-center justify-center border border-[#1B3A3A]/10">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#1B3A3A] hidden sm:block">{seg.label}</span>
              <span className="text-[10px] text-[#5B6461] block">{seg.range}</span>
            </div>
          );
        })}
      </div>

      {/* Animated Horizontal Timeline Track */}
      <div className="relative pt-3 pb-1">
        {/* Background Track */}
        <div className="w-full bg-[#F6F3EC] h-3 rounded-full overflow-hidden border border-[#1B3A3A]/12 relative">
          {/* Animated Coral Fill Bar */}
          <div
            className="bg-[#E8825F] h-full rounded-full animate-day-progress"
            style={{
              '--progress-target': `${progressPercent}%`,
              width: `${progressPercent}%`
            }}
          />
        </div>

        {/* Pulsing Coral Dot Landing at Current Position ("You Are Here") */}
        <div
          className="absolute top-1.5 transform -translate-x-1/2 pointer-events-none transition-all duration-1000"
          style={{ left: `${progressPercent}%` }}
          title={`You are here (${progressPercent}% through your day)`}
        >
          <div className="w-6 h-6 rounded-full bg-[#E8825F] border-2 border-white shadow-md flex items-center justify-center animate-dot-pulse">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
