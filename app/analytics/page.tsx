'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AnalyticsChart from '@/components/AnalyticsChart';
import { useStore } from '@/lib/store';
import { BarChart3, TrendingUp, Award, Flame } from 'lucide-react';
import type { WeeklyDataPoint } from '@/types';

function generateWeekly(): WeeklyDataPoint[] {
  return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => ({
    day, tasks: Math.floor(Math.random()*6)+1, completed: Math.floor(Math.random()*5), risk: Math.floor(Math.random()*3)
  }));
}

export default function AnalyticsPage() {
  const { tasks } = useStore();
  const [weekly] = useState(generateWeekly);

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const avgProb = total > 0 ? Math.round(tasks.reduce((s,t) => s + t.successProbability, 0) / total) : 0;
  const highRisk = tasks.filter(t => t.riskLevel === 'high' || t.riskLevel === 'critical').length;
  const byCategory = tasks.reduce((acc, t) => { acc[t.category] = (acc[t.category]||0)+1; return acc; }, {} as Record<string,number>);

  const statCards = [
    { label: 'Total Tasks', value: total, icon: BarChart3, color: '#2563eb' },
    { label: 'Completion Rate', value: total > 0 ? `${Math.round(completed/total*100)}%` : '0%', icon: TrendingUp, color: '#10b981' },
    { label: 'Avg Success Prob', value: `${avgProb}%`, icon: Award, color: '#f59e0b' },
    { label: 'At Risk', value: highRisk, icon: Flame, color: '#ef4444' },
  ];

  return (
    <div className="grid-bg min-h-screen">
      <Navbar title="Analytics" subtitle="Your productivity intelligence" />
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(c => (
            <div key={c.label} className="bg-guardian-card rounded-xl p-5 border border-guardian-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-guardian-muted text-xs">{c.label}</span>
                <c.icon className="w-4 h-4" style={{color:c.color}} />
              </div>
              <div className="text-3xl font-black" style={{color:c.color}}>{c.value}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <AnalyticsChart data={weekly} title="Weekly Activity" type="area" />
          <AnalyticsChart data={weekly} title="Task Breakdown" type="bar" />
        </div>

        {Object.keys(byCategory).length > 0 && (
          <div className="bg-guardian-card rounded-xl border border-guardian-border p-5">
            <h3 className="text-white font-semibold mb-4">Tasks by Category</h3>
            <div className="space-y-3">
              {Object.entries(byCategory).map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-guardian-text capitalize">{cat}</span>
                    <span className="text-guardian-muted">{count} tasks</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-guardian-blue rounded-full" style={{width:`${(count/total)*100}%`}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Distribution */}
        <div className="bg-guardian-card rounded-xl border border-guardian-border p-5">
          <h3 className="text-white font-semibold mb-4">Risk Distribution</h3>
          <div className="grid grid-cols-4 gap-3">
            {(['low','medium','high','critical'] as const).map(level => {
              const count = tasks.filter(t => t.riskLevel === level).length;
              const colors = { low:'#10b981', medium:'#f59e0b', high:'#ef4444', critical:'#dc2626' };
              return (
                <div key={level} className="text-center p-4 rounded-xl border border-guardian-border bg-white/5">
                  <div className="text-2xl font-black" style={{color:colors[level]}}>{count}</div>
                  <div className="text-guardian-muted text-xs capitalize mt-1">{level}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
