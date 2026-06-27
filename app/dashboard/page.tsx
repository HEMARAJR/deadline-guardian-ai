// ============================================================
// DEADLINE GUARDIAN AI — Dashboard Page
// ============================================================
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Shield, Zap, AlertTriangle, CheckCircle, Clock, Mic, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import TaskCard from '@/components/TaskCard';
import AnalyticsChart from '@/components/AnalyticsChart';
import { useStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import type { Task, WeeklyDataPoint } from '@/types';

// Generate sample weekly data
function generateWeeklyData(): WeeklyDataPoint[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    tasks: Math.floor(Math.random() * 5) + 1,
    completed: Math.floor(Math.random() * 4),
    risk: Math.floor(Math.random() * 3),
  }));
}

// Quick Add Task Modal
function QuickAddModal({ onClose, onAdd }: { onClose: () => void; onAdd: (t: Partial<Task>) => void }) {
  const [form, setForm] = useState({
    title: '',
    deadline: '',
    estimatedHours: 2,
    category: 'work' as Task['category'],
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-guardian-surface rounded-2xl border border-guardian-border p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">Add New Task</h2>
          <button onClick={onClose} className="text-guardian-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-guardian-muted text-xs font-medium block mb-1">Task Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g., Complete coding assessment"
              className="w-full bg-guardian-card border border-guardian-border rounded-lg px-4 py-3 text-white text-sm placeholder:text-guardian-muted focus:outline-none focus:border-guardian-blue transition-colors"
            />
          </div>

          <div>
            <label className="text-guardian-muted text-xs font-medium block mb-1">Deadline</label>
            <input
              type="datetime-local"
              value={form.deadline}
              onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
              className="w-full bg-guardian-card border border-guardian-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-guardian-blue transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-guardian-muted text-xs font-medium block mb-1">Estimated Hours</label>
              <input
                type="number"
                value={form.estimatedHours}
                min="0.5"
                max="100"
                step="0.5"
                onChange={e => setForm(f => ({ ...f, estimatedHours: parseFloat(e.target.value) }))}
                className="w-full bg-guardian-card border border-guardian-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-guardian-blue transition-colors"
              />
            </div>
            <div>
              <label className="text-guardian-muted text-xs font-medium block mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as Task['category'] }))}
                className="w-full bg-guardian-card border border-guardian-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-guardian-blue transition-colors"
              >
                {['work', 'study', 'personal', 'health', 'finance', 'other'].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              if (!form.title || !form.deadline) return;
              onAdd(form);
              onClose();
            }}
            disabled={!form.title || !form.deadline}
            className="w-full bg-guardian-blue hover:bg-guardian-blue-light disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
          >
            Add Task & Analyze Risk
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks } = useStore();
  const { fetchTasks, createTask, deleteTaskById, editTask } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [weeklyData] = useState(generateWeeklyData);
  const router = useRouter();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (formData: Partial<Task>) => {
    if (!user || !formData.title || !formData.deadline) return;

    const deadline = new Date(formData.deadline as string);
    const now = new Date();
    const hoursUntil = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    const hoursNeeded = formData.estimatedHours || 2;
    const ratio = hoursUntil / Math.max(hoursNeeded, 0.1);
    const prob = Math.min(95, Math.max(5, ratio * 60));

    let riskLevel: Task['riskLevel'] = 'low';
    if (prob < 30) riskLevel = 'critical';
    else if (prob < 55) riskLevel = 'high';
    else if (prob < 75) riskLevel = 'medium';

    await createTask({
      userId: user.uid,
      title: formData.title!,
      deadline: formData.deadline as string,
      estimatedHours: formData.estimatedHours || 2,
      completedHours: 0,
      status: 'pending',
      riskLevel,
      successProbability: Math.round(prob),
      subtasks: [],
      tags: [],
      category: formData.category || 'work',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const updatedSubtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    editTask(taskId, { subtasks: updatedSubtasks });
  };

  // Stats
  const totalTasks = tasks.length;
  const highRisk = tasks.filter(t => t.riskLevel === 'high' || t.riskLevel === 'critical').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const avgProb = tasks.length > 0
    ? Math.round(tasks.reduce((s, t) => s + t.successProbability, 0) / tasks.length)
    : 0;

  const metricCards = [
    { label: 'Total Tasks', value: totalTasks, icon: Shield, color: '#2563eb' },
    { label: 'Avg Success Rate', value: `${avgProb}%`, icon: Zap, color: '#10b981' },
    { label: 'At Risk', value: highRisk, icon: AlertTriangle, color: '#ef4444' },
    { label: 'Completed', value: completed, icon: CheckCircle, color: '#06b6d4' },
  ];

  return (
    <div className="grid-bg min-h-screen">
      <Navbar title="Dashboard" subtitle={`Welcome back${user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''} — AI Chief-of-Staff Active`} />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metricCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-guardian-card rounded-xl p-5 border border-guardian-border"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-guardian-muted text-xs font-medium">{card.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.color + '20' }}>
                  <card.icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
              </div>
              <div className="text-3xl font-black" style={{ color: card.color }}>{card.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tasks Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Active Tasks</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push('/command-center')}
                  className="flex items-center gap-2 bg-guardian-blue/10 hover:bg-guardian-blue/20 text-guardian-blue border border-guardian-blue/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Mic className="w-4 h-4" />
                  Voice Add
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-guardian-blue hover:bg-guardian-blue-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
            </div>

            {/* Task list */}
            {tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-guardian-card rounded-xl border border-guardian-border p-12 text-center"
              >
                <Shield className="w-12 h-12 text-guardian-muted mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No tasks yet</h3>
                <p className="text-guardian-muted text-sm mb-4">Add a task or use voice commands to get started.</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-guardian-blue text-white px-5 py-2.5 rounded-lg text-sm font-medium"
                  >
                    Add First Task
                  </button>
                  <button
                    onClick={() => router.push('/command-center')}
                    className="bg-white/5 text-white px-5 py-2.5 rounded-lg text-sm font-medium border border-guardian-border"
                  >
                    Use Voice
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={i}
                    onDelete={deleteTaskById}
                    onRescue={() => router.push(`/rescue?taskId=${task.id}`)}
                    onSimulate={() => router.push(`/simulator?taskId=${task.id}`)}
                    onToggleSubtask={handleToggleSubtask}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-guardian-card rounded-xl border border-guardian-border p-4">
              <h3 className="text-white font-semibold text-sm mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: Mic, label: 'Voice Command', href: '/command-center', color: '#2563eb' },
                  { icon: Zap, label: 'Run Simulation', href: '/simulator', color: '#f59e0b' },
                  { icon: AlertTriangle, label: 'Rescue Center', href: '/rescue', color: '#ef4444' },
                  { icon: Clock, label: 'Analytics', href: '/analytics', color: '#06b6d4' },
                ].map(action => (
                  <button
                    key={action.label}
                    onClick={() => router.push(action.href)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-guardian-muted hover:text-white"
                  >
                    <action.icon className="w-4 h-4" style={{ color: action.color }} />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Chart */}
            <AnalyticsChart data={weeklyData} title="This Week" />

            {/* High Risk Alert */}
            {highRisk > 0 && (
              <motion.div
                animate={{ borderColor: ['#ef444440', '#ef4444', '#ef444440'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-red-500/10 rounded-xl border p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-bold text-sm">Rescue Needed</span>
                </div>
                <p className="text-red-300/70 text-xs mb-3">
                  {highRisk} task{highRisk > 1 ? 's are' : ' is'} at high risk. Generate emergency rescue plans now.
                </p>
                <button
                  onClick={() => router.push('/rescue')}
                  className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Go to Rescue Center
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <QuickAddModal onClose={() => setShowModal(false)} onAdd={handleAddTask} />
      )}
    </div>
  );
}
