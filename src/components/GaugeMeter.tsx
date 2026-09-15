import React from 'react';
import { StatusLevel } from '../types';

interface GaugeMeterProps {
  value: number; // 0 to 1 (or beyond)
  type: 'productivity' | 'cph' | 'commercial' | 'quality';
  label?: string;
  level: StatusLevel;
}

export const GaugeMeter: React.FC<GaugeMeterProps> = ({ value, type, level }) => {
  // Let's render a clean segmented status progress bar with threshold markers
  if (type === 'productivity') {
    // 0 to 100% (or up to 120%)
    const pct = Math.min(Math.max(value * 100, 0), 100);
    return (
      <div className="w-full mt-2">
        <div className="flex justify-between items-center text-[10px] text-[#6B7780] font-medium mb-1">
          <span>0%</span>
          <span className="text-[#C62828] font-semibold">Bronze &lt;70%</span>
          <span className="text-[#B77900] font-semibold">Prata 70-84%</span>
          <span className="text-[#2E7D32] font-semibold">Ouro ≥85%</span>
          <span>100%</span>
        </div>
        <div className="relative h-3 w-full bg-[#E9EEF1] rounded-full overflow-hidden flex border border-[#D5DDE2]">
          {/* Segment 1: Red (0 - 70%) */}
          <div className="w-[70%] h-full bg-[#C62828]/20 border-r border-[#C62828]/40" />
          {/* Segment 2: Yellow (70 - 85%) */}
          <div className="w-[15%] h-full bg-[#B77900]/25 border-r border-[#B77900]/40" />
          {/* Segment 3: Green (85 - 100%) */}
          <div className="w-[15%] h-full bg-[#2E7D32]/25" />

          {/* Value bar */}
          <div
            className={`absolute top-0 bottom-0 left-0 rounded-full transition-all duration-500 ${
              level === 'green'
                ? 'bg-[#2E7D32]'
                : level === 'yellow'
                ? 'bg-[#B77900]'
                : 'bg-[#C62828]'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  if (type === 'cph') {
    // Variance: <=5% green, 5-15% yellow, >15% red
    const varPct = value * 100;
    const barWidth = Math.min(Math.max((varPct / 40) * 100, 0), 100);
    return (
      <div className="w-full mt-2">
        <div className="flex justify-between items-center text-[10px] text-[#6B7780] font-medium mb-1">
          <span className="text-[#2E7D32] font-semibold">Blindado ≤5%</span>
          <span className="text-[#B77900] font-semibold">Atenção 5-15%</span>
          <span className="text-[#C62828] font-semibold">Alerta &gt;15%</span>
        </div>
        <div className="relative h-3 w-full bg-[#E9EEF1] rounded-full overflow-hidden flex border border-[#D5DDE2]">
          {/* Segment 1: Green (0 - 12.5% of bar representing 5% out of 40%) */}
          <div className="w-[12.5%] h-full bg-[#2E7D32]/25 border-r border-[#2E7D32]/40" />
          {/* Segment 2: Yellow (12.5 - 37.5% of bar representing 15% out of 40%) */}
          <div className="w-[25%] h-full bg-[#B77900]/25 border-r border-[#B77900]/40" />
          {/* Segment 3: Red (remaining) */}
          <div className="w-[62.5%] h-full bg-[#C62828]/20" />

          {/* Indicator */}
          <div
            className={`absolute top-0 bottom-0 left-0 rounded-full transition-all duration-500 ${
              level === 'green'
                ? 'bg-[#2E7D32]'
                : level === 'yellow'
                ? 'bg-[#B77900]'
                : 'bg-[#C62828]'
            }`}
            style={{ width: `${Math.max(barWidth, 4)}%` }}
          />
        </div>
      </div>
    );
  }

  if (type === 'quality') {
    // Quality Retrabalho: <=1% green, 1-2% yellow, >2% red
    const refugoPct = value * 100;
    const barWidth = Math.min(Math.max((refugoPct / 4) * 100, 0), 100);
    return (
      <div className="w-full mt-2">
        <div className="flex justify-between items-center text-[10px] text-[#6B7780] font-medium mb-1">
          <span className="text-[#2E7D32] font-semibold">Teto Tolerável ≤1%</span>
          <span className="text-[#B77900] font-semibold">Atenção 1-2%</span>
          <span className="text-[#C62828] font-semibold">Alerta &gt;2%</span>
        </div>
        <div className="relative h-3 w-full bg-[#E9EEF1] rounded-full overflow-hidden flex border border-[#D5DDE2]">
          {/* Segment 1: Green (0 - 25% of 4%) */}
          <div className="w-[25%] h-full bg-[#2E7D32]/25 border-r border-[#2E7D32]/40" />
          {/* Segment 2: Yellow (25 - 50% of 4%) */}
          <div className="w-[25%] h-full bg-[#B77900]/25 border-r border-[#B77900]/40" />
          {/* Segment 3: Red */}
          <div className="w-[50%] h-full bg-[#C62828]/20" />

          {/* Indicator */}
          <div
            className={`absolute top-0 bottom-0 left-0 rounded-full transition-all duration-500 ${
              level === 'green'
                ? 'bg-[#2E7D32]'
                : level === 'yellow'
                ? 'bg-[#B77900]'
                : 'bg-[#C62828]'
            }`}
            style={{ width: `${Math.max(barWidth, 4)}%` }}
          />
        </div>
      </div>
    );
  }

  return null;
};
