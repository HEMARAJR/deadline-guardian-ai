// ============================================================
// DEADLINE GUARDIAN AI — AI Command Center
// ============================================================
'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, History, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import VoiceInterface from '@/components/VoiceInterface';
import { useStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { saveVoiceLog } from '@/lib/firestore';
import type { Task, VoiceCommandResult } from '@/types';

const EXAMPLE_COMMANDS = [
  "I have a coding assessment tomorrow at 5 PM",
  "Add a task: Update my resume, deadline in 3 days",
  "My project presentation is due Friday, I need 6 hours",
  "Create task: Build portfolio website, 2 weeks from now",
  "I need to study for exams, test is this weekend",
];

export default function CommandCenterPage() {
  const { user } = useAuth();
  const { addChatMessage, chatMessages } = useStore();
  const { createTask } = useTasks();
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [createdTask, setCreatedTask] = useState<Task | null>(null);

  const processCommand = useCallback(async (transcript: string) => {
    if (!transcript.trim() || !user) return;

    setIsProcessing(true);
    setAiResponse('');
    setCreatedTask(null);

    addChatMessage({
      role: 'user',
      content: transcript,
      timestamp: new Date(),
    });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, mode: 'voice' }),
      });

      const json = await res.json();
      const result = json.data as VoiceCommandResult;
      const responseText = result?.response || 'I heard you. Let me process that.';

      setAiResponse(responseText);
      addChatMessage({
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      });

      // If task was extracted, create it
      if (result?.intent === 'create_task' && result.extractedTask) {
        const et = result.extractedTask;
        let deadlineDate: string;

        // Parse natural language deadline
        if (et.deadline.toLowerCase().includes('tomorrow')) {
          const d = new Date();
          d.setDate(d.getDate() + 1);
          d.setHours(17, 0, 0, 0);
          deadlineDate = d.toISOString();
        } else if (et.deadline.toLowerCase().includes('friday')) {
          const d = new Date();
          const day = d.getDay();
          d.setDate(d.getDate() + ((5 - day + 7) % 7));
          d.setHours(17, 0, 0, 0);
          deadlineDate = d.toISOString();
        } else if (et.deadline.match(/\d{4}-\d{2}-\d{2}/)) {
          deadlineDate = et.deadline;
        } else {
          // Default: 24 hours from now
          const d = new Date();
          d.setDate(d.getDate() + 1);
          deadlineDate = d.toISOString();
        }

        const deadline = new Date(deadlineDate);
        const now = new Date();
        const hoursUntil = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
        const ratio = hoursUntil / Math.max(et.estimatedHours, 0.1);
        const prob = Math.min(95, Math.max(5, ratio * 60));

        let riskLevel: Task['riskLevel'] = 'low';
        if (prob < 30) riskLevel = 'critical';
        else if (prob < 55) riskLevel = 'high';
        else if (prob < 75) riskLevel = 'medium';

        const newTask = await createTask({
          userId: user.uid,
          title: et.title,
          description: et.description,
          deadline: deadlineDate,
          estimatedHours: et.estimatedHours,
          completedHours: 0,
          status: 'pending',
          riskLevel,
          successProbability: Math.round(prob),
          subtasks: [],
          tags: [],
          category: et.category,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          voiceCreated: true,
        });

        if (newTask) setCreatedTask(newTask as Task);
      }

      // Save voice log
      try {
        await saveVoiceLog({
          userId: user.uid,
          transcript,
          intent: result?.intent || 'unknown',
          extractedTask: result?.extractedTask as Partial<Task>,
          response: responseText,
          timestamp: new Date().toISOString(),
        });
      } catch {
        // Non-critical
      }
    } catch (error) {
      const errMsg = 'I ran into a technical issue. Please check your API configuration and try again.';
      setAiResponse(errMsg);
      addChatMessage({ role: 'assistant', content: errMsg, timestamp: new Date() });
    } finally {
      setIsProcessing(false);
    }
  }, [user, addChatMessage, createTask]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      processCommand(textInput.trim());
      setTextInput('');
    }
  };

  return (
    <div className="grid-bg min-h-screen">
      <Navbar title="AI Command Center" subtitle="Voice-first AI Chief-of-Staff" />

      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Voice Interface */}
          <div className="bg-guardian-card rounded-2xl border border-guardian-border p-8">
            <div className="text-center mb-8">
              <h2 className="text-white font-bold text-xl mb-2">Speak to Your AI</h2>
              <p className="text-guardian-muted text-sm">
                Tell me about your deadlines, tasks, or ask for help.
              </p>
            </div>

            <VoiceInterface
              onTranscript={processCommand}
              isProcessing={isProcessing}
              aiResponse={aiResponse}
            />

            {/* Created Task Confirmation */}
            <AnimatePresence>
              {createdTask && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-bold text-sm">Task Created!</span>
                  </div>
                  <p className="text-green-300/80 text-sm font-medium">{createdTask.title}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-guardian-muted">
                    <span>Risk: <span style={{ color: createdTask.riskLevel === 'critical' ? '#ef4444' : createdTask.riskLevel === 'high' ? '#f59e0b' : '#10b981' }}>{createdTask.riskLevel.toUpperCase()}</span></span>
                    <span>Success: {createdTask.successProbability}%</span>
                    <span>{createdTask.estimatedHours}h estimated</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Text Input + Examples */}
          <div className="space-y-4">
            {/* Text Input */}
            <div className="bg-guardian-card rounded-2xl border border-guardian-border p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-guardian-blue" />
                Type a Command
              </h3>
              <form onSubmit={handleTextSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder="e.g., I have an exam tomorrow at 9 AM"
                  className="flex-1 bg-guardian-bg border border-guardian-border rounded-lg px-4 py-3 text-white text-sm placeholder:text-guardian-muted focus:outline-none focus:border-guardian-blue transition-colors"
                  disabled={isProcessing}
                />
                <button
                  type="submit"
                  disabled={!textInput.trim() || isProcessing}
                  className="bg-guardian-blue hover:bg-guardian-blue-light disabled:opacity-50 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Example Commands */}
            <div className="bg-guardian-card rounded-2xl border border-guardian-border p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-guardian-amber" />
                Try These Commands
              </h3>
              <div className="space-y-2">
                {EXAMPLE_COMMANDS.map((cmd, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ x: 4 }}
                    onClick={() => processCommand(cmd)}
                    disabled={isProcessing}
                    className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-guardian-muted hover:text-white transition-colors text-sm border border-transparent hover:border-guardian-border disabled:opacity-50"
                  >
                    "{cmd}"
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Chat History */}
            {chatMessages.length > 0 && (
              <div className="bg-guardian-card rounded-2xl border border-guardian-border p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <History className="w-4 h-4 text-guardian-muted" />
                  Session History
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {chatMessages.slice(-6).map((msg, i) => (
                    <div key={i} className={`text-xs ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <span className={`inline-block px-3 py-2 rounded-lg max-w-[85%] ${
                        msg.role === 'user'
                          ? 'bg-guardian-blue/20 text-guardian-blue-light'
                          : 'bg-white/5 text-guardian-text'
                      }`}>
                        {msg.content}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
