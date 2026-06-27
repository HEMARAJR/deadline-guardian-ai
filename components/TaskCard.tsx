// ============================================================
// DEADLINE GUARDIAN AI — Task Card Component
// ============================================================
'use client';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, Zap, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import RiskMeter from './RiskMeter';
import type { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
  onRescue?: (task: Task) => void;
  onSimulate?: (task: Task) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  index?: number;
}

const categoryColors: Record<string, string> = {
  work: '#2563eb',
  study: '#7c3aed',
  personal: '#06b6d4',
  health: '#10b981',
  finance: '#f59e0b',
  other: '#64748b',
};

function timeUntilDeadline(deadline: Date | string): string {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff < 0) return 'OVERDUE';
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h left`;
  return `${h}h left`;
}

export default function TaskCard({ task, onDelete, onRescue, onSimulate, onToggleSubtask, index = 0 }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const catColor = categoryColors[task.category] || categoryColors.other;
  const timeLeft = timeUntilDeadline(task.deadline);
  const isOverdue = timeLeft === 'OVERDUE';
  const isHighRisk = task.riskLevel === 'high' || task.riskLevel === 'critical';

  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const progress = task.subtasks.length > 0
    ? Math.round((completedSubtasks / task.subtasks.length) * 100)
    : Math.round((task.completedHours / Math.max(task.estimatedHours, 0.1)) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-guardian-card rounded-xl border overflow-hidden ${
        task.riskLevel === 'critical'
          ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
          : task.riskLevel === 'high'
          ? 'border-orange-500/30'
          : 'border-guardian-border'
      }`}
    >
      {/* Category top bar */}
      <div className="h-0.5 w-full" style={{ backgroundColor: catColor }} />

      <div className="p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ color: catColor, backgroundColor: catColor + '20' }}
              >
                {task.category}
              </span>
              {isHighRisk && (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center gap-1 text-xs text-red-400 font-bold"
                >
                  <AlertTriangle className="w-3 h-3" />
                  {task.riskLevel.toUpperCase()}
                </motion.span>
              )}
            </div>
            <h3 className="text-white font-semibold text-sm leading-tight">{task.title}</h3>
          </div>

          <RiskMeter
            probability={task.successProbability}
            riskLevel={task.riskLevel}
            size="sm"
            showLabel={false}
          />
        </div>

        {/* Time & Progress */}
        <div className="mt-3 flex items-center gap-4 text-xs text-guardian-muted">
          <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
            <Clock className="w-3 h-3" />
            {timeLeft}
          </span>
          <span>{task.estimatedHours}h estimated</span>
          <span>{task.completedHours}h done</span>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-guardian-muted mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: catColor }}
            />
          </div>
        </div>

        {/* Subtasks toggle */}
        {task.subtasks.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-xs text-guardian-muted hover:text-white transition-colors"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {completedSubtasks}/{task.subtasks.length} subtasks
          </button>
        )}

        {/* Subtasks list */}
        {expanded && task.subtasks.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-2 space-y-1.5"
          >
            {task.subtasks.map(st => (
              <div
                key={st.id}
                onClick={() => onToggleSubtask?.(task.id, st.id)}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                  st.completed ? 'bg-guardian-green border-guardian-green' : 'border-guardian-border group-hover:border-guardian-blue'
                }`}>
                  {st.completed && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-xs ${st.completed ? 'line-through text-guardian-muted' : 'text-guardian-text'}`}>
                  {st.title}
                </span>
                <span className="ml-auto text-guardian-muted text-xs">{st.estimatedMinutes}m</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2">
          {isHighRisk && onRescue && (
            <button
              onClick={() => onRescue(task)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-medium transition-colors border border-red-500/30"
            >
              <AlertTriangle className="w-3 h-3" />
              Rescue
            </button>
          )}
          {onSimulate && (
            <button
              onClick={() => onSimulate(task)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-guardian-blue/20 hover:bg-guardian-blue/30 text-guardian-blue-light rounded-lg text-xs font-medium transition-colors border border-guardian-blue/30"
            >
              <Zap className="w-3 h-3" />
              Simulate
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="ml-auto p-1.5 text-guardian-muted hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
