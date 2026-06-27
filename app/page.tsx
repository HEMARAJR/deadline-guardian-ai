// ============================================================
// DEADLINE GUARDIAN AI — Landing Page
// ============================================================
'use client';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Shield, Mic, Zap, AlertTriangle, BarChart3,
  ArrowRight, CheckCircle, Star, Users
} from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'Voice-First AI',
    description: 'Speak naturally. "I have a coding assessment tomorrow." Guardian creates the task, calculates risk, and plans your rescue.',
    color: '#2563eb',
  },
  {
    icon: AlertTriangle,
    title: 'Risk Prediction',
    description: 'Real-time deadline risk analysis. Know your success probability before it\'s too late.',
    color: '#ef4444',
  },
  {
    icon: Zap,
    title: 'Future Simulator',
    description: '"What if I delay 24 hours?" See exactly how procrastination kills your success probability.',
    color: '#f59e0b',
  },
  {
    icon: Shield,
    title: 'Rescue Planner',
    description: 'Emergency mode activated. AI generates a minute-by-minute rescue schedule to save your deadline.',
    color: '#10b981',
  },
];

const stats = [
  { value: '87%', label: 'Deadline Success Rate' },
  { value: '3.2x', label: 'Productivity Boost' },
  { value: '<30s', label: 'Task Creation via Voice' },
  { value: '24/7', label: 'AI Monitoring' },
];

export default function LandingPage() {
  const { user, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  return (
    <div className="min-h-screen bg-guardian-bg grid-bg overflow-hidden">
      {/* Ambient light effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-guardian-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-guardian-blue flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-sm tracking-wider">DEADLINE</span>
            <span className="text-guardian-blue font-mono text-sm ml-1">GUARDIAN AI</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-guardian-muted">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <button
            onClick={signIn}
            className="bg-guardian-blue hover:bg-guardian-blue-light text-white px-5 py-2 rounded-lg transition-colors font-medium"
          >
            Get Started Free
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-guardian-blue/10 border border-guardian-blue/30 text-guardian-blue text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-widest">
            <Zap className="w-3 h-3" />
            AI CHIEF-OF-STAFF PLATFORM
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Predict Missed
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-guardian-blue via-cyan-400 to-guardian-blue">
              Deadlines
            </span>
            <br />
            Before They Happen.
          </h1>

          <p className="text-xl text-guardian-muted max-w-2xl mx-auto leading-relaxed mb-10">
            Your AI Chief-of-Staff that listens to voice commands, calculates deadline risk in real-time,
            simulates future outcomes, and generates emergency rescue plans.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={signIn}
              className="flex items-center gap-3 bg-guardian-blue hover:bg-guardian-blue-light text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <div className="flex items-center gap-2 text-guardian-muted text-sm">
              <CheckCircle className="w-4 h-4 text-guardian-green" />
              Free forever · No credit card
            </div>
          </div>
        </motion.div>

        {/* Hero visual — mock dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 relative"
        >
          <div className="bg-guardian-surface rounded-2xl border border-guardian-border p-6 shadow-2xl shadow-black/50 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-3 text-guardian-muted text-xs font-mono">deadline-guardian.ai/dashboard</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: 'Active Tasks', value: '8', color: '#2563eb' },
                { label: 'Avg Success Rate', value: '74%', color: '#10b981' },
                { label: 'At Risk', value: '2', color: '#ef4444' },
              ].map(stat => (
                <div key={stat.label} className="bg-guardian-card rounded-lg p-3 border border-guardian-border">
                  <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-guardian-muted text-xs">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {[
                { title: 'Coding Assessment', deadline: '23h left', risk: 'critical', prob: 38 },
                { title: 'Resume Update', deadline: '3d left', risk: 'medium', prob: 72 },
                { title: 'Portfolio Project', deadline: '7d left', risk: 'low', prob: 91 },
              ].map((task) => {
                const riskColor = task.risk === 'critical' ? '#ef4444' : task.risk === 'medium' ? '#f59e0b' : '#10b981';
                return (
                  <div key={task.title} className="flex items-center gap-3 bg-guardian-card/60 rounded-lg p-3 border border-guardian-border">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: riskColor }} />
                    <span className="text-white text-sm flex-1">{task.title}</span>
                    <span className="text-guardian-muted text-xs">{task.deadline}</span>
                    <span className="text-sm font-bold font-mono" style={{ color: riskColor }}>{task.prob}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-4 top-8 bg-red-500 text-white rounded-xl p-3 shadow-lg shadow-red-500/30"
          >
            <AlertTriangle className="w-5 h-5" />
            <p className="text-xs font-bold mt-1">RESCUE</p>
            <p className="text-xs font-bold">NEEDED</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-black text-guardian-blue mb-1">{stat.value}</div>
              <div className="text-guardian-muted text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-3">
            Not a task manager. An AI Chief-of-Staff.
          </h2>
          <p className="text-guardian-muted">
            Every feature is designed to prevent failure before it happens.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-guardian-card rounded-xl p-6 border border-guardian-border hover:border-guardian-blue/30 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: feat.color + '20' }}
              >
                <feat.icon className="w-5 h-5" style={{ color: feat.color }} />
              </div>
              <h3 className="text-white font-bold text-base mb-2">{feat.title}</h3>
              <p className="text-guardian-muted text-sm leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-2xl mx-auto px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-guardian-surface rounded-2xl border border-guardian-blue/20 p-10"
          style={{ boxShadow: '0 0 60px rgba(37,99,235,0.1)' }}
        >
          <Shield className="w-12 h-12 text-guardian-blue mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-3">
            Stop missing deadlines.
          </h2>
          <p className="text-guardian-muted mb-8">
            Join thousands of students and professionals who trust Deadline Guardian AI.
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="text-guardian-muted text-sm">(4.9 / 5 from 2,400+ users)</span>
          </div>
          <button
            onClick={signIn}
            className="bg-guardian-blue hover:bg-guardian-blue-light text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)]"
          >
            Start Free — No Card Needed
          </button>
          <div className="flex items-center justify-center gap-6 mt-6 text-guardian-muted text-xs">
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-guardian-green" /> Google Sign-In</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-guardian-green" /> Voice Commands</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-guardian-green" /> AI Rescue Plans</span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-guardian-border py-8 text-center text-guardian-muted text-xs">
        <p>© 2025 Deadline Guardian AI · Built with Next.js, Firebase & Gemini AI</p>
      </footer>
    </div>
  );
}
