// ============================================================
// DEADLINE GUARDIAN AI — Risk Meter Component
// ============================================================
'use client';
import { motion } from 'framer-motion';
import type { RiskLevel } from '@/types';

interface RiskMeterProps {
  probability: number;
  riskLevel: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const riskConfig = {
  low: { color: '#10b981', label: 'ON TRACK', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]' },
  medium: { color: '#f59e0b', label: 'WATCH OUT', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]' },
  high: { color: '#ef4444', label: 'AT RISK', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]' },
  critical: { color: '#dc2626', label: 'CRITICAL', glow: 'shadow-[0_0_30px_rgba(220,38,38,0.6)]' },
};

export default function RiskMeter({ probability, riskLevel, size = 'md', showLabel = true }: RiskMeterProps) {
  const config = riskConfig[riskLevel];
  const dims = { sm: 80, md: 120, lg: 160 };
  const dim = dims[size];
  const strokeWidth = size === 'sm' ? 6 : 8;
  const radius = (dim / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (probability / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative rounded-full ${config.glow}`} style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="rotate-[-90deg]">
          {/* Background ring */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <motion.circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="font-bold font-mono"
            style={{
              color: config.color,
              fontSize: size === 'sm' ? '1rem' : size === 'md' ? '1.5rem' : '2rem',
            }}
          >
            {probability}%
          </motion.span>
          {size !== 'sm' && (
            <span className="text-guardian-muted text-xs mt-0.5">SUCCESS</span>
          )}
        </div>
      </div>

      {showLabel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="px-3 py-1 rounded-full text-xs font-bold tracking-wider border"
          style={{
            color: config.color,
            borderColor: config.color + '40',
            backgroundColor: config.color + '15',
          }}
        >
          {config.label}
        </motion.div>
      )}
    </div>
  );
}
