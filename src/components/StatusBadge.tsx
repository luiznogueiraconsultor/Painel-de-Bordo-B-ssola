import React from 'react';
import { StatusLevel } from '../types';
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface StatusBadgeProps {
  statusText: string;
  level: StatusLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  statusText,
  level,
  size = 'md',
  showIcon = true
}) => {
  const getColors = () => {
    switch (level) {
      case 'green':
        return {
          bg: 'bg-[#E8F5E9]',
          border: 'border-[#2E7D32]/30',
          text: 'text-[#2E7D32]',
          dot: 'bg-[#2E7D32]',
          icon: CheckCircle2,
        };
      case 'yellow':
        return {
          bg: 'bg-[#FFF4D6]',
          border: 'border-[#B77900]/30',
          text: 'text-[#B77900]',
          dot: 'bg-[#B77900]',
          icon: AlertTriangle,
        };
      case 'red':
      default:
        return {
          bg: 'bg-[#FDEAEA]',
          border: 'border-[#C62828]/30',
          text: 'text-[#C62828]',
          dot: 'bg-[#C62828]',
          icon: AlertOctagon,
        };
    }
  };

  const colors = getColors();
  const IconComponent = colors.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-3 py-1 text-xs sm:text-sm font-bold tracking-wide',
    lg: 'px-4 py-2 text-sm sm:text-base font-bold tracking-wide',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${colors.bg} ${colors.border} ${colors.text} ${sizeClasses} shadow-xs transition-all`}
    >
      <span className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`} />
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span className="truncate">{statusText}</span>
    </span>
  );
};
