// ============================================================
// DEADLINE GUARDIAN AI — Analytics Chart Component
// ============================================================
'use client';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import type { WeeklyDataPoint } from '@/types';

interface AnalyticsChartProps {
  data: WeeklyDataPoint[];
  type?: 'area' | 'bar';
  title?: string;
}

const CustomTooltip = ({ active, payload, label }: {active?: boolean; payload?: {color: string; name: string; value: number}[]; label?: string}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-guardian-surface border border-guardian-border rounded-lg p-3 text-xs">
        <p className="text-guardian-muted mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsChart({ data, type = 'area', title }: AnalyticsChartProps) {
  return (
    <div className="bg-guardian-card rounded-xl p-4 border border-guardian-border">
      {title && <h4 className="text-white text-sm font-semibold mb-4">{title}</h4>}
      <ResponsiveContainer width="100%" height={180}>
        {type === 'area' ? (
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
            <Area type="monotone" dataKey="tasks" name="Tasks Created" stroke="#2563eb" fill="url(#gradTasks)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="completed" name="Completed" stroke="#10b981" fill="url(#gradCompleted)" strokeWidth={2} dot={false} />
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
            <Bar dataKey="tasks" name="Tasks" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="risk" name="At Risk" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
