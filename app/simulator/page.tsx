'use client';
import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Play, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FutureTimeline from '@/components/FutureTimeline';
import RiskMeter from '@/components/RiskMeter';
import { useStore } from '@/lib/store';
import type { FutureSimulationResult, Task } from '@/types';

function SimulatorContent() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get('taskId');
  const { tasks } = useStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [result, setResult] = useState<FutureSimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskId) {
      const found = tasks.find(t => t.id === taskId);
      if (found) setSelectedTask(found);
    }
  }, [taskId, tasks]);

  const runSimulation = async () => {
    if (!selectedTask) return;
    setLoading(true);
    try {
      const res = await fetch('/api/future', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: selectedTask, currentSuccessProbability: selectedTask.successProbability }),
      });
      const json = await res.json();
      if (json.success) setResult(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid-bg min-h-screen">
      <Navbar title="Future Simulator" subtitle="See what happens before it happens" />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Task Selector */}
        <div className="bg-guardian-card rounded-xl border border-guardian-border p-5">
          <h3 className="text-white font-semibold mb-3">Select Task to Simulate</h3>
          {tasks.length === 0 ? (
            <p className="text-guardian-muted text-sm">No tasks yet. Add tasks from the dashboard.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {tasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => { setSelectedTask(task); setResult(null); }}
                  className={`text-left p-3 rounded-lg border transition-colors text-sm ${
                    selectedTask?.id === task.id
                      ? 'border-guardian-blue bg-guardian-blue/10 text-white'
                      : 'border-guardian-border bg-white/5 text-guardian-muted hover:text-white hover:border-guardian-blue/50'
                  }`}
                >
                  <div className="font-medium truncate">{task.title}</div>
                  <div className="text-xs mt-0.5 text-guardian-muted">{task.successProbability}% success · {task.riskLevel}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedTask && (
          <>
            {/* Current State */}
            <div className="bg-guardian-card rounded-xl border border-guardian-border p-5 flex items-center gap-6">
              <RiskMeter probability={selectedTask.successProbability} riskLevel={selectedTask.riskLevel} size="md" />
              <div>
                <h3 className="text-white font-bold text-lg">{selectedTask.title}</h3>
                <p className="text-guardian-muted text-sm">Current state — {selectedTask.estimatedHours}h estimated · {selectedTask.completedHours}h done</p>
                <button
                  onClick={runSimulation}
                  disabled={loading}
                  className="mt-3 flex items-center gap-2 bg-guardian-blue hover:bg-guardian-blue-light text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  {loading ? 'Simulating...' : 'Run Future Simulation'}
                </button>
              </div>
            </div>

            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-guardian-amber" />
                  <h2 className="text-white font-bold text-lg">Simulation Results</h2>
                </div>
                <FutureTimeline scenarios={result.scenarios} />
                {result.bestCourseOfAction && (
                  <div className="mt-4 bg-guardian-blue/10 border border-guardian-blue/30 rounded-xl p-4">
                    <p className="text-xs text-guardian-blue font-bold mb-1 font-mono">AI RECOMMENDATION:</p>
                    <p className="text-white text-sm">{result.bestCourseOfAction}</p>
                  </div>
                )}
                {result.criticalPath?.length > 0 && (
                  <div className="mt-4 bg-guardian-card rounded-xl border border-guardian-border p-4">
                    <p className="text-white font-semibold text-sm mb-3">Critical Path</p>
                    <ol className="space-y-2">
                      {result.criticalPath.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="w-5 h-5 rounded-full bg-guardian-blue/20 text-guardian-blue text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                          <span className="text-guardian-text">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <SimulatorContent />
    </Suspense>
  );
}