// ============================================================
// DEADLINE GUARDIAN AI — Rescue Plan Component
// ============================================================
'use client';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Star, CheckCircle } from 'lucide-react';
import type { RescuePlanResult } from '@/types';

interface RescuePlanProps {
  plan: RescuePlanResult;
  taskTitle: string;
}

const priorityConfig = {
  critical: { color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: '🚨' },
  high: { color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: '⚡' },
  medium: { color: '#06b6d4', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: '📌' },
};

export default function RescuePlan({ plan, taskTitle }: RescuePlanProps) {
  return (
    <div className="space-y-4">
      {/* Emergency Header */}
      {plan.emergencyMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 flex items-center gap-3"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </motion.div>
          <div>
            <p className="text-red-400 font-bold text-sm tracking-wider">EMERGENCY MODE ACTIVATED</p>
            <p className="text-red-300/70 text-xs">Maximum focus protocol engaged for: {taskTitle}</p>
          </div>
        </motion.div>
      )}

      {/* Rescue Score */}
      <div className="bg-guardian-card rounded-xl p-4 border border-guardian-border flex items-center justify-between">
        <div>
          <p className="text-guardian-muted text-xs font-mono">RESCUE PROBABILITY</p>
          <p className="text-white text-2xl font-bold mt-0.5">{plan.rescueScore}%</p>
        </div>
        <div className="text-right">
          <p className="text-guardian-muted text-xs">If you follow this plan</p>
          <div className="flex gap-1 mt-1 justify-end">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3 h-3"
                fill={i < Math.round(plan.rescueScore / 20) ? '#f59e0b' : 'none'}
                stroke={i < Math.round(plan.rescueScore / 20) ? '#f59e0b' : '#64748b'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-guardian-blue/10 border border-guardian-blue/30 rounded-xl p-4">
        <p className="text-guardian-blue-light text-sm leading-relaxed font-medium">
          "{plan.motivationalMessage}"
        </p>
      </div>

      {/* Schedule */}
      <div>
        <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-guardian-blue" />
          Emergency Schedule
        </h4>
        <div className="space-y-2">
          {plan.schedule.map((block, i) => {
            const cfg = priorityConfig[block.priority];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`flex items-center gap-3 rounded-lg p-3 border ${cfg.bg} ${cfg.border}`}
              >
                <span className="text-base">{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{block.activity}</p>
                  <p className="text-guardian-muted text-xs">{block.time} · {block.duration}min</p>
                </div>
                <span
                  className="text-xs font-bold uppercase"
                  style={{ color: cfg.color }}
                >
                  {block.priority}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Milestones */}
      {plan.keyMilestones.length > 0 && (
        <div>
          <h4 className="text-white font-semibold text-sm mb-2">Key Milestones</h4>
          <div className="space-y-1.5">
            {plan.keyMilestones.map((milestone, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-guardian-green flex-shrink-0" />
                <span className="text-guardian-muted text-xs">{milestone}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
