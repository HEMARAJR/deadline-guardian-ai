'use client';
import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import RescuePlanComponent from '@/components/RescuePlan';
import RiskMeter from '@/components/RiskMeter';
import { useStore } from '@/lib/store';
import { saveRescuePlan } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import type { RescuePlanResult, Task } from '@/types';

function RescueContent() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get('taskId');
  const { tasks } = useStore();
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [plan, setPlan] = useState<RescuePlanResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskId) {
      const found = tasks.find(t => t.id === taskId);
      if (found) setSelectedTask(found);
    }
  }, [taskId, tasks]);

  const highRiskTasks = tasks.filter(t => t.riskLevel === 'high' || t.riskLevel === 'critical');

  const generateRescue = async () => {
    if (!selectedTask || !user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/rescue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: selectedTask }),
      });
      const json = await res.json();
      if (json.success) {
        setPlan(json.data);
        await saveRescuePlan({
          userId: user.uid,
          taskId: selectedTask.id,
          taskTitle: selectedTask.title,
          createdAt: new Date().toISOString(),
          schedule: json.data.schedule,
          emergencyMode: json.data.emergencyMode,
          rescueScore: json.data.rescueScore,
          status: 'active',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid-bg min-h-screen">
      <Navbar title="Rescue Center" subtitle="Emergency deadline recovery system" />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {highRiskTasks.length === 0 && !selectedTask ? (
          <div className="bg-guardian-card rounded-xl border border-guardian-green/30 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">All Clear!</h3>
            <p className="text-guardian-muted">No high-risk tasks detected. Keep up the great work!</p>
          </div>
        ) : (
          <>
            {/* High Risk Task Selector */}
            {highRiskTasks.length > 0 && (
              <div className="bg-guardian-card rounded-xl border border-red-500/20 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h3 className="text-white font-semibold">Tasks Needing Rescue</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {highRiskTasks.map(task => (
                    <button
                      key={task.id}
                      onClick={() => { setSelectedTask(task); setPlan(null); }}
                      className={`text-left p-3 rounded-lg border transition-colors ${
                        selectedTask?.id === task.id
                          ? 'border-red-500 bg-red-500/10 text-white'
                          : 'border-red-500/20 bg-red-500/5 text-guardian-muted hover:text-white hover:border-red-500/40'
                      }`}
                    >
                      <div className="font-medium text-sm truncate">{task.title}</div>
                      <div className="text-xs mt-0.5 text-red-400">{task.successProbability}% success · {task.riskLevel.toUpperCase()}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedTask && (
              <>
                <div className="bg-guardian-card rounded-xl border border-guardian-border p-5 flex items-center gap-6">
                  <RiskMeter probability={selectedTask.successProbability} riskLevel={selectedTask.riskLevel} />
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">{selectedTask.title}</h3>
                    <p className="text-guardian-muted text-sm mt-1">
                      {selectedTask.estimatedHours - selectedTask.completedHours}h remaining work · 
                      Deadline: {new Date(selectedTask.deadline).toLocaleString()}
                    </p>
                    <button
                      onClick={generateRescue}
                      disabled={loading}
                      className="mt-3 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                    >
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                      {loading ? 'Generating Rescue Plan...' : 'Generate Emergency Rescue Plan'}
                    </button>
                  </div>
                </div>

                {plan && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <RescuePlanComponent plan={plan} taskTitle={selectedTask.title} />
                  </motion.div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function RescuePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <RescueContent />
    </Suspense>
  );
}
