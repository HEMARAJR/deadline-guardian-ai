// ============================================================
// DEADLINE GUARDIAN AI — Future Timeline Component
// ============================================================
'use client';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import type { SimulationScenario } from '@/types';

interface FutureTimelineProps {
  scenarios: SimulationScenario[];
}

export default function FutureTimeline({ scenarios }: FutureTimelineProps) {
  return (
    <div className="space-y-4">
      {/* Probability Bars */}
      <div className="space-y-3">
        {scenarios.map((scenario, i) => (
          <motion.div
            key={scenario.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-guardian-card rounded-xl p-4 border border-guardian-border"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-white font-semibold text-sm">{scenario.label}</span>
                <p className="text-guardian-muted text-xs mt-0.5">{scenario.description}</p>
              </div>
              <span
                className="text-2xl font-bold font-mono"
                style={{ color: scenario.color }}
              >
                {scenario.successProbability}%
              </span>
            </div>

            {/* Probability bar */}
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scenario.successProbability}%` }}
                transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: scenario.color }}
              />
            </div>

            {/* Impact breakdown */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {Object.entries(scenario.impact).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div
                    className="text-xs font-bold"
                    style={{ color: value > 0 ? '#10b981' : '#ef4444' }}
                  >
                    {value > 0 ? '+' : ''}{value}
                  </div>
                  <div className="text-guardian-muted text-xs capitalize">{key}</div>
                </div>
              ))}
            </div>

            <p className="mt-2 text-xs text-guardian-muted italic">{scenario.recommendation}</p>
          </motion.div>
        ))}
      </div>

      {/* Radar Chart */}
      {scenarios.length > 0 && (
        <div className="bg-guardian-card rounded-xl p-4 border border-guardian-border">
          <h4 className="text-white text-sm font-semibold mb-3">Impact Analysis — Start Now vs Best Delay</h4>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={[
              { axis: 'Productivity', now: scenarios[0]?.impact.productivity + 100, delay: (scenarios[2]?.impact.productivity || 0) + 100 },
              { axis: 'Low Stress', now: -scenarios[0]?.impact.stress + 100, delay: -(scenarios[2]?.impact.stress || 0) + 100 },
              { axis: 'Career', now: scenarios[0]?.impact.career + 100, delay: (scenarios[2]?.impact.career || 0) + 100 },
              { axis: 'Time', now: scenarios[0]?.impact.time + 100, delay: (scenarios[2]?.impact.time || 0) + 100 },
            ]}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar name="Start Now" dataKey="now" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
              <Radar name="Delay 24h" dataKey="delay" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
              <Tooltip
                contentStyle={{ background: '#111d35', border: '1px solid #1e3057', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#e2e8f0' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
